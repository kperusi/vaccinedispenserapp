import postgres from "postgres";



// const sql = postgres(process.env.POSTGRES_URL, {
//   ssl: process.env.NODE_ENV === "production" ? "require" : false,
//   idle_timeout: 20,
//   max: 1,
// });



const sql = postgres(process.env.POSTGRES_URL, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  max: 1,
  connect_timeout: 10, // ✅ add this
  prepare: false, 
});
export default sql;
