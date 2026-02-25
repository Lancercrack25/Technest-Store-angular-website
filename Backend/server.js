import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { initDatabase } from './init.js';

const app = express();
app.use(cors());
app.use(express.json());

// ==================== INICIALIZACIÓN ====================
await initDatabase(); // crea base y tablas si no existen

// ==================== MIDDLEWARE SIMPLIFICADO ====================
// Simulación de middleware para admin, solo permite pasar
function adminOnly(req, res, next) { next(); }

// ==================== USUARIOS ====================
app.get('/usuarios', async (_, res) => {
  const r = await pool.query('SELECT id,nombre,correo,telefono FROM usuarios');
  res.json(r.rows);
});

app.post('/usuarios', async (req, res) => {
  const { nombre, correo, password, telefono } = req.body;
  const r = await pool.query(`
    INSERT INTO usuarios (nombre, correo, password, telefono)
    VALUES ($1,$2,$3,$4) RETURNING id,nombre,correo,telefono
  `, [nombre, correo, password, telefono]);
  res.json(r.rows[0]);
});

app.put('/usuarios/:id', async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  const r = await pool.query(`
    UPDATE usuarios SET nombre=$1, correo=$2, telefono=$3
    WHERE id=$4 RETURNING id,nombre,correo,telefono
  `, [nombre, correo, telefono, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/usuarios/:id', async (req, res) => {
  await pool.query('DELETE FROM usuarios WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== PROVEEDORES ====================
app.get('/proveedores', async (_, res) => {
  const r = await pool.query('SELECT * FROM proveedores');
  res.json(r.rows);
});

app.post('/proveedores', async (req, res) => {
  const { nombre, telefono, correo, empresa } = req.body;
  const r = await pool.query(`
    INSERT INTO proveedores (nombre, telefono, correo, empresa)
    VALUES ($1,$2,$3,$4) RETURNING *
  `, [nombre, telefono, correo, empresa]);
  res.json(r.rows[0]);
});

app.put('/proveedores/:id', async (req, res) => {
  const { nombre, telefono, correo, empresa } = req.body;
  const r = await pool.query(`
    UPDATE proveedores SET nombre=$1, telefono=$2, correo=$3, empresa=$4
    WHERE id=$5 RETURNING *
  `, [nombre, telefono, correo, empresa, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/proveedores/:id', async (req, res) => {
  await pool.query('DELETE FROM proveedores WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== PRODUCTOS ====================
app.get('/productos', async (_, res) => {
  const r = await pool.query(`
    SELECT p.*, pr.nombre AS proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
  `);
  res.json(r.rows);
});

app.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio, stock, proveedor_id } = req.body;
  const r = await pool.query(`
    INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id)
    VALUES ($1,$2,$3,$4,$5) RETURNING *
  `, [nombre, descripcion, precio, stock, proveedor_id]);
  res.json(r.rows[0]);
});

app.put('/productos/:id', async (req, res) => {
  const { nombre, descripcion, precio, stock, proveedor_id } = req.body;
  const r = await pool.query(`
    UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4, proveedor_id=$5
    WHERE id=$6 RETURNING *
  `, [nombre, descripcion, precio, stock, proveedor_id, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/productos/:id', async (req, res) => {
  await pool.query('DELETE FROM productos WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== CARRITO ====================
app.post('/carrito', async (req, res) => {
  const { usuario_id } = req.body;
  const r = await pool.query(
    'INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING *',
    [usuario_id]
  );
  res.json(r.rows[0]);
});

app.post('/carrito/detalle', async (req, res) => {
  const { carrito_id, producto_id, cantidad } = req.body;
  const r = await pool.query(`
    INSERT INTO carrito_detalle (carrito_id, producto_id, cantidad)
    VALUES ($1,$2,$3) RETURNING *
  `, [carrito_id, producto_id, cantidad]);
  res.json(r.rows[0]);
});

// ==================== VENTAS ====================
app.post('/ventas', async (req, res) => {
  const { usuario_id, total, detalles } = req.body;

  const v = await pool.query(`
    INSERT INTO ventas (usuario_id, total)
    VALUES ($1,$2) RETURNING id
  `, [usuario_id, total]);

  for (const d of detalles) {
    await pool.query(`
      INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio)
      VALUES ($1,$2,$3,$4)
    `, [v.rows[0].id, d.producto_id, d.cantidad, d.precio]);

    await pool.query(`
      UPDATE productos SET stock = stock - $1 WHERE id = $2
    `, [d.cantidad, d.producto_id]);
  }

  res.json({ ok: true, venta_id: v.rows[0].id });
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Backend corriendo en http://localhost:${PORT}`);
});