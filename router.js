const express = require('express');
const router = express.Router();

// Importa la instancia de ProductManager directamente
const peticion = require('./productManager');

// Lógica para obtener todos los productos
router.get('/', (req, res) => {
  const productos = peticion.ObtenerProductos();

  // Verificar si se proporciona el parámetro de consulta "limit"
  const limit = parseInt(req.query.limit);

  if (!isNaN(limit) && limit > 0) {
    // Si se proporciona un valor válido para "limit", ajusta la lista de productos
    const productosLimitados = productos.slice(0, limit);
    res.json(productosLimitados);
  } else {
    // Si no se proporciona "limit" o no es un valor válido, muestra todos los productos
    res.json(productos);
  }
});

router.get('/:cid', (req, res) => {
  const productId = parseInt(req.params.cid);
  const producto = peticion.obtenerProductoPorID(productId);

  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});


router.post('/', (req, res) => {
  // Obtener los datos del producto del cuerpo de la solicitud
  const { Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad } = req.body;
  if (!Titulo || !Descripcion || !Precio || !Miniatura || !Codigo || !Cantidad) {
    return res.status(400).json({ error: 'Se requieren todos los campos para agregar un producto.' });
  }

  // Busca si ya existe un producto con el mismo código
  const productoExistente = peticion.ObtenerProductos().find((producto) => producto.Codigo === Codigo);

  if (productoExistente) {
    // Si existe, actualiza la cantidad en lugar de agregar uno nuevo
    productoExistente.Cantidad += Cantidad;
    res.status(200).json(productoExistente);
  } else {
    // Si no existe, agrega un nuevo producto
    peticion.agregarProducto(Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad);
    const nuevoProducto = peticion.ObtenerProductos().find((producto) => producto.Codigo === Codigo);
    res.status(201).json(nuevoProducto);
  }
});


router.put('/:id', (req, res) => {
  // Obtener el ID del producto a actualizar desde los parámetros de la URL
  const productId = parseInt(req.params.id);

  // Obtener los nuevos datos del producto del cuerpo de la solicitud
  const { Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad } = req.body;

  // Encuentra el producto en la lista por su ID
  const productoExistente = peticion.obtenerProductoPorID(productId);

  // Verifica si el producto existe
  if (!productoExistente) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  // Actualiza los campos del producto si se proporcionan en la solicitud
  if (Titulo) {
    productoExistente.Titulo = Titulo;
  }
  if (Descripcion) {
    productoExistente.Descripcion = Descripcion;
  }
  if (Precio) {
    productoExistente.Precio = Precio;
  }
  if (Miniatura) {
    productoExistente.Miniatura = Miniatura;
  }
  if (Codigo) {
    productoExistente.Codigo = Codigo;
  }
  if (Cantidad) {
    productoExistente.Cantidad = Cantidad;
  }
// Devuelve el producto actualizado
  res.json(productoExistente);
});

// Agregar una nueva ruta DELETE para eliminar productos por ID
router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  // Busca el producto a eliminar por ID
  const productoEliminado = peticion.eliminarProducto(productId);

  if (productoEliminado) {
    res.json({ message: 'Producto eliminado con éxito', productoEliminado });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});


module.exports = router;
