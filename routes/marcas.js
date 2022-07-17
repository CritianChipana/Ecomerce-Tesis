const { Router, response, request } = require("express");
const { check } = require("express-validator");
const {
  obtenerMarcas,
  obtenerMarcabyId,
  crearMarca,
  actualizarMarca,
  borrarMarca,
} = require("../controllers/marca");
const {
  existeMarca,
  estadoActivoMarca,
  existeProductoRelacionadoMarca,
} = require("../helpers/db-validators");
const { validarJWT, esAdminRole } = require("../middlewares");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

// Obtener las marcas
router.get("/", obtenerMarcas);

// Obtener las marcas por id
router.get(
  "/:id",
  [
    check("id", "El id de la categoria no es ID valido").isMongoId(),
    check("id").custom(existeMarca),
    validarCampos,
  ],
  obtenerMarcabyId
);

// Crear Marca cualquier usuario - privado - token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearMarca
);

// Actualizar cualquiera uausario - privado - con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El id de la categoria no es ID valido").isMongoId(),
    check("nombre", "Falva el campo nombre ").not().isEmpty(),
    check("id").custom(existeMarca),
    validarCampos,
  ],
  actualizarMarca
);

// Borrar marca cualquiera usuario - privado - con token valido
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id de la categoria no es ID valido").isMongoId(),
    check("id").custom(existeMarca),
    check("id").custom(estadoActivoMarca),
    check("id").custom(existeProductoRelacionadoMarca),
    validarCampos,
  ],
  borrarMarca
);

module.exports = router;
