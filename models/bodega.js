
const { Schema, model } = require( 'mongoose' );

const BodegaSchema = Schema({

    nombre:{
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique :  true
    },
    descripcion:{
        type: String,
        require: [true, "La descripcion es obligatorio"],
    },
    nombrePropietario: {
        type: String,
        require: [true, "El nombre del propietario es obligatorio"],
    },
    telefono: {
        type: Number,
        require: [true, "El telefono es obligatorio"],
    },
    ubicacionDeBodega: {
        type: Number,
        require: [true, "La ubicacion de la bodega es obligatorio"],
    },
    email:{
        type: String,
        require: [true, "El email es obligatorio"],
        unique :  true
    },
    horarioBodega: {
        type: String,
        require: [true, "El horario de la bodega es obligatorio"],
    },
    youtube: {
        type: String,
        // require: [true, "El horario de la bodega es obligatorio"],
    },
    imagen: {
        type: String,
        require: [true, "la imagen es obligatorio"],
    },
    fecha : {
        type: String,
        require: [true, "La fecha es obligatoria"],
        // required :  true
    },
    estado:{
        type: Boolean,
        default: true,
        required : true
    },
    // usuario : {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Usuario',
    //     required :  true
    // }

});

BodegaSchema.methods.toJSON = function(){
    const {__v,estado,...data } = this.toObject();
    return data;
}


module.exports = model( 'Bodega', BodegaSchema );
