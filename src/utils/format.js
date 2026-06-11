export function formatDate(value) {
  const [year, month, day] = value.split("-");
  const names = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${Number(day)} de ${names[Number(month) - 1]} de ${year}`;
}
