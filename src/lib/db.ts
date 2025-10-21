import mysql from "mysql2/promise";

// Expect DATABASE_URL in the form: mysql://user:pass@host:port/dbname
const dbUrl = process.env.DATABASE_URL || "";

let pool: mysql.Pool | null = null;

export function getPool() {
  if (pool) return pool;
  if (!dbUrl) {
    throw new Error("DATABASE_URL not defined");
  }
  pool = mysql.createPool(dbUrl);
  return pool;
}
