const { Router } = require( 'express' );
const { check } = require('express-validator');
const { crearPedido, getPedidos, getDetallePedidoById, deletePedido, getPedidosByIdUser } = require('../controllers/pedidos');
const { isVaidIdProducto, existePedidoId } = require('../helpers/db-validators');


const { validarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.post('/', 
[
    validarJWT,
    check( "nombre","La nombre es obligatoria" ).not().isEmpty(),
    check( "importe","El importe es obligatoria" ).not().isEmpty(),
    check( "importe","El importe es obligatoria" ).isNumeric(),
    check( "fecha","La fecha es obligatoria" ).not().isEmpty(),
    check('productos').custom(isVaidIdProducto),
    check( "bodega","La bodega es obligatoria" ).not().isEmpty(),
    check( "bodega","La bodega no es valido como id de mongoos" ).isMongoId(),
    validarCampos
]
,crearPedido);

router.get('/', [ validarJWT,], getPedidos);

router.get('/user',
[
    validarJWT,
    validarCampos
]
, getPedidosByIdUser);

router.get('/:id',
[
    check("id","El id no es valido").isMongoId(),
    check('id').custom(existePedidoId),
    validarCampos
]
, getDetallePedidoById);

// router.put('/:id',
// [
//     validarJWT,
//     check("id","El id no es valido").isMongoId(),
//     check("email","El email no es valido").isEmail(),
//     check( "nombre","El nombre es obligatorio" ).not().isEmpty(),
//     check( "descripcion","La descripcion es obligatoria" ).not().isEmpty(),
//     check( "nombrePropietario","El nombre del propietario es obligatoria" ).not().isEmpty(),
//     check( "telefono","El telefono es obligarotio" ).not().isEmpty(),
//     check( "latitudDeBodega","La latitud de la bodega es obligatria" ).not().isEmpty(),
//     check( "longitudDeBodega","La longitud de la bodega es obligatria" ).not().isEmpty(),
//     check( "email","El email es obligatorio" ).not().isEmpty(),
//     check( "h_inicio","El horario de inicio de atencion de la bodega es obligatorio" ).not().isEmpty(),
//     check( "h_final","El horario final de atencion de la bodega es obligatorio" ).not().isEmpty(),
//     check( "imagen","La imagen es obligatoria" ).not().isEmpty(),
//     check('id').custom(existeBodegueroConEstadoTrue),
//     validarCampos
// ],
// updateBodega);

router.delete('/:id', 
[
    validarJWT,
    check("id","El id no es valido").isMongoId(),
    check('id').custom(existePedidoId),

    validarCampos
]
, deletePedido);



module.exports = router;
