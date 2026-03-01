import sql from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { form, admin } = await req.json();
  const {
    vaccine_type_id,
    batch_number,
    quantity,
    storage_condition,
    expiry_date,
    man_date,
  } = form;
  // Admin-only
  if (admin.role !== "CONTROL") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
    });
  }
  if (!quantity || !batch_number || !vaccine_type_id || !expiry_date) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 },
    );
  }

  await sql`
INSERT INTO inventory (vaccine_type_id,
    batch_number,
    quantity,
    expiry_date,
    manufacturer_date,
    storage_condition,
    status)
    VALUES(${vaccine_type_id},${batch_number},${quantity},${expiry_date},${man_date},${storage_condition},'available')
`;
   return new Response(JSON.stringify({ message: "inventory added successfully" }), {
      status: 201,
    });
  try {
  } catch (error) {
    if (error.code === "23505") {
      return new Response(JSON.stringify({ message: "inventory already exists" }), {
        status: 409,
      });
    }

    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
