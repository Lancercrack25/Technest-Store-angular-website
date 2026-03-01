import { adminPool } from './db.js';
import pkg from 'pg';

const { Pool } = pkg;

export async function initDatabase() {
  try {
    console.log('Inicializando base de datos...');

    const res = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'tienda_pc'"
    );

    if (res.rowCount === 0) {
      await adminPool.query('CREATE DATABASE tienda_pc');
      console.log('Base de datos creada');
    }

    await adminPool.end();

    const pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'tienda_pc',
    });

    // ================= USUARIO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        telefono VARCHAR(20),
        rol VARCHAR(20) DEFAULT 'cliente',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================= CATEGORIA =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categoria (
        id_categoria SERIAL PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    // ================= PROVEEDOR =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proveedor (
        id_proveedor SERIAL PRIMARY KEY,
        nombre VARCHAR(120) NOT NULL,
        telefono VARCHAR(20),
        correo VARCHAR(120)
      );
    `);

    // ================= PRODUCTO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS producto (
        id_producto SERIAL PRIMARY KEY,
        sku VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
        garantia_meses INT,
        id_categoria INT REFERENCES categoria(id_categoria),
        id_proveedor INT REFERENCES proveedor(id_proveedor)
      );
    `);

    // ================= INVENTARIO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventario (
        id_inventario SERIAL PRIMARY KEY,
        id_producto INT UNIQUE REFERENCES producto(id_producto) ON DELETE CASCADE,
        stock INT NOT NULL CHECK (stock >= 0),
        stock_minimo INT NOT NULL CHECK (stock_minimo >= 0),
        ubicacion VARCHAR(100)
      );
    `);

    // ================= CARRITO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito (
        id_carrito SERIAL PRIMARY KEY,
        id_usuario INT UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================= CARRITO_DETALLE =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito_detalle (
        id_detalle SERIAL PRIMARY KEY,
        id_carrito INT REFERENCES carrito(id_carrito) ON DELETE CASCADE,
        id_producto INT REFERENCES producto(id_producto),
        cantidad INT NOT NULL CHECK (cantidad > 0)
      );
    `);

    // ================= VENTA =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS venta (
        id_venta SERIAL PRIMARY KEY,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(20) DEFAULT 'pendiente',
        total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
        id_usuario INT REFERENCES usuario(id_usuario)
      );
    `);

    // ================= DETALLE_VENTA =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS detalle_venta (
        id_detalle SERIAL PRIMARY KEY,
        id_venta INT REFERENCES venta(id_venta) ON DELETE CASCADE,
        id_producto INT REFERENCES producto(id_producto),
        cantidad INT NOT NULL CHECK (cantidad > 0),
        precio_unitario NUMERIC(10,2) NOT NULL
      );
    `);

    // ================= PAGO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pago (
        id_pago SERIAL PRIMARY KEY,
        id_venta INT UNIQUE REFERENCES venta(id_venta) ON DELETE CASCADE,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metodo VARCHAR(50),
        monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0)
      );
    `);

    console.log('Base de datos creada correctamente');
    await pool.end();

  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  }
}
