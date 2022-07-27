const { response, request } = require("express");

const bcryptjs = require("bcryptjs");
const { Pedido, DetallePedido, Bodega } = require("../models");

const crearPedido = async (req = request, res = response) => {
  try {
    const { estado, productos, ...body } = req.body;

    const bodeguero = await Bodega.findOne({ usuario: productos[0].usuario.uid });

    if (!bodeguero) {
      return res.status(400).json({
        success: false,
        msg: "No existe un bodeguero asociado a este usuario",
      });
    }

    const data = {
      ...body,
      usuario: req.usuario._id,
      estado: true,
      bodega: bodeguero._id,
    };

    const pedido = new Pedido(data);
    pedido.save();

    productos.forEach(async (producto) => {
      const { cantidad, precio, _id, ...data } = producto;
      const detallePedido = new DetallePedido({
        ...data,
        pedido: pedido._id,
        total: precio * cantidad,
        precio,
        cantidad,
        producto: _id,
      });
      await detallePedido.save();
    });

    res.status(201).json({
      success: true,
      data: pedido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo crear el pedido, Contacte al administrador",
      data: error,
    });
  }
};

const getPedidos = async (req = request, res = response) => {
  try {
    const { _id } = req.usuario;

    const existePedidos = await Bodega.findOne({ usuario: _id });

    if (!existePedidos) {
      res.status(400).json({
        success: false,
        msg: "No se encontro pedidos del usuario",
      });
    }

    const pedidos = await Pedido.find({
      estado: true,
      bodega: existePedidos._id,
    }).populate("bodega");

    res.status(200).json({
      success: true,
      data: pedidos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo obtener los pedidos, Contacte al administrador.",
      data: error,
    });
  }
};

const getPedidoByStatus = async (req = request, res = response) => {
  try {
    const { _id } = req.usuario;

    const pedido = await Pedido.find({
      estado: true,
      usuario: _id,
      status: "por pedir",
    }).populate("bodega");
    ;
    // console.log(pedidos);

    const detallePedido = await DetallePedido.find({ pedido: pedido[0]._id }).populate(
      "producto"
    );

    if (pedido.length === 0) {
      res.status(400).json({
        success: false,
        msg: "No se encontro pedidos del usuario",
      });
    }

    res.status(200).json({
      success: true,
      data: {pedido,productos: detallePedido},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo obtener los pedidos, Contacte al administrador.",
      data: error,
    });
  }
};

const getPedidosByIdUser = async (req = request, res = response) => {
  try {
    const { _id } = req.usuario;

    const pedidos = await Pedido.find({ estado: true, usuario: _id }).populate(
      "bodega"
    );

    res.status(200).json({
      success: true,
      data: pedidos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo obtener los pedidos, Contacte al administrador",
      data: error,
    });
  }
};

const getDetallePedidoById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const detallePedido = await DetallePedido.find({ pedido: id }).populate(
      "producto"
    );
    res.status(200).json({
      success: true,
      detallePedido: detallePedido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo obtener el pedido, Contacte al administrador",
      data: error,
    });
  }
};

const getPedidoById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id).populate("bodega");
    res.status(200).json({
      success: true,
      pedido: pedido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo obtener el pedido, Contacte al administrador",
      data: error,
    });
  }
};

const updateStatusPedido = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id)
    console.log(status)

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      res.status(400).json({
        success: false,
        msg: "No se encontro pedido",
      });
    }

    const pedidoUpdated = await Pedido.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: pedidoUpdated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo actualizar el pedido, Contacte al administrador.",
      data: error,
    });
  }
};

const deletePedido = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByIdAndDelete({ _id: id });
    console.log(pedido);
    // obtener el detalle del pedido para reponer los productos

    // await DetallePedido.deleteMany({ pedido: id });
    res.status(200).json({
      success: true,
      msg: "Pedido eliminado",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo eliminar el pedido, Contacte al administrador",
      data: error,
    });
  }
};

const updatePedido = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { estado, productos, ...body } = req.body;

    const pedido = await Pedido.findById(id);
    

    if (!pedido) {
      res.status(400).json({
        success: false,
        msg: "No se encontro pedido",
      });
    }

    const pedidoUpdated = await Pedido.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    const detallePedido = await DetallePedido.find({ pedido: id });

    detallePedido.forEach(async (detalle) => {
      const { cantidad, precio, _id, ...data } = detalle;
      const detallePedido = new DetallePedido({
        ...data,
        pedido: pedido._id,
        total: precio * cantidad,
        precio,
        cantidad,
        producto: _id,
      });
      await detallePedido.save();
    });

    res.status(200).json({
      success: true,
      data: pedidoUpdated,
      productos:detallePedido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "No se pudo actualizar el pedido, Contacte al administrador.",
      data: error,
    });
  }
};

module.exports = {
  crearPedido,
  getPedidos,
  getDetallePedidoById,
  updateStatusPedido,
  deletePedido,
  getPedidosByIdUser,
  getPedidoById,
  updatePedido,
  getPedidoByStatus,
};
