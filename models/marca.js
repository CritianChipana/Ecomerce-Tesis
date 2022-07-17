
const { Schema, model } = require( 'mongoose' );


const MarcaSchema = Schema({

    nombre:{
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique :  true
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

MarcaSchema.methods.toJSON = function(){
    const {__v,estado,...data } = this.toObject();
   
    return data;
}


module.exports = model( 'Marca', MarcaSchema );

