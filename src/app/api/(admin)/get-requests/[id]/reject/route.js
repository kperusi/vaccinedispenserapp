import { NextResponse } from "next/server";
import sql from '../../../../../lib/db'

export async function POST(req, { params }) {
  try {
    await sql`
    UPDATE vaccine_requests SET status = 'rejected'
    WHERE id = ${params.id}
  `;

    return NextResponse.json({ message: "Request rejected" });
  } catch (error) {
    console.error("GET reject ERROR:", error);

    return NextResponse.json([
      { error: "Failed to reject" },
      { status: 500 },
    ]);
  }
}
