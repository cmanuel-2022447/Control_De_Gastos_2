import { Request, Response } from 'express';
import { getAllExpenses, saveExpense } from '../services/expensive.service';

// Obtiene lista completa de gastos registrados.
export const getExpenses = async (req: Request, res: Response) => {
    try {
        const data = await getAllExpenses();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos' });
    }
};

// Crea nuevo registro de gasto
// Valida datos enviados y almacena en base de datos
export const createExpense = async (req: Request, res: Response) => {
    try {
        const newExpense = await saveExpense(req.body);
        res.status(201).json({ message: 'Dato guardado con éxito', data: newExpense });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el dato' });
    }
};