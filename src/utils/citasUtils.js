/**
 * Utilidades para manejo de fechas y filtros en citas
 * Extracted para mejorar legibilidad y reutilización
 */

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calcula la fecha final de la semana actual
 * Suma 7 días a la fecha actual
 */
export function getWeekEndDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
}

/**
 * Verifica si una cita ha vencido (fecha pasada)
 * @param {string} citaDate - Fecha de la cita (formato ISO)
 * @param {string} todayDate - Fecha actual (formato ISO)
 */
export function isExpiredCita(citaDate, todayDate) {
  return citaDate < todayDate;
}

/**
 * Determina el estado visual de una cita
 * Estados posibles: 'success', 'danger', 'warning', 'default'
 * @param {object} cita - Objeto de cita
 * @param {string} todayDate - Fecha actual
 */
export function getCitaVariant(cita, todayDate) {
  if (cita.estado === 'atendida') return 'success';
  if (isExpiredCita(cita.fecha, todayDate) && cita.estado === 'pendiente') {
    return 'danger';
  }
  if (cita.fecha === todayDate) return 'warning';
  return 'default';
}

/**
 * Obtiene la etiqueta de estado legible para una cita
 * @param {object} cita - Objeto de cita
 * @param {string} todayDate - Fecha actual
 */
export function getCitaStatusLabel(cita, todayDate) {
  if (cita.estado === 'atendida') return 'Atendida';
  if (isExpiredCita(cita.fecha, todayDate)) return 'Vencida';
  if (cita.fecha === todayDate) return 'Hoy';
  return 'Pendiente';
}

/**
 * Filtra citas según los criterios especificados
 * @param {array} citas - Lista de citas a filtrar
 * @param {string} filterType - Tipo de filtro ('todas', 'hoy', 'esta semana', etc)
 * @param {string} todayDate - Fecha actual
 * @param {string} weekEndDate - Fecha fin de semana
 */
export function filterCitas(citas, filterType, todayDate, weekEndDate) {
  let filtered = [...citas].sort((a, b) => a.fecha.localeCompare(b.fecha));

  switch (filterType) {
    case 'hoy':
      return filtered.filter(cita => cita.fecha === todayDate);
    case 'esta semana':
      return filtered.filter(cita => cita.fecha >= todayDate && cita.fecha <= weekEndDate);
    case 'pendiente':
      return filtered.filter(cita => cita.estado === 'pendiente');
    case 'atendida':
      return filtered.filter(cita => cita.estado === 'atendida');
    case 'todas':
    default:
      return filtered;
  }
}

/**
 * Cuenta las citas pendientes para hoy
 * @param {array} citas - Lista de citas
 * @param {string} todayDate - Fecha actual
 */
export function countPendingTodayCitas(citas, todayDate) {
  return citas.filter(cita => cita.fecha === todayDate && cita.estado === 'pendiente').length;
}

/**
 * Cuenta las citas pendientes en total
 * @param {array} citas - Lista de citas
 */
export function countPendingCitas(citas) {
  return citas.filter(cita => cita.estado === 'pendiente').length;
}
