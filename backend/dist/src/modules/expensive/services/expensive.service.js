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
exports.saveExpense = exports.getAllExpenses = void 0;
// TODO: Implementar conexion a PostgreSQL.
const getAllExpenses = () => __awaiter(void 0, void 0, void 0, function* () {
    // Datos simulados para desarrollo
    return [{ id: 1, description: 'Gasto de ejemplo', amount: 100 }];
});
exports.getAllExpenses = getAllExpenses;
// Guarda nuevo gasto en la base de datos
// Recibe objeto con propiedades del gasto
// TODO: Validar campos obligatorios y guardar en PostgreSQL
const saveExpense = (expenseData) => __awaiter(void 0, void 0, void 0, function* () {
    // Logica a implementar: INSERT INTO gastos VALUES (...)
    return expenseData;
});
exports.saveExpense = saveExpense;
