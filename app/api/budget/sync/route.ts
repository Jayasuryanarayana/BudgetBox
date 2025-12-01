import { NextRequest, NextResponse } from "next/server";
import { getBudgetByUserId, upsertBudget } from "@/lib/db";
import type { BudgetData } from "@/lib/types";
import { z } from "zod";

// Validation schema for budget object
const budgetDataSchema = z.object({
  id: z.string(),
  income: z.number(),
  expenses: z.object({
    bills: z.number(),
    food: z.number(),
    transport: z.number(),
    subscriptions: z.number(),
    miscellaneous: z.number(),
  }),
  lastUpdated: z.number(),
  isSynced: z.boolean(),
});

const syncRequestSchema = z.object({
  budget: budgetDataSchema,
  userId: z.string().min(1),
});

/**
 * POST /api/budget/sync
 * Push local data → server
 * Request body: budget object
 * Response: success + timestamp
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = syncRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { budget, userId } = validationResult.data;

    // Fetch existing record from database
    const existingRecord = await getBudgetByUserId(userId);

    // Conflict resolution: Last Write Wins
    if (existingRecord) {
      // If server has newer data (server wins)
      if (existingRecord.last_updated > budget.lastUpdated) {
        return NextResponse.json(
          {
            success: false,
            message: "Server has newer data",
            serverData: {
              ...existingRecord.data,
              isSynced: true,
            },
            timestamp: existingRecord.last_updated,
          },
          { status: 200 }
        );
      }

      // If client has newer data (client wins) - update database
      if (budget.lastUpdated > existingRecord.last_updated) {
        const serverTimestamp = Date.now();
        await upsertBudget(userId, budget, serverTimestamp);

        return NextResponse.json(
          {
            success: true,
            message: "Data synced successfully",
            timestamp: serverTimestamp,
          },
          { status: 200 }
        );
      }

      // If timestamps are equal, no update needed
      return NextResponse.json(
        {
          success: true,
          message: "Data is already up to date",
          timestamp: existingRecord.last_updated,
        },
        { status: 200 }
      );
    }

    // No existing record - create new one
    const serverTimestamp = Date.now();
    await upsertBudget(userId, budget, serverTimestamp);

    return NextResponse.json(
      {
        success: true,
        message: "Data created and synced successfully",
        timestamp: serverTimestamp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sync error:", error);

    // Handle database errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          message: error.message,
          timestamp: Date.now(),
        },
        { status: 500 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred",
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false,
      error: "Method not allowed. Use POST." 
    },
    { status: 405 }
  );
}

