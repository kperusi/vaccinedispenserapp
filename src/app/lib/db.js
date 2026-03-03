import postgres from "postgres";


let sql;

console.log("DB URL exists:", !!process.env.POSTGRES_URL);

if (!global.sql) {
  global.sql = postgres(process.env.POSTGRES_URL, {
    ssl: { rejectUnauthorized: false },
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    max: 5,
    prepare: false,
  });
}

sql = global.sql;

export default sql;


// const sql = postgres(process.env.POSTGRES_URL, {
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : false,
//   idle_timeout: 20,
//   max_lifetime: 60 * 30,
//   max: 10,
//   prepare: false,
// });

// export default sql;


// const sql = postgres(process.env.POSTGRES_URL, {
//   ssl: process.env.NODE_ENV === "production" ? "require" : false,
//   idle_timeout: 20,
//   max_lifetime: 60 * 30,
//   max: 10,
//   // connect_timeout: 10, // ✅ add this
//   prepare: false, 
// });
// export default sql;
