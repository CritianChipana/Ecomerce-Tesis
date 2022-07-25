const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto,
    obtnerProductos,
    obtnerProducto,
    actualizarProducto,
    borrarProducto,
    obtnerProductosByCategoria, 
    obtenerProdutosByUsuario,
    actualizarStock,
    stockDecrementar,
    stockIncrementar,
    agregarFavorito,
    obtenerFavoritos,
    obtenerProductoPorNombre} = require('../controllers/productos');

const {
    existeCategoria,
    estadoActivoProducto,
    existeProducto,
    existecategoriaConEstadoTrue,
    existeProductoporId,
    existeProductoPorNombreDeCategoria, 
    existeUsuariPorId} = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

// OBTENER TODAS LAS CATEGORIAS
router.get('/', obtnerProductos)

router.get('/:id',
    [
        check('id', "El id del producto no es ID valido").isMongoId(),
        check('id').custom(existeProductoporId),
        // check('id').custom( estadoActivoProducto ),
        validarCampos
    ]
    , obtnerProducto)

// OBTENER PRODUCTOS POR NOMBRE DE CATEGORIA
router.get('/categoria/:nombre',
    [
        check('nombre').custom(existeProductoPorNombreDeCategoria),
        validarCampos
    ],
    obtnerProductosByCategoria)

router.get('/:id',
    [
        check('id', "El id del producto no es ID valido").isMongoId(),
        check('id').custom(existeProductoporId),
        check('id').custom(estadoActivoProducto),
        validarCampos
    ]
    , obtnerProducto)

// buscar productos por nombre
router.get('/:nombre',
    [
        check('nombre', "El nombre del producto no es valido").not().isEmpty(),
        check('nombre').custom(existeProducto),
        validarCampos
    ],
    obtenerProductoPorNombre
)

// get productos por usuario
router.get('/user/:id',
    [
        check('id', "El id del producto no es ID valido").isMongoId(),
        check('id').custom(existeUsuariPorId),
        validarCampos
    ]
    , obtenerProdutosByUsuario)

// Crear Categoria cualquier - privado - token valido
router.post('/',
    [
        validarJWT,
        check('categoria', "El valor de categoria no es ID valido de mongo").isMongoId(),
        check('categoria').custom(existeCategoria),
        // check('bodegero', "El valor de bodegero no es ID valido de mongo").isMongoId(),
        // check('bodegero').custom(existecategoriaConEstadoTrue),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("precio", "El precio es obligatorio").not().isEmpty(),
        check("descripcion", "El descripcion es obligatorio").not().isEmpty(),
        // check( "disponible","El disponible es obligatorio" ).not().isEmpty(),
        validarCampos
    ]
    , crearProducto);


// actualizar privado cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', "El id del producto no es ID valido").isMongoId(),
    check('id').custom(existeProducto),
    // check('bodegero', "El valor de bodegero no es ID valido de mongo").isMongoId(),
    // check('bodegero').custom(existecategoriaConEstadoTrue),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("precio", "El precio es obligatorio").not().isEmpty(),
    check("descripcion", "El descripcion es obligatorio").not().isEmpty(),
    validarCampos
], actualizarProducto)

// BORRAR UNA CATEGORIA -ADMI
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', "El id del producto no es ID valido").isMongoId(),
    // check('id').custom( existeCategoria ),
    // check('id').custom( estadoActivoCategoria ),
    // check('bodegero', "El valor de bodegero no es ID valido de mongo").isMongoId(),
    // check('bodegero').custom(existecategoriaConEstadoTrue),
    validarCampos
], borrarProducto)

// actualizar stock del producto
router.put('/stock/:id', [
    validarJWT,
    check('id', "El id del producto no es ID valido").isMongoId(),
    check('id').custom(existeProducto),
    // check("disponible", "El disponible es obligatorio").not().isEmpty(),
    validarCampos
], actualizarStock)

// actualizar stock del producto - 1

router.put('/stock/decrementar/:id', [
    validarJWT,
    check('id', "El id del producto no es ID valido").isMongoId(),
    check('id').custom(existeProducto),
    check('cantidad', "La cantidad no es valida").isNumeric(),
    // check("disponible", "El disponible es obligatorio").not().isEmpty(),
    validarCampos
], stockDecrementar)

router.put('/stock/incrementar/:id', [
    validarJWT,
    check('id', "El id del producto no es ID valido").isMongoId(),
    check('id').custom(existeProducto),
    check('cantidad', "La cantidad no es valida").isNumeric(),
    // check("disponible", "El disponible es obligatorio").not().isEmpty(),
    validarCampos
], stockIncrementar)

router.post('/favorite/:id', [
    validarJWT,
    check('id', "El id del producto no es ID valido").isMongoId(),
    check('id').custom(existeProducto),
    // check("disponible", "El disponible es obligatorio").not().isEmpty(),
    validarCampos
], agregarFavorito)

router.get('/favorite/:id', [
    validarJWT,
    check('id', "El id del producto no es ID valido").isMongoId(),
    check('id').custom(existeProducto),
    // check("disponible", "El disponible es obligatorio").not().isEmpty(),
    validarCampos
], obtenerFavoritos)



module.exports = router;