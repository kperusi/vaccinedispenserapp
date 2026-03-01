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
  max: 10,
});
export default sql;
