import { NextResponse } from "next/server";
import sql from "../../../../../lib/db";

export async function POST(req, { params }) {
  const { id } = await params;
 

  try {
    const [request] = await sql`
      SELECT * FROM vaccine_requests WHERE id = ${id}
    `;

    if (!request) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 },
      );
    }

    const r = request;

    const stock = await sql`
      SELECT * FROM inventory WHERE vaccine_type_id = ${r.vaccine_id} 
      AND quantity>0 ORDER BY expiry_date ASC,quantity DESC LIMIT 1
    `;

    const inventoryItem = stock[0];
    console.log("stocks", inventoryItem.id);

    if (!inventoryItem || inventoryItem.quantity < r.quantity_requested) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 },
      );
    }

    const inventory_id = inventoryItem.id;

    // Deduct stock

    await sql`
      UPDATE inventory
      SET quantity = quantity - ${r.quantity_requested}
      WHERE id= ${inventory_id}
    `;

    await sql`
    INSERT INTO vaccine_allocations (inventory_id,facility_id,quantity_allocated,notes)
   VALUES(${inventory_id},${r.facility_id},${r.quantity_requested},'vaccine allocated by admin')
    `;

    await sql`
      UPDATE vaccine_requests
      SET status = 'approved'
      WHERE id = ${id}
    `;
    
    await sql`
      INSERT INTO facility_inventory (facility_id, vaccine_type_id,batch_number,expiry_date,manufacturer_date, quantity,storage_condition)
      VALUES (${r.facility_id}, ${r.vaccine_id}, ${inventoryItem.batch_number},${inventoryItem.manufaturer_date},${inventoryItem.expiry_date},${r.quantity_requested},${inventoryItem.storage_condition})
      ON CONFLICT (facility_id, vaccine_type_id,batch_number)
      DO UPDATE SET quantity = facility_inventory.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json(
      { message: "Request approved and Inventory Updated" },
      {
        status: 201,
      },
    );

    // return NextResponse.json({
    //   message: "Request approved & inventory updated",
    // });

    // ✅ 1. Record allocation history
    // await sql`
    //   INSERT INTO vaccine_allocations
    //   (facility_id, vaccine_id, quantity_allocated)
    //   VALUES (${r.facilicity_id}, ${r.vaccine_id}, ${r.quantity_requested})
    // `;

    // ✅ 2. Update inventory snapshot
    // await sql`
    //   INSERT INTO inventory (facilicity_id, vaccine_id, quantity)
    //   VALUES (${r.facilicity_id}, ${r.vaccine_id}, ${r.quantity_requested})
    //   ON CONFLICT (facilicity_id, vaccine_id)
    //   DO UPDATE SET quantity = inventory.quantity + ${r.quantity_requested}
    // `;

    // ✅ 3. Update request status
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Approval failed" }, { status: 500 });
  }
}
