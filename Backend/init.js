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

    // ================= CLIENTE =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cliente (
        id_cliente SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        telefono VARCHAR(15),
        rol VARCHAR(20),
        creado_en TIMESTAMP
      );
    `);

    // ================= CATEGORIA =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categoria (
        id_categoria VARCHAR(10) PRIMARY KEY,
        nombre VARCHAR(100),
        descripcion TEXT,
        id_padre VARCHAR(10),
        FOREIGN KEY (id_padre) REFERENCES categoria(id_categoria)
      );
    `);

    // ================= PROVEEDOR =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proveedor (
        id_proveedor VARCHAR(10) PRIMARY KEY,
        razon_social VARCHAR(150),
        rfc VARCHAR(13),
        contacto VARCHAR(100),
        email VARCHAR(150),
        telefono VARCHAR(15),
        activo BOOLEAN
      );
    `);

    // ================= PRODUCTO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS producto (
        id_producto VARCHAR(10) PRIMARY KEY,
        numero_de_serie VARCHAR(20),
        nombre VARCHAR(100),
        descripcion TEXT,
        precio NUMERIC(10,2),
        costo NUMERIC(10,2),
        garantia_meses INT,
        id_categoria VARCHAR(10),
        id_proveedor VARCHAR(10),
        activo BOOLEAN,
        FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
        FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
      );
    `);

    // ================= CARRITO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito (
        id_carrito VARCHAR(10) PRIMARY KEY,
        id_cliente INT UNIQUE,
        creado_en TIMESTAMP,
        estado VARCHAR(20),
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
      );
    `);

    // ================= CARRITO DETALLE =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carrito_detalle (
        id_detalle SERIAL PRIMARY KEY,
        id_carrito VARCHAR(10),
        id_producto VARCHAR(10),
        cantidad INT,
        precio_unitario NUMERIC(10,2),
        FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito),
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
      );
    `);

    // ================= VENTA =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS venta (
        id_venta VARCHAR(10) PRIMARY KEY,
        id_cliente INT,
        fecha TIMESTAMP,
        subtotal NUMERIC(10,2),
        impuestos NUMERIC(10,2),
        total NUMERIC(10,2),
        estado VARCHAR(30),
        canal VARCHAR(30),
        notas TEXT,
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
      );
    `);

    // ================= DETALLE VENTA =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS detalle_venta (
        id_detalle SERIAL PRIMARY KEY,
        id_venta VARCHAR(10),
        id_producto VARCHAR(10),
        cantidad INT,
        precio_unitario NUMERIC(10,2),
        descuento NUMERIC(5,2),
        subtotal NUMERIC(10,2),
        FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
      );
    `);

    // ================= PAGO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pago (
        id_pago VARCHAR(10) PRIMARY KEY,
        id_venta VARCHAR(10),
        monto NUMERIC(10,2),
        metodo_pago VARCHAR(50),
        referencia VARCHAR(100),
        fecha_pago TIMESTAMP,
        estado VARCHAR(20),
        FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
      );
    `);

    // ================= ENVIO =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS envio (
        id_envio SERIAL PRIMARY KEY,
        id_venta VARCHAR(10),
        transportista VARCHAR(100),
        num_guia VARCHAR(50),
        direccion_destino VARCHAR(200),
        fecha_envio TIMESTAMP,
        fecha_entrega DATE,
        estado VARCHAR(30),
        FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
      );
    `);

    // ================= FACTURA =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS factura (
        id_factura SERIAL PRIMARY KEY,
        id_venta VARCHAR(10) UNIQUE,
        rfc_cliente VARCHAR(13),
        razon_social VARCHAR(150),
        direccion_fiscal VARCHAR(200),
        uso_cfdi VARCHAR(10),
        fecha_emision TIMESTAMP,
        total NUMERIC(10,2),
        FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
      );
    `);

    console.log('Base de datos creada correctamente');
    await pool.end();

  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  }
}