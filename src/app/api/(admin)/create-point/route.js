export const runtime = "nodejs";
import bcrypt from "bcryptjs";
import postgres from "postgres";

// import { cookies } from "next/headers";

export async function POST(req) {
  const sql = postgres(process.env.POSTGRES_URL, {
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
    idle_timeout: 20,
  });

  try {
    // const role = cookies().get("user_role")?.value;

     const { name, email, password,user } = await req.json();

    // Admin-only
    if (user.role !== "CONTROL") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

  

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${passwordHash}, 'POINT')
    `;

    return new Response(JSON.stringify({ message: "Point user created" }), {
      status: 201,
    });
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
