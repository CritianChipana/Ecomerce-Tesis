const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { Categoria, Producto, Bodega } =  require('../models');

const crearbodega = async (req, res =response) => {

    try {
        const {estado, usuario, email,  ...body } = req.body;
        const nombre = req.body.nombre.toUpperCase();
    
        const bodegaBD = await Bodega.findOne( { nombre } );
    
        if( !!bodegaBD ){
            return res.status( 400 ).json({
                success: false,
                msg:" El nombre de la bodega ya existe"
            })
        }

        const dos = await Bodega.findOne( {email} );
    
        if( !!dos ){
            return res.status( 400 ).json({
                success: false,
                msg:" El email de la bodega ya existe"
            })
        }
    
        const data = {
            ...body,
            nombre,
            email,
            // usuario: req.usuario._id,
        }
    
        const bodega = new Bodega( data );
        bodega.save();
        
        res.status( 201 ).json( {
            success: true,
            msg: "Bodega creada correctamente",
            bodega
        } );
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo crear bodega, Comuniquese con el administrador',
        })
    }

    

}

module.exports = {
    crearbodega
}
