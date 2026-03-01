import sql from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { inventory_id, facility_id, quantity, notes } = await req.json();

    //     await sql`
    // CREATE TABLE IF NOT EXISTS vaccine_allocations (
    //   id SERIAL PRIMARY KEY,
    //   inventory_id INTEGER NOT NULL,
    //   facility_id INTEGER NOT NULL,
    //   quantity_allocated INTEGER NOT NULL,
    //   allocation_date DATE DEFAULT CURRENT_DATE,
    //   notes TEXT,
    //   FOREIGN KEY (inventory_id) REFERENCES inventory(id),
    //   FOREIGN KEY (facility_id) REFERENCES facilities(id)
    // )`;

    const invItem = await sql`
      SELECT * FROM inventory WHERE id = ${inventory_id} 
      AND quantity>0 ORDER BY expiry_date ASC,quantity DESC LIMIT 1
    `;

    const inventoryItem = invItem[0];

    console.log(inventoryItem);

    // const stock = sql`SELECT quantity FROM inventory WHERE id = ${inventory_id}`;

    if (!inventoryItem || inventoryItem.quantity < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 },
      );
    }

    // Deduct stock
    await sql`
      UPDATE inventory
      SET quantity = quantity - ${quantity}
      WHERE id = ${inventory_id}
    `;

    await sql`
    INSERT INTO vaccine_allocations (inventory_id,facility_id,quantity_allocated,notes)
   VALUES(${inventory_id},${facility_id},${quantity},${notes})
    `;
    console.log(
      inventory_id,
      facility_id,
      quantity,
      notes,
      inventoryItem.vaccine_type_id,
      inventoryItem.batch_number,
      inventoryItem.manufacturer_date,
      inventoryItem.expiry_date,
      inventoryItem.storage_condition,
    );
    await sql`
      INSERT INTO facility_inventory (facility_id, vaccine_type_id,batch_number,expiry_date,manufacturer_date, quantity,storage_condition)
      VALUES (${facility_id}, ${inventoryItem.vaccine_type_id}, ${inventoryItem.batch_number},${inventoryItem.manufacturer_date},${inventoryItem.expiry_date},${quantity},${inventoryItem.storage_condition})
      ON CONFLICT (facility_id, vaccine_type_id,batch_number)
      DO UPDATE SET quantity = facility_inventory.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP
    `;

    console.log("...........");
    return new Response(
      JSON.stringify({ message: "Vaccine allocation successful" }),
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error.code === "23505") {
      return new Response(JSON.stringify({ message: "Email already exists" }), {
        status: 409,
      });
    }

    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
