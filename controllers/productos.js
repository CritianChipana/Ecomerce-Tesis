const { response, request } = require("express");

const bcryptjs = require("bcryptjs");
const { Categoria, Producto, Marca, Bodega, Usuario } = require("../models");

// OBTENER CATEGORIAS
const obtnerProductos = async (req = request, res = response) => {
  // const { limit =5, desde = 0 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),

    Producto.find({ estado: true })
      .populate("usuario", ["_id"])
      .populate("categoria", ["_id", "usuario", "nombre"])
      .populate("marca", ["_id", "usuario", "nombre"]),
  ]);

  res.json({
    productos,
    total,
  });
};

const obtnerProductosByCategoria = async (req = request, res = response) => {
  const { nombre } = req.params;
  const categoria = await Categoria.findOne({ nombre: nombre });
  const productos = await Producto.find({
    categoria: categoria._id,
    estado: true,
  });

  res.json({
    productos,
  });
};

const obtnerProducto = async (req = request, res = response) => {
  const _id = req.params.id;

  const producto = await Producto.findOne({ _id, estado: true })
    .populate("categoria", ["nombre"])
    .populate("marca", ["nombre"]);
  // obtener bodega del usuario
  const bodega = await Bodega.findOne({ usuario: producto.usuario._id });
  console.log("se consulto la bodega");

  if (!producto) {
    return res.status(400).json({
      msg: "El id no es valido - sigue intentando estado false",
    });
  }

  res.json({
    producto,
    bodega,
  });
};

// CREAR Producto ******************************************************
const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;
  const nombre = req.body.nombre.toUpperCase();

  const productoBD = await Producto.findOne({ nombre });

  if (productoBD) {
    return res.status(400).json({
      msg: " Ya existe producto - !productoBD ",
    });
  }
  const validarestadocategoria = await Categoria.findById(body.categoria);

  if (!validarestadocategoria.estado) {
    return res.status(400).json({
      msg: "Verifique el estado de la categoria",
    });
  }

  const validarEstadoMarca = await Marca.findById(body.marca);
  if (!validarEstadoMarca?.estado) {
    return res.status(400).json({
      msg: "Verifique el estado de la Marca",
    });
  }

  const data = {
    nombre,
    ...body,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);
  producto.save();

  res.status(201).json(producto);
};

// Actualizar Producto
const actualizarProducto = async (req = request, res = response) => {
  const id = req.params.id;
  const { precio, descripcion, disponible, categoria, stock, marca, img } =
    req.body;

  const nombre = req.body.nombre.toUpperCase();

  const validarestadocategoria = await Categoria.findById(categoria);
  if (!validarestadocategoria?.estado) {
    return res.status(400).json({
      msg: "Verifique el estado de la categoria",
    });
  }

  const validarEstadoMarca = await Marca.findById(marca);
  if (!validarEstadoMarca?.estado) {
    return res.status(400).json({
      msg: "Verifique el estado de la Marca",
    });
  }

  const productoID = await Producto.findById(id);

  if (productoID.nombre !== nombre) {
    const productoDB = await Producto.findOne({ nombre });

    //  Si el producto existe
    if (productoDB) {
      return res.status(400).json({
        msg: `  La Producto ${productoDB.nombre}, ya existe`,
      });
    }
  }

  const productomodificado = await Producto.findByIdAndUpdate(
    id,
    {
      nombre,
      precio,
      descripcion,
      disponible,
      img,
      categoria,
      marca,
      stock,
    },
    { new: true }
  );

  console.log(productomodificado);

  res.json({
    productomodificado,
  });
};

// Borrar Categoria
const borrarProducto = async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    ok: true,
    msg: "DELETE API",
    id,
    producto,
    // categoriaAnterior
  });
};

const obtenerProdutosByUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  console.log(id);

  const productos = await Producto.find({ usuario: id, estado: true })
    .populate("categoria", ["nombre"])
    .populate("marca", ["nombre"]);

  res.json({
    productos,
  });
};

const actualizarStock = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const producto = await Producto.findById(id);

    if (stock < 0) {
      return res.status(400).json({
        msg: "No puede actualizar el stock con esa cantidad",
      });
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );

    res.status(200).json({
      msg: "UPDATE STOCK",
      producto: productoActualizado,
    });
  } catch (error) {
    console.log(error);
  }
};

const stockDecrementar = async (req = request, res = response) => {
  const { id } = req.params;
  // const { stock } = req.body;

  const producto = await Producto.findById(id);

  if (producto.stock <= 0) {
    return res.status(400).json({
      msg: "No hay stock",
    });
  }
  const productoActualizado = await Producto.findByIdAndUpdate(
    id,
    { stock: producto.stock - 1 },
    { new: true }
  );
  // const productoActualizado = await Producto.findByIdAndUpdate(id, { stock: stock-1}, { new: true })

  res.status(200).json({
    msg: "UPDATE STOCK",
    producto: productoActualizado,
  });
};

const stockIncrementar = async (req = request, res = response) => {
  const { id } = req.params;
  // const { stock } = req.body;

  const producto = await Producto.findById(id);

  if (producto.stock <= 0) {
    return res.status(400).json({
      msg: "No hay stock",
    });
  }
  const productoActualizado = await Producto.findByIdAndUpdate(
    id,
    { stock: producto.stock + 1 },
    { new: true }
  );

  res.status(200).json({
    msg: "UPDATE STOCK",
    producto: productoActualizado,
  });
};

const agregarFavorito = async (req = request, res = response) => {
  // id del producto
  const { id } = req.params;
  // obtener usuario del token
  const usuario = req.usuario;
  const idUsuario= usuario._id;
  // console.log(usuario,"usuario");

  const producto = await Producto.findById(id);

  if(!producto){
    return res.status(400).json({
      msg: "El producto no existe"
    })
  }

  // remover producto de favoritos
  if (usuario.favoritos.includes(id)) {
    const favoritos = usuario.favoritos.filter((fav) => {
      fav!== producto._id;
    });
    console.log(favoritos);
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      idUsuario,
      { favoritos },
      { new: true }
    );

    return res.status(200).json({
      msg: "Producto removido de favoritos",
      favoritos: usuarioActualizado,
    });
  }

  const usuarioActualizado = await Usuario.findByIdAndUpdate(
    idUsuario,
    { favoritos: producto },
    { new: true }
  );

  const { favoritos } = usuarioActualizado;

  res.status(200).json({
    msg: "Producto agregado a favoritos",
    favoritos,
  });
};

const obtenerFavoritos = async (req = request, res = response) => {
  // obtener usuario del token
  const usuario = req.usuario;
  console.log("get favoritos");

  if(!usuario.favoritos){
    return res.status(400).json({
      msg: "El usuario no tiene favoritos",
      favoritos:[]
    });
  }

  const productos = await Producto.find({ _id: usuario.favoritos });

  res.json({
    msg: "Favoritos",
    productos,
  });
}

module.exports = {
  obtnerProductos,
  obtnerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
  obtnerProductosByCategoria,
  obtenerProdutosByUsuario,
  actualizarStock,
  stockDecrementar,
  stockIncrementar,
  agregarFavorito,
  obtenerFavoritos
};
