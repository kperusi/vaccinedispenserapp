import { NextResponse } from "next/server";
import sql from "../../../lib/db";

/**
 * GET /api/admin/points
 * Returns all point users (no passwords)
 */
export async function GET() {
  try {
    const users = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.is_active,
        u.created_at,
        u.last_login,
        f.name AS facility
      FROM users u
      LEFT JOIN facilities f
      ON u.facility_id = f.id
      WHERE role = 'POINT'
      ORDER BY u.created_at DESC
    `;
    // console.log('.....',users)

    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    console.error("GET POINT USERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
