import { Request, Response } from 'express';
import { getAllIngresos, saveIngreso, updateIngreso, deleteIngreso, clearIngresos } from '../services/ingresos.service';

export const getIngresos = async (_req: Request, res: Response) => {
  try {
    const data = await getAllIngresos();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los ingresos' });
  }
};

export const createIngreso = async (req: Request, res: Response) => {
  try {
    const nuevoIngreso = await saveIngreso(req.body);
    return res.status(201).json({ message: 'Ingreso guardado con éxito', data: nuevoIngreso });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === 'INVALID_INCOME_DATA') {
      return res.status(400).json({ message: 'Faltan datos o el monto no es válido' });
    }
    return res.status(500).json({ message: 'Error al guardar el ingreso' });
  }
};

export const updateIngresoController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const ingresoActualizado = await updateIngreso(id, req.body);
    return res.status(200).json({ message: 'Ingreso actualizado', data: ingresoActualizado });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === 'INCOME_NOT_FOUND') {
      return res.status(404).json({ message: 'Ingreso no encontrado' });
    }
    return res.status(500).json({ message: 'Error al actualizar el ingreso' });
  }
};

export const deleteIngresoController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteIngreso(id);
    return res.status(200).json({ message: 'Ingreso eliminado', data: result });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === 'INCOME_NOT_FOUND') {
      return res.status(404).json({ message: 'Ingreso no encontrado' });
    }
    return res.status(500).json({ message: 'Error al eliminar el ingreso' });
  }
};

export const clearIngresosController = async (_req: Request, res: Response) => {
  try {
    const result = await clearIngresos();
    return res.status(200).json({ message: 'Ingresos eliminados al cerrar sesión', data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al limpiar los ingresos' });
  }
};
