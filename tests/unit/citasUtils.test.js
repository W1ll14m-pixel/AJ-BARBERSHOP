import { describe, it, expect } from 'vitest';
import {
  filterCitas,
  countPendingTodayCitas,
  getCitaVariant,
  getCitaStatusLabel,
} from '../../src/utils/citasUtils';

describe('citasUtils', () => {
  const today = '2026-04-06';
  const weekEnd = '2026-04-13';

  const citas = [
    { id: 1, fecha: '2026-04-06', estado: 'pendiente' },
    { id: 2, fecha: '2026-04-07', estado: 'pendiente' },
    { id: 3, fecha: '2026-04-15', estado: 'pendiente' },
    { id: 4, fecha: '2026-04-05', estado: 'atendida' },
  ];

  it('filtra correctamente las citas pendientes de hoy', () => {
    const result = filterCitas(citas, 'hoy', today, weekEnd);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('cuenta citas pendientes del dia actual', () => {
    const result = countPendingTodayCitas(citas, today);

    expect(result).toBe(1);
  });

  it('asigna variante warning para cita pendiente de hoy', () => {
    const cita = { id: 10, fecha: today, estado: 'pendiente' };

    expect(getCitaVariant(cita, today)).toBe('warning');
  });

  it('asigna etiqueta Vencida para cita pendiente en fecha pasada', () => {
    const cita = { id: 11, fecha: '2026-04-05', estado: 'pendiente' };

    expect(getCitaStatusLabel(cita, today)).toBe('Vencida');
  });
});
