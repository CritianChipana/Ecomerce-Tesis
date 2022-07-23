const { response, request } = require( 'express' );
const bcryptjs = require('bcryptjs');
const { Marca } =  require('../models');

// OBTENER MARCAS
const obtenerMarcas = async (req = request, res= response) => {

    const { limit =5, desde = 0 } = req.query;

    const [total, marcas] = await Promise.all([
        Marca.countDocuments( { estado : true }),
        
        Marca.find( { estado : true }).populate( "usuario", ["_id"] )
            .skip( Number( desde ) )  
            .limit( Number(  limit))
    ]);

    res.json({
        marcas,
        total
    });
};

// OBTENER MARCA POR ID
const obtenerMarcabyId = async (req = request, res= response) => {

    const _id = req.params.id;


    const marcaById = await Marca.findOne(  { _id, estado : true } ); 

    if( !marcaById ){
        return  res.status(400).json({
            msg : "El id no es valido - estado false"
        })
    }
    

    res.json({
        marca: marcaById,
        msg : "ok" 
    });
};

// CREAR MARCA
const crearMarca = async (req, res =response) => {

    const nombre = req.body.nombre.toUpperCase();
    const marcaDB = await Marca.findOne( { nombre } );

    if( marcaDB ){
        return res.status( 400 ).json({
            msg:" Ya existe la marca"
        })
    }

    // Generar ña data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    // console.log(data);

    const categoria = new Marca( data );

    categoria.save();
    
    res.status( 201 ).json( categoria );

}

// ACTUALIZAR MARCA
const actualizarMarca = async (req = request, res =response ) => {

    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();

    const nombrebica = await Marca.findOne( { nombre, estado:true } )

    if( nombrebica ){
        return res.status( 404).json({
            msg:"El nombre de la marca se repite"
        });
    }


    const categoria = await Marca.findByIdAndUpdate( id, {nombre}, { new: true })

    // console.log(categoria);

    if( !categoria.estado ){
        return res.status( 404).json({
            msg:"El estado de la marca es false"
        });
    }

    res.json({
        categoria
    });
}


// BORRAR MARCA
const borrarMarca = async (req, res) => {

    try {

        const { id } = req.params;
        
        // const categoria = await Marca.findByIdAndUpdate( id, { estado :false } , { new : true } )
        const marca = await Marca.findByIdAndRemove( id );
    
        res.json({
            success: true,
            msg: 'marca eliminada',
            id,
            categoria,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Comuniquese con el administrador',
        })
    }

}

module.exports = {
    obtenerMarcas,
    obtenerMarcabyId,
    crearMarca,
    actualizarMarca,
    borrarMarca
}