"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ingresos_controller_1 = require("../controller/ingresos.controller");
const errorHandles_1 = require("../../../middleware/errorHandles");
const router = (0, express_1.Router)();
// Todas las rutas de ingresos requieren autenticación
router.use(errorHandles_1.authenticateToken);
router.get('/', ingresos_controller_1.getIngresos);
router.post('/', ingresos_controller_1.createIngreso);
router.put('/:id', ingresos_controller_1.updateIngresoController);
router.delete('/:id', ingresos_controller_1.deleteIngresoController);
router.delete('/clear', ingresos_controller_1.clearIngresosController);
exports.default = router;
