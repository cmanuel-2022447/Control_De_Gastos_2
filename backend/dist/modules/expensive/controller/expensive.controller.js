"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpense = exports.getExpenses = void 0;
const expensive_service_1 = require("../services/expensive.service");
// Obtiene lista completa de gastos registrados.
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, expensive_service_1.getAllExpenses)();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos' });
    }
});
exports.getExpenses = getExpenses;
// Crea nuevo registro de gasto
// Valida datos enviados y almacena en base de datos
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newExpense = yield (0, expensive_service_1.saveExpense)(req.body);
        res.status(201).json({ message: 'Dato guardado con éxito', data: newExpense });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al guardar el dato' });
    }
});
exports.createExpense = createExpense;
