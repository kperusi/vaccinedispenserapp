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
  // async function checkUsers() {
  //   try {
  //     console.log("🔍 Checking users in database...\n");

  //     const users = await sql`
  //     SELECT id, name, email, role, created_at
  //     FROM users
  //   `;

  //     if (users.length === 0) {
  //       console.log("❌ No users found in database!");
  //       console.log("\nRun the setup script to create a test user:");
  //       // console.log("node scripts/setup-db.js");
  //     } else {
  //       console.log(`✅ Found ${users.length} user(s):\n`);
  //       users.forEach((user) => {
  //         console.log(`Username: ${user.name}`);
  //         console.log(`Email: ${user.email}`);
  //         console.log(`Role: ${user.role}`);
  //         console.log(`Created: ${user.created_at}`);
  //         console.log("---");
  //       });
  //     }
  //   } catch (error) {
  //     if (error.message.includes("does not exist")) {
  //       console.log("❌ Users table doesn't exist!");
  //       console.log("\nRun the setup script to create the table:");
  //       console.log("node scripts/setup-db.js");
  //     } else {
  //       console.error("❌ Error:", error);
  //     }
  //   } finally {
  //     await sql.end();
  //   }
  // }

  // checkUsers();

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

    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
