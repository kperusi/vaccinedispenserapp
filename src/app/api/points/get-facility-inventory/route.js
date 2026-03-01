import sql from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  // 2. Extract specific keys
  const id = searchParams.get("id");
  console.log("...", id);

  try {
    const inventory = await sql`
    SELECT fi.id,fi.batch_number,
    fi.expiry_date,fi.quantity,fi.updated_at,
    fi.manufacturer_date,
    fi.storage_condition,
    vt.name, vt.manufacturer
    FROM facility_inventory fi
    JOIN vaccine_types vt ON fi.vaccine_type_id=vt.id
    WHERE facility_id=${id}
    `;

    // console.log("point-inventory", inventory);
    return NextResponse.json(inventory, { status: 201 });

  } catch (error) {
    console.error("Get user facility inventory error", error);
    return NextResponse.json([
      { error: "Failed to fetch facility inventory " },
      { status: 500 },
    ]);
  }
}
