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

    // 2. Crear tablas en orden correcto
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        correo VARCHAR(120) UNIQUE,
        password TEXT,
        telefono VARCHAR(20)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS administradores (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        correo VARCHAR(120) UNIQUE,
        password TEXT,
        rol VARCHAR(50)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS proveedores (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(120),
        telefono VARCHAR(20),
        correo VARCHAR(120),
        empresa VARCHAR(120)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150),
        descripcion TEXT,
        precio NUMERIC(10,2),
        stock INT,
        proveedor_id INT REFERENCES proveedores(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ventas (
        id SERIAL PRIMARY KEY,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total NUMERIC(10,2),
        usuario_id INT REFERENCES usuarios(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS detalle_venta (
        venta_id INT REFERENCES ventas(id),
        producto_id INT REFERENCES productos(id),
        cantidad INT,
        subtotal NUMERIC(10,2),
        PRIMARY KEY (venta_id, producto_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito (
        id SERIAL PRIMARY KEY,
        usuario_id INT REFERENCES usuarios(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito_detalle (
        carrito_id INT REFERENCES carrito(id),
        producto_id INT REFERENCES productos(id),
        cantidad INT,
        subtotal NUMERIC(10,2),
        PRIMARY KEY (carrito_id, producto_id)
      );
    `);

    console.log('Tablas creadas correctamente');

  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  }
}