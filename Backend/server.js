import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { initDatabase } from './init.js';

const app = express();
app.use(cors());
app.use(express.json());

await initDatabase();

// ==================== USUARIOS ====================
app.get('/usuarios', async (_, res) => {
  const r = await pool.query('SELECT id_usuario,nombre,email,telefono,rol FROM usuario');
  res.json(r.rows);
});

app.post('/usuarios', async (req, res) => {
  const { nombre, email, password, telefono, rol } = req.body;
  const r = await pool.query(`
    INSERT INTO usuario (nombre,email,password,telefono,rol)
    VALUES ($1,$2,$3,$4,$5) RETURNING *
  `, [nombre, email, password, telefono, rol || 'cliente']);
  res.json(r.rows[0]);
});

app.put('/usuarios/:id', async (req, res) => {
  const { nombre, email, telefono, rol } = req.body;
  const r = await pool.query(`
    UPDATE usuario SET nombre=$1,email=$2,telefono=$3,rol=$4
    WHERE id_usuario=$5 RETURNING *
  `, [nombre, email, telefono, rol, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/usuarios/:id', async (req, res) => {
  await pool.query('DELETE FROM usuario WHERE id_usuario=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== CATEGORIA ====================
app.get('/categorias', async (_, res) => {
  const r = await pool.query('SELECT * FROM categoria ORDER BY nombre');
  res.json(r.rows);
});

app.post('/categorias', async (req, res) => {
  const { nombre } = req.body;
  const r = await pool.query(`
    INSERT INTO categoria (nombre) VALUES ($1) RETURNING *
  `, [nombre]);
  res.json(r.rows[0]);
});

app.put('/categorias/:id', async (req, res) => {
  const { nombre } = req.body;
  const r = await pool.query(`
    UPDATE categoria SET nombre=$1
    WHERE id_categoria=$2 RETURNING *
  `, [nombre, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/categorias/:id', async (req, res) => {
  await pool.query('DELETE FROM categoria WHERE id_categoria=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== PROVEEDOR ====================
app.get('/proveedores', async (_, res) => {
  const r = await pool.query('SELECT * FROM proveedor');
  res.json(r.rows);
});

app.post('/proveedores', async (req, res) => {
  const { nombre, telefono, correo } = req.body;
  const r = await pool.query(`
    INSERT INTO proveedor (nombre,telefono,correo)
    VALUES ($1,$2,$3) RETURNING *
  `, [nombre, telefono, correo]);
  res.json(r.rows[0]);
});

app.put('/proveedores/:id', async (req, res) => {
  const { nombre, telefono, correo } = req.body;
  const r = await pool.query(`
    UPDATE proveedor SET nombre=$1,telefono=$2,correo=$3
    WHERE id_proveedor=$4 RETURNING *
  `, [nombre, telefono, correo, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/proveedores/:id', async (req, res) => {
  await pool.query('DELETE FROM proveedor WHERE id_proveedor=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== PRODUCTO ====================
app.get('/productos', async (_, res) => {
  const r = await pool.query(`
    SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor, i.stock
    FROM producto p
    LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
    LEFT JOIN inventario i ON p.id_producto = i.id_producto
  `);
  res.json(r.rows);
});

app.post('/productos', async (req, res) => {
  const { sku, nombre, descripcion, precio, garantia_meses, id_categoria, id_proveedor, stock, stock_minimo, ubicacion } = req.body;

  const p = await pool.query(`
    INSERT INTO producto (sku,nombre,descripcion,precio,garantia_meses,id_categoria,id_proveedor)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
  `, [sku, nombre, descripcion, precio, garantia_meses, id_categoria, id_proveedor]);

  await pool.query(`
    INSERT INTO inventario (id_producto,stock,stock_minimo,ubicacion)
    VALUES ($1,$2,$3,$4)
  `, [p.rows[0].id_producto, stock, stock_minimo, ubicacion]);

  res.json(p.rows[0]);
});

app.put('/productos/:id', async (req, res) => {
  const { nombre, descripcion, precio, garantia_meses, id_categoria, id_proveedor } = req.body;
  const r = await pool.query(`
    UPDATE producto SET nombre=$1,descripcion=$2,precio=$3,garantia_meses=$4,id_categoria=$5,id_proveedor=$6
    WHERE id_producto=$7 RETURNING *
  `, [nombre, descripcion, precio, garantia_meses, id_categoria, id_proveedor, req.params.id]);
  res.json(r.rows[0]);
});

// ==================== INVENTARIO ====================
app.put('/inventario/:id_producto', async (req, res) => {
  const { stock, stock_minimo, ubicacion } = req.body;
  const r = await pool.query(`
    UPDATE inventario SET stock=$1,stock_minimo=$2,ubicacion=$3
    WHERE id_producto=$4 RETURNING *
  `, [stock, stock_minimo, ubicacion, req.params.id_producto]);
  res.json(r.rows[0]);
});

// ==================== CARRITO ====================
app.post('/carrito', async (req, res) => {
  const { id_usuario } = req.body;
  const r = await pool.query(`
    INSERT INTO carrito (id_usuario) VALUES ($1)
    ON CONFLICT (id_usuario) DO UPDATE SET creado_en = CURRENT_TIMESTAMP
    RETURNING *
  `, [id_usuario]);
  res.json(r.rows[0]);
});

app.post('/carrito/detalle', async (req, res) => {
  const { id_carrito, id_producto, cantidad } = req.body;
  const r = await pool.query(`
    INSERT INTO carrito_detalle (id_carrito,id_producto,cantidad)
    VALUES ($1,$2,$3) RETURNING *
  `, [id_carrito, id_producto, cantidad]);
  res.json(r.rows[0]);
});

// ==================== PROCESAR VENTA ====================
app.post('/ventas', async (req, res) => {
  const client = await pool.connect();

  try {
    const { id_usuario, detalles, metodo_pago } = req.body;

    await client.query('BEGIN');

    let total = 0;

    for (const d of detalles) {
      const stockCheck = await client.query(`
        SELECT stock FROM inventario WHERE id_producto = $1
      `, [d.id_producto]);

      if (stockCheck.rows[0].stock < d.cantidad) {
        throw new Error(`Stock insuficiente para producto ${d.id_producto}`);
      }

      total += d.precio * d.cantidad;
    }

    const v = await client.query(`
      INSERT INTO venta (id_usuario,total,estado)
      VALUES ($1,$2,'pagado') RETURNING *
    `, [id_usuario, total]);

    for (const d of detalles) {
      await client.query(`
        INSERT INTO detalle_venta (id_venta,id_producto,cantidad,precio_unitario)
        VALUES ($1,$2,$3,$4)
      `, [v.rows[0].id_venta, d.id_producto, d.cantidad, d.precio]);

      await client.query(`
        UPDATE inventario SET stock = stock - $1 WHERE id_producto = $2
      `, [d.cantidad, d.id_producto]);
    }

    await client.query(`
      INSERT INTO pago (id_venta,metodo,monto)
      VALUES ($1,$2,$3)
    `, [v.rows[0].id_venta, metodo_pago, total]);

    await client.query('COMMIT');

    res.json({ ok: true, venta: v.rows[0] });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ==================== LOGIN ====================
app.post('/login', async (req, res) => {

  const { nombre, password } = req.body;

  try {

    const r = await pool.query(`
      SELECT id_usuario, nombre, rol
      FROM usuario
      WHERE nombre = $1 AND password = $2
    `, [nombre, password]);

    if (r.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    res.json(r.rows[0]);

  } catch (error) {

    res.status(500).json({
      error: 'Error en el servidor'
    });

  }

});
// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Backend corriendo en http://localhost:${PORT}`);
});
