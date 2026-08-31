// TODO: Implementar conexion a PostgreSQL.
export const getAllExpenses = async () => {
    // Datos simulados para desarrollo
    return [{ id: 1, description: 'Gasto de ejemplo', amount: 100 }];
};

// Guarda nuevo gasto en la base de datos
// Recibe objeto con propiedades del gasto
// TODO: Validar campos obligatorios y guardar en PostgreSQL
export const saveExpense = async (expenseData: any) => {
    // Logica a implementar: INSERT INTO gastos VALUES (...)
    return expenseData;
};