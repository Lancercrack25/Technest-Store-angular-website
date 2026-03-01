import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Pool ADMIN → se conecta a postgres
export const adminPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres'
});

// Pool NORMAL → se conecta a tu BD real
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
//prueba la conexion a la base de datos
export async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PostgreSQL conectado:', res.rows[0]);
  } catch (err) {
    console.error('Error conectando a PostgreSQL:', err);
  }
}
