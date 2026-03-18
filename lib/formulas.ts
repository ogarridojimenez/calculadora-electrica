export function calcularOhm(v?: number, i?: number, r?: number): number {
  const valores = [v, i, r].filter(x => x !== undefined);

  if (valores.length !== 2) {
    throw new Error("Debes proporcionar exactamente 2 valores");
  }

  if (v === undefined) {
    if (i === 0) throw new Error("Corriente no puede ser 0");
    return i! * r!;
  }

  if (i === undefined) {
    if (r === 0) throw new Error("Resistencia no puede ser 0");
    return v / r!;
  }

  if (r === undefined) {
    if (i === 0) throw new Error("Corriente no puede ser 0");
    return v / i;
  }

  throw new Error("Error inesperado");
}