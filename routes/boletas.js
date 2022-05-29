const { Router } = require( 'express' );
const { check } = require('express-validator');
const { crearBoleta } = require('../controllers/boletas');

const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const router =Router();

router.post('/', 
[
    // validarJWT,
    check('categoria',"El valor de categoria no es ID valido de mongo").isMongoId(),
    // check('categoria').custom( existeCategoria ),
    check( "nombre","El nombre es obligatorio" ).not().isEmpty(),
    check( "precio","El precio es obligatorio" ).not().isEmpty(),
    check( "descripcion","El descripcion es obligatorio" ).not().isEmpty(),
    check( "idProducto","El idProducto es obligatorio" ).not().isEmpty(),
    check( "mac","La mac es obligatorio" ).not().isEmpty(),
    check( "activo","El activo del producto es obligatorio" ).not().isEmpty(),
    // check( "disponible","El disponible es obligatorio" ).not().isEmpty(),
    validarCampos
]
,crearBoleta);

module.exports = router;
