const { response, request } = require('express');

const bcryptjs = require('bcryptjs');
const { Pedido, DetallePedido } = require('../models');

const crearPedido = async (req = request, res = response) => {

    try {
        const { estado, productos, ...body } = req.body;
        const data = {
            ...body,
            usuario: req.usuario._id,
            estado: true
        }

        const pedido = new Pedido(data);
        pedido.save();

        productos.forEach(async (producto) => {
            const { cantidad, precio, ...data } = producto;
            const detallePedido = new DetallePedido({
                ...data,
                pedido: pedido._id,
                total: precio * cantidad,
                precio,
                cantidad
            });
            await detallePedido.save();
        });

        res.status(201).json({
            success: true,
            data: pedido
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo crear el pedido, Contacte al administrador',
            data: error
        });
    }


}

const getPedidos = async (req = request, res = response) => {

    try {
        const pedidos = await Pedido.find({ estado: true });
        res.status(200).json({
            success: true,
            data: pedidos
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo obtener los pedidos, Contacte al administrador',
            data: error
        });
    }
}

const getDetallePedidoById = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const detallePedido = await DetallePedido.find({ pedido: id });
        res.status(200).json({
            success: true,
            detallePedido: detallePedido
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo obtener el pedido, Contacte al administrador',
            data: error
        });
    }
}

const updatePedido = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const { estado, productos, ...body } = req.body;
        const data = {
            ...body,
            usuario: req.usuario._id,
            estado: true
        }

        const pedido = await Pedido.findByIdAndUpdate(id, data, { new: true });
        await DetallePedido.deleteMany({ pedido: id });
        productos.forEach(async (producto) => {
            const { cantidad, precio, ...data } = producto;
            const detallePedido = new DetallePedido({
                ...data,
                pedido: pedido._id,
                total: precio * cantidad,
                precio,
                cantidad
            });
            await detallePedido.save();
        });

        res.status(200).json({
            success: true,
            data: pedido
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo actualizar el pedido, Contacte al administrador',
            data: error
        });
    }
}

const deletePedido = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const pedido = await Pedido.deleteOne({ _id: id });
        await DetallePedido.deleteMany({ pedido: id });
        res.status(200).json({
            success: true,
            msg: 'Pedido eliminado',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo eliminar el pedido, Contacte al administrador',
            data: error
        });
    }
}


module.exports = {
    crearPedido,
    getPedidos,
    getDetallePedidoById,
    updatePedido,
    deletePedido
}