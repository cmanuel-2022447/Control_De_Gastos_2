import { pool } from '../../../config/db';

export interface IngresoDbRow {
  id: number;
  fecha: string;
  descripcion: string;
  lugar: string;
  original: string;
  conversion: string;
}

export const getAllIngresos = async (): Promise<IngresoDbRow[]> => {
  const result = await pool.query(
    `SELECT id, fecha, descripcion, lugar, original, conversion
     FROM public.ingresos
     ORDER BY fecha DESC, id DESC`
  );

  return result.rows.map((row) => ({
    ...row,
    original: String(row.original),
    conversion: String(row.conversion)
  }));
};

export const saveIngreso = async (data: any): Promise<IngresoDbRow> => {
  const fecha = String(data?.fecha || '').trim();
  const descripcion = String(data?.descripcion || '').trim();
  const lugar = String(data?.lugar || '').trim();
  const moneda = String(data?.moneda || 'GTQ').trim().toUpperCase();
  const monto = Number(data?.monto);
  const tasaCambio = Number(data?.tasa_cambio ?? data?.tasaCambio ?? 7.68);

  if (!fecha || !descripcion || !lugar || !Number.isFinite(monto) || monto <= 0) {
    throw new Error('INVALID_INCOME_DATA');
  }

  if (!['GTQ', 'USD'].includes(moneda)) {
    throw new Error('INVALID_INCOME_DATA');
  }

  const original = `${moneda} ${monto.toFixed(2)}`;
  const conversion = `${moneda === 'USD' ? 'GTQ' : 'USD'} ${tasaCambio.toFixed(2)}`;

  const result = await pool.query(
    `INSERT INTO public.ingresos (fecha, descripcion, lugar, original, conversion)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, fecha, descripcion, lugar, original, conversion`,
    [fecha, descripcion, lugar, original, conversion]
  );

  const row = result.rows[0];
  return {
    ...row,
    original: String(row.original),
    conversion: String(row.conversion)
  };
};

export const updateIngreso = async (id: number, data: any): Promise<IngresoDbRow> => {
  const fecha = String(data?.fecha || '').trim();
  const descripcion = String(data?.descripcion || '').trim();
  const lugar = String(data?.lugar || '').trim();
  const moneda = String(data?.moneda || 'GTQ').trim().toUpperCase();
  const monto = Number(data?.monto);
  const tasaCambio = Number(data?.tasa_cambio ?? data?.tasaCambio ?? 7.68);

  if (!fecha || !descripcion || !lugar || !Number.isFinite(monto) || monto <= 0) {
    throw new Error('INVALID_INCOME_DATA');
  }

  const original = `${moneda} ${monto.toFixed(2)}`;
  const conversion = `${moneda === 'USD' ? 'GTQ' : 'USD'} ${tasaCambio.toFixed(2)}`;

  const result = await pool.query(
    `UPDATE public.ingresos
     SET fecha = $1,
         descripcion = $2,
         lugar = $3,
         original = $4,
         conversion = $5
     WHERE id = $6
     RETURNING id, fecha, descripcion, lugar, original, conversion`,
    [fecha, descripcion, lugar, original, conversion, id]
  );

  if (result.rowCount === 0) {
    throw new Error('INCOME_NOT_FOUND');
  }

  const row = result.rows[0];
  return {
    ...row,
    original: String(row.original),
    conversion: String(row.conversion)
  };
};

export const deleteIngreso = async (id: number): Promise<{ id: number }> => {
  const result = await pool.query('DELETE FROM public.ingresos WHERE id = $1 RETURNING id', [id]);

  if (result.rowCount === 0) {
    throw new Error('INCOME_NOT_FOUND');
  }

  return { id: Number(result.rows[0].id) };
};

export const clearIngresos = async (): Promise<{ deleted: number }> => {
  const result = await pool.query('DELETE FROM public.ingresos');
  return { deleted: result.rowCount ?? 0 };
};
