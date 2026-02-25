import { adminPool, pool } from './db.js';
//basicamente este archivo se encarga de crear las tablas de la base de datos 
export async function initDatabase() {
  try {
    console.log('Inicializando base de datos...');

    // 1. Crear base si no existe
    const res = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'tienda_pc'"
    );

    if (res.rowCount === 0) {
      await adminPool.query('CREATE DATABASE tienda_pc');
      console.log('Base de datos creada');
    } else {
      console.log('Base de datos ya existe');
    }

    await pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    correo VARCHAR(120) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    telefono VARCHAR(20)
  );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS proveedores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      telefono VARCHAR(20),
      correo VARCHAR(120),
      empresa VARCHAR(120)
    );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
      stock INT NOT NULL CHECK (stock >= 0),
      proveedor_id INT REFERENCES proveedores(id) ON DELETE SET NULL
    );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS ventas (
      id SERIAL PRIMARY KEY,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
      usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL
    );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS detalle_venta (
      id SERIAL PRIMARY KEY,
      venta_id INT REFERENCES ventas(id) ON DELETE CASCADE,
      producto_id INT REFERENCES productos(id),
      cantidad INT NOT NULL CHECK (cantidad > 0),
      precio NUMERIC(10,2) NOT NULL
    );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS carrito (
      id SERIAL PRIMARY KEY,
      usuario_id INT UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE
    );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS carrito_detalle (
      id SERIAL PRIMARY KEY,
      carrito_id INT REFERENCES carrito(id) ON DELETE CASCADE,
      producto_id INT REFERENCES productos(id),
      cantidad INT NOT NULL CHECK (cantidad > 0)
    );
    `);

    console.log('Tablas creadas correctamente');

  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  }
}