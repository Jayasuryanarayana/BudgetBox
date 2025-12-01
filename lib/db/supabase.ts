import type { BudgetData } from "@/lib/types";

interface BudgetRecord {
  user_id: string;
  data: BudgetData;
  last_updated: number;
}

/**
 * Supabase database functions
 * Uses Supabase client for PostgreSQL operations
 */

let supabaseClient: any = null;

async function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Dynamic import to avoid issues in non-browser environments
  if (typeof window === "undefined") {
    // Server-side: use @supabase/supabase-js
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are not configured");
      }

      supabaseClient = createClient(supabaseUrl, supabaseKey);
      return supabaseClient;
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
      throw new Error("Supabase client initialization failed");
    }
  }

  throw new Error("Supabase client should be initialized server-side");
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
        // No rows returned
        return null;
      }
      throw error;
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
      throw error;
    }
  } catch (error) {
    console.error("Error upserting budget to Supabase:", error);
    throw error;
  }
}

