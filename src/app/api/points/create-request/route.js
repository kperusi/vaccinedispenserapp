import sql from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS vaccine_requests (
    id SERIAL PRIMARY KEY,
  facility_id INTEGER REFERENCES facilities(id),
  vaccine_id INTEGER REFERENCES vaccine_types(id),
  quantity_requested INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  request_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  const { vaccineId, quantity,facility_id,requestNote } = await req.json();

  console.log( vaccineId, quantity,facility_id,requestNote)
    await sql`
      INSERT INTO vaccine_requests (facility_id, vaccine_id, quantity_requested, request_notes)
      VALUES (${facility_id}, ${vaccineId}, ${quantity},${requestNote})
    `;

    return NextResponse.json({ message: "Request submitted successfully" });


  } catch (error) {
     if (error.code === "23505") {
      return new Response(JSON.stringify({ message: "request already exists" }), {
        status: 409,
      });
    }

    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
