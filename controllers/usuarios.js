const { response, request, json } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT.JS');

const Usuario =  require('../models/usuario');
const { Bodega } = require('../models');


const usuariosGet = async (req = request, res= response) => {


    // const {q, nombre = "no ingreso nombre", apikey} = req.query;

    const { limit =10, desde = 0 } = req.query;
    /*  const usuario = await Usuario.find( { estado : true } )
        .skip( Number( desde ) )  // podemos validar desde donde, por cualquier error
        .limit( Number(  limit));
    const total = await Usuario.countDocuments( { estado : true } ); */


//Esto es una consulta mas rapida
    const [total, usuario] = await Promise.all([
        Usuario.countDocuments( { estado : true }),
        Usuario.find( { estado : true })
            .skip( Number( desde ) )  // podemos validar desde donde, por cualquier error
            .limit( Number(  limit))
    ])

    res.json({
        usuario,
        total
    }
        
    );
};

const usuariosGetPositions = async (req = request, res= response) => {


//Esto es una consulta mas rapida
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( { estado : true }),
        Usuario.find({ estado : true })
    ])

    const user = []

    usuarios.forEach(usuario => {
        user.push({
            id: usuario.id,
            nombre: usuario.nombre,
            longitud: usuario.longitud,
            latitud: usuario.latitud
        })
    });

    res.json({
        user,
        total
    }
        
    );
};


const usuariosPut = async (req = request, res =response ) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO VALIDAR EN LA BD
    if( password ){
        // Emcriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true })

    res.json({
        usuario
    });
}


const usuariosPost = async (req, res =response) => {

    const { nombre, correo, password, rol , img} = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol, img } );

    // Emcriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    //Guardar en BD
    await usuario.save();

            // Generar el JWT
            const token = await generarJWT( usuario.uid );

    res.json({
        'ok':true,
        token,
        usuario
    });
}

const usuariosPath   =(req, res) => {
    res.json({
        'ok':true,
        msg: 'PATCH API'
    })
}



const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    const uid = req.uid;
    // Fisicamente lo borra,ps
    // const usuario = await Usuario.findByIdAndDelete( id );
    
    const usuario = await Usuario.findByIdAndUpdate( id, { estado :false } , { new : true } )
    const userAntesDeEliminar = req.usuario;


    res.json({
        'ok':true,
        msg: 'DELETE API',
        id,
        usuario,
        userAntesDeEliminar
    })
}

const datosDelaBodegaByIdUser = async (req, res) => {

    try {
        const { id } = req.params;
        const bodega = await Bodega.find({ usuario: id , estado: true });

        if( bodega.length === 0 ){
            return res.status(400).json({
                success: false,
                msg: 'No existe la bodega'
            });
        }

        res.json({
            'ok':true,
            bodega
        })
    }
    catch (error) {
        res.json({
            'ok':false,
            error
        })
    }
}

const changePassword = async (req, res) => {

    try{
        const user = req.usuario;
        const { oldPassword, newPassword } = req.body;
        
        const usuario = await Usuario.findById( user.id );
        
        const validPassword = bcryptjs.compareSync( oldPassword, usuario.password )
        if( !validPassword ){
            return   res.status(400).json({
                success: false,
                msg:'Password incorrectos',
            })
        }
        
        const salt = bcryptjs.genSaltSync();
        const passwordEncriptado = bcryptjs.hashSync( newPassword, salt );
        
        await Usuario.findByIdAndUpdate( user.id, { password: passwordEncriptado }, { new: true } );
        
        res.json({
            'success':true,
            msg: "Contraseña cambiada",
        })
    }
    catch (error) {
        res.status(500).json({
            'success':false,
            msg: "Error al cambiar contraseña, hable con el administrador",
            error
        })
    }
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPath,
    usuariosDelete,
    usuariosGetPositions,
    datosDelaBodegaByIdUser,
    changePassword
}
