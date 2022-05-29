
const { Schema, model } = require( 'mongoose' );


const BoletaSchema = Schema({

    nombre:{
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique :  true
    },
    fecha : {
        type: String,
        require: [true, "El nombre es obligatorio"],
        required :  true
    },
    estado:{
        type: Boolean,
        default: true,
        required : true
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required :  true
    }

});

BoletaSchema.methods.toJSON = function(){
    const {__v,estado,...data } = this.toObject();
    return data;
}


module.exports = model( 'Boleta', BoletaSchema );
