import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';
import { initDatabase } from './init.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
await initDatabase();

// ==================== MIDDLEWARE AUTH ====================
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user.admin) return res.status(403).json({ error: 'Acceso denegado' });
  next();
}
// ==================== LOGIN ====================
app.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Admin desde .env
    if (
      correo === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { admin: true, correo },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({ admin: true, token });
    }
    // Usuario normal
    const r = await pool.query(
      'SELECT * FROM usuarios WHERE correo=$1',
      [correo]
    );

    if (r.rowCount === 0)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, r.rows[0].password);
    if (!ok)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: r.rows[0].id, admin: false },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: r.rows[0].id,
        nombre: r.rows[0].nombre,
        correo: r.rows[0].correo
      }
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// ==================== USUARIOS ====================
app.get('/usuarios', auth, adminOnly, async (_, res) => {
  const r = await pool.query(
    'SELECT id,nombre,correo,telefono FROM usuarios'
  );
  res.json(r.rows);
});

app.post('/usuarios', async (req, res) => {
  const { nombre, correo, password, telefono } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const r = await pool.query(`
    INSERT INTO usuarios (nombre, correo, password, telefono)
    VALUES ($1,$2,$3,$4) RETURNING id,nombre,correo,telefono
  `, [nombre, correo, hash, telefono]);

  res.json(r.rows[0]);
});

app.put('/usuarios/:id', auth, async (req, res) => {
  const { nombre, correo, telefono } = req.body;

  const r = await pool.query(`
    UPDATE usuarios SET nombre=$1, correo=$2, telefono=$3
    WHERE id=$4 RETURNING id,nombre,correo,telefono
  `, [nombre, correo, telefono, req.params.id]);

  res.json(r.rows[0]);
});

app.delete('/usuarios/:id', auth, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM usuarios WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== PROVEEDORES ====================

app.get('/proveedores', auth, adminOnly, async (_, res) => {
  const r = await pool.query('SELECT * FROM proveedores');
  res.json(r.rows);
});

app.post('/proveedores', auth, adminOnly, async (req, res) => {
  const { nombre, telefono, correo, empresa } = req.body;

  const r = await pool.query(`
    INSERT INTO proveedores (nombre, telefono, correo, empresa)
    VALUES ($1,$2,$3,$4) RETURNING *
  `, [nombre, telefono, correo, empresa]);

  res.json(r.rows[0]);
});

app.put('/proveedores/:id', auth, adminOnly, async (req, res) => {
  const { nombre, telefono, correo, empresa } = req.body;

  const r = await pool.query(`
    UPDATE proveedores SET nombre=$1, telefono=$2, correo=$3, empresa=$4
    WHERE id=$5 RETURNING *
  `, [nombre, telefono, correo, empresa, req.params.id]);

  res.json(r.rows[0]);
});

app.delete('/proveedores/:id', auth, adminOnly, async (req, res) => {
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

app.post('/productos', auth, adminOnly, async (req, res) => {
  const { nombre, descripcion, precio, stock, proveedor_id } = req.body;

  const r = await pool.query(`
    INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id)
    VALUES ($1,$2,$3,$4,$5) RETURNING *
  `, [nombre, descripcion, precio, stock, proveedor_id]);

  res.json(r.rows[0]);
});

app.put('/productos/:id', auth, adminOnly, async (req, res) => {
  const { nombre, descripcion, precio, stock, proveedor_id } = req.body;

  const r = await pool.query(`
    UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4, proveedor_id=$5
    WHERE id=$6 RETURNING *
  `, [nombre, descripcion, precio, stock, proveedor_id, req.params.id]);

  res.json(r.rows[0]);
});

app.delete('/productos/:id', auth, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM productos WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== CARRITO ====================

app.post('/carrito', auth, async (req, res) => {
  const r = await pool.query(
    'INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING *',
    [req.user.id]
  );
  res.json(r.rows[0]);
});

app.post('/carrito/detalle', auth, async (req, res) => {
  const { carrito_id, producto_id, cantidad, subtotal } = req.body;

  const r = await pool.query(`
    INSERT INTO carrito_detalle VALUES ($1,$2,$3,$4)
    RETURNING *
  `, [carrito_id, producto_id, cantidad, subtotal]);

  res.json(r.rows[0]);
});

// ==================== VENTAS ====================

app.post('/ventas', auth, async (req, res) => {
  const { total, detalles } = req.body;

  const v = await pool.query(`
    INSERT INTO ventas (usuario_id, total)
    VALUES ($1,$2) RETURNING id
  `, [req.user.id, total]);

  for (const d of detalles) {
    await pool.query(`
      INSERT INTO detalle_venta VALUES ($1,$2,$3,$4)
    `, [v.rows[0].id, d.producto_id, d.cantidad, d.subtotal]);

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