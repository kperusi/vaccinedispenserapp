import bcrypt from "bcryptjs";
import postgres from "postgres";
import sql from "../../lib/db";

// const sql = postgres(process.env.POSTGRES_URL, {
//   ssl: process.env.NODE_ENV === "production" ? "require" : false,
//   idle_timeout: 20,
//   max_lifetime: 60 * 30,
//   max: 10,
// });

export async function POST(req) {
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
  console.log("SUPABASE_KEY:", process.env.SUPABASE_ANON_KEY);

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password required" }),
        { status: 400 },
      );
    }

    const users = await sql`
      SELECT id, name, email, password, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    await sql` UPDATE users SET last_login= NOW()
WHERE id=${user.id}
`;

    return new Response(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      { status: 200 },
    );
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return new Response(JSON.stringify({ message: "Server Error" }), {
      status: 500,
    });
  }
}
