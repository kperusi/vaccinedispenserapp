export const runtime = "nodejs";
import bcrypt from "bcryptjs";
import postgres from "postgres";

// import { cookies } from "next/headers";

export async function POST(req) {
  const sql = postgres(process.env.POSTGRES_URL, {
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
    idle_timeout: 20,
    max: 1,
  });

  try {
    // const role = cookies().get("user_role")?.value;

    const { admin, healtheCenterForm, fullname, adminEmail, password } =
      await req.json();
    const { name, address, phone, contact_staff, email, capacity, type } =
      healtheCenterForm;
    console.log('->',admin);
    console.log(name, address, phone, contact_staff, email, capacity, type);
    // Admin-only
    if (admin.role !== "CONTROL") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    if (!name || !adminEmail || !address) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 },
      );
    }

    const [health_center] = await sql`
      INSERT INTO facilities (name,
        address,
        phone,
        email,
        capacity,
        type,
        contact_staff,
        status)
      VALUES (${name},${address}, ${phone}, ${email}, ${capacity},${type},${contact_staff},'active')
    RETURNING id
      `;

    const passwordHash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password, role,facility_id)
      VALUES (${fullname}, ${adminEmail}, ${passwordHash}, 'POINT',${health_center.id})
    `;

    return new Response(
      JSON.stringify({ message: `${name} facility  created successfully` }),
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error.code === "23505") {
      return new Response(
        JSON.stringify({ message: "this email already exists" }),
        {
          status: 409,
        },
      );
    }

    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
