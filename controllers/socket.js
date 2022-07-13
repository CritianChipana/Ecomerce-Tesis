const { Usuario } = require('../models');
const usuarioConectado=async (uid)=>{
    const usuario=await Usuario.findById(uid);
    if(!usuario){
        return false;
    }
    return usuario;
}

module.exports={
    usuarioConectado
}