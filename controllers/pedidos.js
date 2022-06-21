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


module.exports = {
    crearPedido
}