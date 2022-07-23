const { Router } = require("express");
const { getPayment, createPayment } = require("../controllers/payment");
const { validarCampos, validarJWT } = require("../middlewares");
const router = Router();
// Obtener las marcas por id
router.get("/", [validarJWT, validarCampos], getPayment);

// Crear Marca cualquier usuario - privado - token valido
router.post(
  "/",
  [
    // validarJWT,
    validarCampos,
  ],
  createPayment
);

module.exports = router;
