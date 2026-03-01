import { NextResponse } from "next/server";
import sql from "../../../lib/db";

/**
 * GET /api/admin/points
 * Returns all point users (no passwords)
 */

export async function GET() {
  try {
    const facilities = await sql`
      SELECT
      id, 
       name,
        address,
        phone,
        email,
        capacity,
        type,
        contact_staff,
        status,
        created_at
      FROM facilities
      ORDER BY created_at DESC
    `;
// console.log('...',facilities)
    return NextResponse.json(facilities, { status: 200 });
    
  } catch (error) {
    console.error("GET facilities ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 },
    );
  }
}
