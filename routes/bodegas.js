const { Router } = require('express');
const { check } = require('express-validator');

const { crearbodega,
    getBodegas,
    getBodegaById,
    updateBodega,
    deleteBodega,
    obtenerProductoByIdBodega } = require('../controllers/bodegas');
const { existeBodegueroConEstadoTrue, existeBodegaConestadoTrue } = require('../helpers/db-validators');

const { validarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.post('/',
    [
        validarJWT,
        // check('categoria',"El valor de categoria no es ID valido de mongo").isMongoId(),
        check("email", "El email no es valido").isEmail(),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
        check("nombrePropietario", "El nombre del propietario es obligatoria").not().isEmpty(),
        check("telefono", "El telefono es obligarotio").not().isEmpty(),
        check("latitudDeBodega", "La latitud de la bodega es obligatria").not().isEmpty(),
        check("longitudDeBodega", "La longitud de la bodega es obligatria").not().isEmpty(),
        check("direccion", "La direccion de la bodega es obligatria").not().isEmpty(),
        check("email", "El email es obligatorio").not().isEmpty(),
        check("h_inicio", "El horario de inicio de atencion de la bodega es obligatorio").not().isEmpty(),
        check("h_final", "El horario final de atencion de la bodega es obligatorio").not().isEmpty(),
        check("imagen", "La imagen es obligatoria").not().isEmpty(),
        validarCampos
    ]
    , crearbodega);

router.get('/', getBodegas);

router.get('/:id',
    [
        check("id", "El id no es valido").isMongoId(),
        check('id').custom(existeBodegueroConEstadoTrue),
        validarCampos
    ]
    , getBodegaById);

router.put('/:id',
    [
        validarJWT,
        check("id", "El id no es valido").isMongoId(),
        check("email", "El email no es valido").isEmail(),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
        check("nombrePropietario", "El nombre del propietario es obligatoria").not().isEmpty(),
        check("telefono", "El telefono es obligarotio").not().isEmpty(),
        check("latitudDeBodega", "La latitud de la bodega es obligatria").not().isEmpty(),
        check("longitudDeBodega", "La longitud de la bodega es obligatria").not().isEmpty(),
        check("email", "El email es obligatorio").not().isEmpty(),
        check("h_inicio", "El horario de inicio de atencion de la bodega es obligatorio").not().isEmpty(),
        check("h_final", "El horario final de atencion de la bodega es obligatorio").not().isEmpty(),
        check("imagen", "La imagen es obligatoria").not().isEmpty(),
        check("direccion", "La direccion de la bodega es obligatria").not().isEmpty(),
        check('id').custom(existeBodegueroConEstadoTrue),
        validarCampos
    ],
    updateBodega);

router.delete('/:id',
    [
        validarJWT,
        check("id", "El id no es valido").isMongoId(),
        check('id').custom(existeBodegueroConEstadoTrue),

        validarCampos
    ]
    , deleteBodega);

// Obtener los productos por id del bodeguero
router.get('/productos/:id',
    [
        check('id', "El id del bodeguero no es ID valido").isMongoId(),
        check('id').custom(existeBodegaConestadoTrue),
        validarCampos
    ]
    , obtenerProductoByIdBodega)

module.exports = router;
