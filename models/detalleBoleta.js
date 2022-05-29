
const { Schema, model } = require( 'mongoose' );


const DetalleBoletaSchema = Schema({

    nombre:{
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique :  true
    },
    cantidad:{
        type: Number,
        required : true
    },
    precio:{
        type: Number,
        required : true
    },
    boleta : {
        type: Schema.Types.ObjectId,
        ref: 'Boleta',
        required :  true
    },
    producto : {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required :  true
    },

});

DetalleBoletaSchema.methods.toJSON = function(){
    const {__v,estado,...data } = this.toObject();

    return data;
}


module.exports = model( 'Categoria', DetalleBoletaSchema );
