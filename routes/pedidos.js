const { Router } = require('express');
const { check } = require('express-validator');
const { crearPedido, getPedidos, getDetallePedidoById, deletePedido, getPedidosByIdUser, updateStatusPedido, getPedidoById, updatePedido, getPedidoByStatus } = require('../controllers/pedidos');
const { isVaidIdProducto, existePedidoId } = require('../helpers/db-validators');


const { validarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.post('/',
    [
        validarJWT,
        check("nombre", "La nombre es obligatoria").not().isEmpty(),
        check("importe", "El importe es obligatoria").not().isEmpty(),
        check("importe", "El importe es obligatoria").isNumeric(),
        check("fecha", "La fecha es obligatoria").not().isEmpty(),
        check("status", "El status es obligatoria").not().isEmpty(),
        check('productos').custom(isVaidIdProducto),
        // check( "usuario","El id del usuario es obligatoria" ).not().isEmpty(),
        // check( "usuario","El id del usuario no es valido como id de mongoos" ).isMongoId(),
        validarCampos
    ]
    , crearPedido);

router.get('/', [validarJWT,], getPedidos);

router.get('/user',
    [
        validarJWT,
        validarCampos
    ]
    , getPedidosByIdUser);

router.get('/:id',
    [
        check("id", "El id no es valido").isMongoId(),
        check('id').custom(existePedidoId),
        validarCampos
    ]
    , getDetallePedidoById);

router.get('/refresh/:id',
    [
        check("id", "El id no es valido").isMongoId(),
        check('id').custom(existePedidoId),
        validarCampos
    ]
    , getPedidoById);

router.put('/status/:id',
    [
        validarJWT,
        check("id", "El id no es valido").isMongoId(),
        check("status", "El status es obligatoria").not().isEmpty(),
        validarCampos
    ],
    updateStatusPedido);

router.delete('/:id',
    [
        validarJWT,
        check("id", "El id no es valido").isMongoId(),
        check('id').custom(existePedidoId),

        validarCampos
    ]
    , deletePedido);

router.put('/:id',
    [
        validarJWT,
        check("id", "El id no es valido").isMongoId(),
        check("nombre", "El nombre es obligatoria").not().isEmpty(),
        check("importe", "El importe es obligatoria").not().isEmpty(),
        check("importe", "El importe es obligatoria").isNumeric(),
        check("fecha", "La fecha es obligatoria").not().isEmpty(),
        check("status", "El status es obligatoria").not().isEmpty(),
        check('productos').custom(isVaidIdProducto),
        validarCampos
    ]
    , updatePedido);

router.get('/status/carrito',
    [
        validarJWT,
        validarCampos
    ]
    , getPedidoByStatus);



module.exports = router;
