import { NextResponse } from "next/server";
import sql from "../../../lib/db";

/**
 * GET /api/admin/points
 * Returns all point users (no passwords)
 */

export async function GET() {
  try {
    const vaccines= await sql`
      SELECT 
        id,
        name,
        code,
        manufacturer,
        doses_required,
        interval_days,
        description,
        status,
        age_max,
        age_min,
        created_at
      FROM vaccine_types
      ORDER BY created_at DESC
    `;
  

    return NextResponse.json(vaccines, { status: 200 });

  } catch (error) {
    console.error("GET POINT USERS ERROR:", error);

    return NextResponse.json([
      { error: "Failed to fetch vaccine" },
      { status: 500 }]
    );
  }
}
