const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { Categoria, Producto } =  require('../models');

const crearBoleta = async (req, res =response) => {

    try {
        producto
    } catch (error) {
        
    }

    const {estado, usuario,  ...body } = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const productoBD = await Producto.findOne( { nombre } );

    if( productoBD ){
        return res.status( 400 ).json({
            msg:" Ya existe producto - !productoBD "
        })
    }
    const validarestadocategoria = await Categoria.findById( body.categoria );

    if(!validarestadocategoria.estado){
        return res.status( 400 ).json({
            msg:"Verifique el estado de la categoria"
        })
    }

    const data = {
        nombre,
        ...body,
        usuario: req.usuario._id,
    }

    const producto = new Producto( data );
    producto.save();
    
    res.status( 201 ).json( producto );
    

}


module.exports = {
    crearBoleta
}