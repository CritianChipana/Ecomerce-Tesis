const { Router } = require( 'express' );
const { check } = require('express-validator');
const { crearbodega } = require('../controllers/bodegas');

const { validarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const router =Router();

router.post('/', 
[
    validarJWT,
    // check('categoria',"El valor de categoria no es ID valido de mongo").isMongoId(),
    check("email","El email no es valido").isEmail(),
    check( "nombre","El nombre es obligatorio" ).not().isEmpty(),
    check( "descripcion","La descripcion es obligatoria" ).not().isEmpty(),
    check( "nombrePropietario","El nombre del propietario es obligatoria" ).not().isEmpty(),
    check( "telefono","El telefono es obligarotio" ).not().isEmpty(),
    check( "ubicacionDeBodega","La ubicacion de la bodega es obligatria" ).not().isEmpty(),
    check( "email","El email es obligatorio" ).not().isEmpty(),
    check( "horarioBodega","El horario de atencion de la bodega es obligatorio" ).not().isEmpty(),
    check( "imagen","La imagen es obligatoria" ).not().isEmpty(),
    validarCampos
]
,crearbodega);

module.exports = router;
