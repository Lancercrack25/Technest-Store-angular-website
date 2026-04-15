import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { initDatabase } from './init.js';

const app = express();
app.use(cors());
app.use(express.json());

await initDatabase();

//esto mantiene el servidor activo y evita que solo se active cuando se hace alguna solicitud, ya se mantiene activo hasta que se requiera hacer control + c en la terminal del backend
setInterval(() => {
  pool.query('SELECT 1').catch(() => {}); //esto es solo para mantener la conexión viva, no hace nada realmente, pero evita que el servidor se "duerma" en plataformas como Heroku o Railway
}, 30000);

// ==================== CLIENTES ====================

app.get('/cliente/perfil/:id', async (req, res) => {
  const r = await pool.query(
    'SELECT id_cliente, nombre, email, telefono, rol, imagen FROM cliente WHERE id_cliente=$1',
    [req.params.id]
  );
  res.json(r.rows[0]);
});

app.put('/cliente/imagen/:id', async (req, res) => {
  const { imagen } = req.body;
  const r = await pool.query(`
    UPDATE cliente SET imagen=$1 WHERE id_cliente=$2 RETURNING *
  `, [imagen, req.params.id]);
  res.json(r.rows[0]);
});

app.get('/cliente', async (_, res) => {
  const r = await pool.query('SELECT id_cliente,nombre,email,telefono,rol FROM cliente');
  res.json(r.rows);
});

app.post('/cliente', async (req, res) => {
  const { nombre, email, password, telefono, rol } = req.body;
  const r = await pool.query(`
    INSERT INTO cliente (nombre,email,password,telefono,rol,creado_en)
    VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *
  `, [nombre, email, password, telefono, rol || 'cliente']);
  res.json(r.rows[0]);
});

