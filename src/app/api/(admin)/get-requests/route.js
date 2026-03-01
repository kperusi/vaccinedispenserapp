import { NextResponse } from "next/server";
import sql from "../../../lib/db";

export async function GET() {
  try {
    const requests = await sql`
    SELECT r.id, vt.name AS vaccine,
    f.name AS facility,
    r.quantity_requested,
     r.status, 
     r.facility_id,
     r.created_at
    FROM vaccine_requests r
    JOIN vaccine_types vt ON r.vaccine_id = vt.id
    JOIN facilities f ON r.facility_id = f.id
    ORDER BY r.created_at DESC, r.status DESC
  `;

    return NextResponse.json(requests, { status: 201 });
  } catch (error) {
    console.error("GET requests ERROR:", error);

    return NextResponse.json([
      { error: "Failed to fetch requests" },
      { status: 500 },
    ]);
  }
}
