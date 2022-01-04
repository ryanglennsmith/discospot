import pg from "pg";
import { pgPool } from "../config.js";

const pool = new pg.Pool({
  user: pgPool.pgUser,
  host: pgPool.pgServer,
  database: pgPool.pgDB,
  password: pgPool.pgPW,
  port: pgPool.pgPort,
});

function query(text, params) {
  return pool.query(text, params);
}
export default query;
