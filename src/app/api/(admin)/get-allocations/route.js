import sql from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allocation = await sql`
    SELECT 
    va.id,
    SUM(va.quantity_allocated) AS total_received,
    va.notes,
    va.allocation_date,
    vt.name AS vaccine_name,
    f.name,
    inv.batch_number
    FROM vaccine_allocations va
    JOIN inventory inv ON inv.id = va.inventory_id
    JOIN facilities f ON f.id = va.facility_id
    JOIN vaccine_types vt ON vt.id = inv.vaccine_type_id
    GROUP BY f.id, va.id,vt.name,inv.batch_number

    `;

    return NextResponse.json(allocation, { status: 200 });
  } catch (error) {
    console.error("GET allocation ERROR:", error);

    return NextResponse.json([
      { error: "Failed to fetch allocation" },
      { status: 500 },]
    );
  }
}
