import { Router } from 'express';
import { getIngresos, createIngreso, updateIngresoController, deleteIngresoController, clearIngresosController } from '../controller/ingresos.controller';
import { authenticateToken } from '../../../middleware/errorHandles';

const router = Router();

// Todas las rutas de ingresos requieren autenticación
router.use(authenticateToken);

router.get('/', getIngresos);
router.post('/', createIngreso);
router.put('/:id', updateIngresoController);
router.delete('/:id', deleteIngresoController);
router.delete('/clear', clearIngresosController);

export default router;
