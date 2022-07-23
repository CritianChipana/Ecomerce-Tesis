const { Router, response, request } = require( 'express' );
const { check } = require('express-validator');
const { crearCategoria, obtnerCategoria, obtnerCategorias, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria, estadoActivoCategoria, existeProductoRelacionadoACategoria } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');


const router =Router();

// OBTENER TODAS LAS CATEGORIAS
router.get('/',obtnerCategorias)

router.get('/:id',
[
    check('id',"El id de la categoria no es ID valido").isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
]
, obtnerCategoria )

// Crear Categoria cualquier - privado - token valido
router.post('/', 
[
    validarJWT,
    check( "nombre","El nombre es obligatorio" ).not().isEmpty(),
    validarCampos
]
,crearCategoria);


// actualizar privado cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id',"El id de la categoria no es ID valido").isMongoId(),
    check('nombre',"Falta el campo nombre ").not().isEmpty(),
    check('id').custom( existeCategoria ),
    validarCampos
],actualizarCategoria)


// BORRAR UNA CATEGORIA -ADMI
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id',"El id de la categoria no es ID valido").isMongoId(),
    check('id').custom( existeCategoria ),
    check('id').custom( estadoActivoCategoria ),
    check('id').custom( existeProductoRelacionadoACategoria ),
    validarCampos
], borrarCategoria)




module.exports = router;