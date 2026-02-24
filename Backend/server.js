import express from 'express';
import cors from 'cors';
import {pool} from './db.js';
import { initDatabase } from './init.js';
//este archivo es el corazón del backend, aquí se definen todas las rutas y la lógica de cada una de ellas, además de iniciar el servidor y conectar con la base de datos
const app = express();
app.use(cors());
app.use(express.json());

await initDatabase();

// ==================== LOGIN ====================

app.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    const r = await pool.query(
      'SELECT id, nombre FROM usuarios WHERE correo=$1 AND password=$2',
      [correo, password]
    );

    if (r.rowCount === 0)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/admin/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const r = await pool.query(
      'SELECT id, nombre, rol FROM administradores WHERE nombre=$1 AND password=$2',
      [nombre, password]
    );

    if (r.rowCount === 0)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== USUARIOS ====================

app.get('/usuarios', async (_, res) => {
  const r = await pool.query('SELECT * FROM usuarios');
  res.json(r.rows);
});

app.post('/usuarios', async (req, res) => {
  const { nombre, correo, password, telefono } = req.body;

  const r = await pool.query(`
    INSERT INTO usuarios (nombre, correo, password, telefono)
    VALUES ($1,$2,$3,$4) RETURNING *
  `, [nombre, correo, password, telefono]);

  res.json(r.rows[0]);
});

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono } = req.body;

  const r = await pool.query(`
    UPDATE usuarios SET nombre=$1, correo=$2, telefono=$3
    WHERE id=$4 RETURNING *
  `, [nombre, correo, telefono, id]);

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
  const { id } = req.params;
  const { nombre, telefono, correo, empresa } = req.body;

  const r = await pool.query(`
    UPDATE proveedores SET nombre=$1, telefono=$2, correo=$3, empresa=$4
    WHERE id=$5 RETURNING *
  `, [nombre, telefono, correo, empresa, id]);

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
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;

  const r = await pool.query(`
    UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4
    WHERE id=$5 RETURNING *
  `, [nombre, descripcion, precio, stock, id]);

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
  const { carrito_id, producto_id, cantidad, subtotal } = req.body;

  const r = await pool.query(`
    INSERT INTO carrito_detalle
    VALUES ($1,$2,$3,$4) RETURNING *
  `, [carrito_id, producto_id, cantidad, subtotal]);

  res.json(r.rows[0]);
});

// ==================== VENTAS ====================

app.post('/ventas', async (req, res) => {
  const { usuario_id, total } = req.body;

  const r = await pool.query(`
    INSERT INTO ventas (usuario_id, total)
    VALUES ($1,$2) RETURNING *
  `, [usuario_id, total]);

  res.json(r.rows[0]);
});

app.post('/ventas/detalle', async (req, res) => {
  const { venta_id, producto_id, cantidad, subtotal } = req.body;

  const r = await pool.query(`
    INSERT INTO detalle_venta
    VALUES ($1,$2,$3,$4) RETURNING *
  `, [venta_id, producto_id, cantidad, subtotal]);

  res.json(r.rows[0]);
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Backend corriendo en http://localhost:${PORT}`);
});