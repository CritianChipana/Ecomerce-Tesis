
const { Schema, model } = require( 'mongoose' );


const DetallePedidoSchema = Schema({

    cantidad:{
        type: Number,
        required : true
    },
    precio:{
        type: Number,
    },
    total:{
        type: Number,
    },
    pedido : {
        type: Schema.Types.ObjectId,
        ref: 'Pedido',
        required :  true
    },
    producto : {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required :  true
    },

});

DetallePedidoSchema.methods.toJSON = function(){
    const {__v,estado,...data } = this.toObject();

    return data;
}


module.exports = model( 'DetallePedido', DetallePedidoSchema );
