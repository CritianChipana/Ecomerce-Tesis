
const { Schema, model } = require('mongoose');


const PedidoSchema = Schema({

    nombre: {
        type: String,
        require: [true, "El nombre es obligatorio"],
    },
    importe: {
        type: Number,
        require: [true, "El Importe es obligatorio"],
    },
    fecha: {
        type: String,
        require: [true, "El nombre es obligatorio"],
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    status: {
        type: String,
        default: "ordenado",
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    bodega: {
        type: Schema.Types.ObjectId,
        ref: 'Bodega',
    }
});

PedidoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model('Pedido', PedidoSchema);