app.put('/cliente/:id', async (req, res) => {
  const { nombre, email, telefono, rol } = req.body;
  const r = await pool.query(`
    UPDATE cliente SET nombre=$1,email=$2,telefono=$3,rol=$4
    WHERE id_cliente=$5 RETURNING *
  `, [nombre, email, telefono, rol, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/cliente/:id', async (req, res) => {
  await pool.query('DELETE FROM cliente WHERE id_cliente=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== CATEGORIAS ====================
app.get('/categorias', async (_, res) => {
  const r = await pool.query('SELECT * FROM categoria ORDER BY nombre');
  res.json(r.rows);
});

app.post('/categorias', async (req, res) => {
  const { nombre, descripcion, id_padre } = req.body;
  const r = await pool.query(`
    INSERT INTO categoria (nombre,descripcion,id_padre)
    VALUES ($1,$2,$3) RETURNING *
  `, [nombre, descripcion, id_padre]);
  res.json(r.rows[0]);
});

app.put('/categorias/:id', async (req, res) => {
  const { nombre, descripcion } = req.body;
  const r = await pool.query(`
    UPDATE categoria SET nombre=$1,descripcion=$2
    WHERE id_categoria=$3 RETURNING *
  `, [nombre, descripcion, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/categorias/:id', async (req, res) => {
  await pool.query('DELETE FROM categoria WHERE id_categoria=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== PROVEEDORES ====================
app.get('/proveedores', async (_, res) => {
  const r = await pool.query('SELECT * FROM proveedor');
  res.json(r.rows);
});

app.post('/proveedores', async (req, res) => {
  const { razon_social, rfc, contacto, email, telefono } = req.body;
  const r = await pool.query(`
    INSERT INTO proveedor (razon_social,rfc,contacto,email,telefono,activo)
    VALUES ($1,$2,$3,$4,$5,true) RETURNING *
  `, [razon_social, rfc, contacto, email, telefono]);
  res.json(r.rows[0]);
});

app.put('/proveedores/:id', async (req, res) => {
  const { razon_social, contacto, email, telefono } = req.body;
  const r = await pool.query(`
    UPDATE proveedor SET razon_social=$1,contacto=$2,email=$3,telefono=$4
    WHERE id_proveedor=$5 RETURNING *
  `, [razon_social, contacto, email, telefono, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/proveedores/:id', async (req, res) => {
  await pool.query('DELETE FROM proveedor WHERE id_proveedor=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== PRODUCTOS ====================
app.get('/productos', async (_, res) => {
  const r = await pool.query(`
    SELECT p.*, c.nombre AS categoria, pr.razon_social AS proveedor
    FROM producto p
    LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
  `);
  res.json(r.rows);
});

app.post('/productos', async (req, res) => {
  const { numero_de_serie, nombre, descripcion, precio, costo, garantia_meses, id_categoria, id_proveedor } = req.body;
  const r = await pool.query(`
    INSERT INTO producto (numero_de_serie,nombre,descripcion,precio,costo,garantia_meses,id_categoria,id_proveedor,activo)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true) RETURNING *
  `, [numero_de_serie, nombre, descripcion, precio, costo, garantia_meses, id_categoria, id_proveedor]);
  res.json(r.rows[0]);
});

app.put('/productos/:id', async (req, res) => {
  const { numero_de_serie, nombre, descripcion, precio, costo, garantia_meses, id_categoria, id_proveedor } = req.body;
  const r = await pool.query(`
    UPDATE producto SET numero_de_serie=$1,nombre=$2,descripcion=$3,precio=$4,costo=$5,garantia_meses=$6,id_categoria=$7,id_proveedor=$8
    WHERE id_producto=$9 RETURNING *
  `, [numero_de_serie, nombre, descripcion, precio, costo, garantia_meses, id_categoria, id_proveedor, req.params.id]);
  res.json(r.rows[0]);
});

app.delete('/productos/:id', async (req, res) => {
  await pool.query('DELETE FROM producto WHERE id_producto=$1', [req.params.id]);
  res.json({ ok: true });
});

// ==================== CARRITO ====================
app.post('/carrito', async (req, res) => {
  const { id_cliente } = req.body;
  const r = await pool.query(`
    INSERT INTO carrito (id_carrito,id_cliente,creado_en,estado)
    VALUES (gen_random_uuid()::text,$1,NOW(),'Activo')
    ON CONFLICT (id_cliente) DO UPDATE SET creado_en = CURRENT_TIMESTAMP
    RETURNING *
  `, [id_cliente]);
  res.json(r.rows[0]);
});

app.post('/carrito/detalle', async (req, res) => {
  const { id_carrito, id_producto, cantidad } = req.body;
  const prod = await pool.query(`SELECT precio FROM producto WHERE id_producto=$1`, [id_producto]);
  const r = await pool.query(`
    INSERT INTO carrito_detalle (id_carrito,id_producto,cantidad,precio_unitario)
    VALUES ($1,$2,$3,$4) RETURNING *
  `, [id_carrito, id_producto, cantidad, prod.rows[0].precio]);
  res.json(r.rows[0]);
});

// ==================== VENTAS ====================
app.post('/ventas', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_cliente, detalles, metodo_pago, direccion_envio } = req.body;
    await client.query('BEGIN');

    let subtotal = 0;
    for (const d of detalles) {
      const prod = await client.query(`SELECT precio FROM producto WHERE id_producto=$1`, [d.id_producto]);
      subtotal += prod.rows[0].precio * d.cantidad;
    }

    const impuestos = subtotal * 0.16;
    const total = subtotal + impuestos;

    const v = await client.query(`
      INSERT INTO venta (id_venta,id_cliente,fecha,subtotal,impuestos,total,estado,canal)
      VALUES (gen_random_uuid()::text,$1,NOW(),$2,$3,$4,'Completada','Web')
      RETURNING *
    `, [id_cliente, subtotal, impuestos, total]);

    for (const d of detalles) {
      const prod = await client.query(`SELECT precio FROM producto WHERE id_producto=$1`, [d.id_producto]);
      await client.query(`
        INSERT INTO detalle_venta (id_venta,id_producto,cantidad,precio_unitario,descuento,subtotal)
        VALUES ($1,$2,$3,$4,0,$5)
      `, [v.rows[0].id_venta, d.id_producto, d.cantidad, prod.rows[0].precio, prod.rows[0].precio * d.cantidad]);
    }

    await client.query(`
      INSERT INTO pago (id_pago,id_venta,monto,metodo_pago,fecha_pago,estado)
      VALUES (gen_random_uuid()::text,$1,$2,$3,NOW(),'Aprobado')
    `, [v.rows[0].id_venta, total, metodo_pago]);

    await client.query(`
      INSERT INTO envio (id_venta,transportista,num_guia,direccion_destino,fecha_envio,estado)
      VALUES ($1,'Pendiente','N/A',$2,NOW(),'Preparando')
    `, [v.rows[0].id_venta, direccion_envio]);

    await client.query(`
      INSERT INTO factura (id_venta,rfc_cliente,razon_social,direccion_fiscal,uso_cfdi,fecha_emision,total)
      VALUES ($1,'XAXX010101000','Publico General',$2,'G03',NOW(),$3)
    `, [v.rows[0].id_venta, direccion_envio, total]);

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
      SELECT id_cliente, nombre, password, email, telefono, rol, imagen
      FROM cliente
      WHERE nombre = $1
    `, [nombre]);

    if (r.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const user = r.rows[0];

    // 🔥 validar password manualmente
    if (user.password !== password) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    // 🔥 eliminar password antes de enviar
    delete user.password;

    res.json(user);

  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor'
    });
  }
});

// ==================== login admin ====================
app.post('/admin/login', (req, res) => {
  const { nombre, password } = req.body;

  if (nombre === process.env.AD_NAME && password === process.env.AD_PASSWORD) {
    res.json({ ok: true, rol: 'admin' });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Backend corriendo en http://localhost:${PORT}`);
});