import sql from "../../../lib/db.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const inventories = await sql`
SELECT 
inv.id,
inv.batch_number,
inv.manufacturer_date,
inv.expiry_date,
inv.quantity,
inv.status,
inv.storage_condition,
inv.created_at,
vt.name AS vaccine_name,
vt.Manufacturer  As vaccine_man
FROM inventory inv
LEFT JOIN vaccine_types vt
ON inv.vaccine_type_id=vt.id
ORDER BY inv.created_at DESC
`;
  const total_vaccines = await sql`
      SELECT SUM(quantity) AS total_vaccines FROM inventory
    `;
    return NextResponse.json({inventories:inventories,...total_vaccines[0]}, { status: 201 });
  } catch (error) {
    console.error("Get inventories error", error);
    return NextResponse.json([
      { error: "Failed to fetch inventories" },
      { status: 500 },]
    );
  }
}
