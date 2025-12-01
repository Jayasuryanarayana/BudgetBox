import type { BudgetData } from "@/lib/types";

interface BudgetRecord {
  user_id: string;
  data: BudgetData;
  last_updated: number;
}

/**
 * Supabase database functions
 * Uses @supabase/supabase-js client
 */

let supabaseClient: any = null;

async function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Dynamic import to avoid SSR issues
  const { createClient } = await import("@supabase/supabase-js");
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

export async function getBudgetByUserId(
  userId: string
): Promise<BudgetRecord | null> {
  try {
    const supabase = await getSupabaseClient();
    
    const { data, error } = await supabase
      .from("budgets")
      .select("user_id, data, last_updated")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned - this is normal for new users
        return null;
      }
      // Log detailed error for debugging
      console.error("Supabase query error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(
        `Supabase error: ${error.message} (Code: ${error.code})`
      );
    }

    if (!data) {
      return null;
    }

    return {
      user_id: data.user_id,
      data: data.data as BudgetData,
      last_updated: data.last_updated,
    };
  } catch (error) {
    console.error("Error fetching budget from Supabase:", error);
    throw error;
  }
}

export async function upsertBudget(
  userId: string,
  data: BudgetData,
  lastUpdated: number
): Promise<void> {
  try {
    const supabase = await getSupabaseClient();

    const { error } = await supabase
      .from("budgets")
      .upsert(
        {
          user_id: userId,
          data: data,
          last_updated: lastUpdated,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      // Log detailed error for debugging
      console.error("Supabase upsert error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(
        `Supabase upsert error: ${error.message} (Code: ${error.code})`
      );
    }
  } catch (error) {
    console.error("Error upserting budget to Supabase:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while saving to Supabase");
  }
}
