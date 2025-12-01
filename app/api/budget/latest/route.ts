import { NextRequest, NextResponse } from "next/server";
import { getBudgetByUserId } from "@/lib/db";
import { z } from "zod";

/**
 * GET /api/budget/latest
 * Fetch last saved server version
 * Query params: userId (required)
 * Return: latest budget object
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    // Validate userId
    if (!userId || userId.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing userId parameter",
          message: "userId is required in query parameters",
        },
        { status: 400 }
      );
    }

    // Fetch latest budget from database
    const budgetRecord = await getBudgetByUserId(userId);

    if (!budgetRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "No budget found",
          message: "No budget data found for this user",
        },
        { status: 404 }
      );
    }

    // Return latest budget object
    return NextResponse.json(
      {
        success: true,
        budget: {
          ...budgetRecord.data,
          isSynced: true, // Mark as synced when returned from server
        },
        timestamp: budgetRecord.last_updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get latest budget error:", error);

    // Handle database errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          message: error.message,
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
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { 
      success: false,
      error: "Method not allowed. Use GET." 
    },
    { status: 405 }
  );
}

