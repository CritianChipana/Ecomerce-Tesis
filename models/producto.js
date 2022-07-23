
const { Schema, model } = require('mongoose');


const ProductoSchema = Schema({

    nombre: {
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    bodegero: {
        type: Schema.Types.ObjectId,
        ref: 'Bodega'
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, "La categoria es obligatoria"],
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
    img: { type: String },
    idProducto: {
        type: String,
        require: [true, "El idProducto es obligatorio"],
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, "El stock es obligatorio"],
    },
    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: [true, "La marca es obligatoria"],
    },
    yape:{
        type: String,
        require: [true, "El yape es obligatorio"],
    }
});

ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();

    return data;
}


module.exports = model('Producto', ProductoSchema);

