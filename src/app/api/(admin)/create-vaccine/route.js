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

    const { user, form } = await req.json();
    const {
      name,
      code,
      manufacturer,
      doses_required,
      interval_days,
      description,
      age_max,
      age_min,
    } = form;
    console.log(user);
    console.log(name,
      code,
      manufacturer,
      doses_required,
      interval_days,
      description,
      age_max,
      age_min,);
    // Admin-only
    if (user.role !== "CONTROL") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    if (!name || !code || !manufacturer) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 },
      );
    }

    await sql`
      INSERT INTO vaccine_types (name,
        code,
        manufacturer,
        doses_required,
        interval_days,
        description,
        age_max,
        age_min,
        status)
      VALUES (${name},${code}, ${manufacturer}, ${doses_required}, ${interval_days},${description},${age_max},${age_min},'active')
    `;

    return new Response(
      JSON.stringify({ message: `${name} vaccine added successfully` }),
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error.code === "23505") {
      return new Response(
        JSON.stringify({ message: "this vaccine already exists" }),
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
