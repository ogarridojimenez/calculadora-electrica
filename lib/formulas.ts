export function calcularOhm(v?: number, i?: number, r?: number) {
  if (v === undefined) return i! * r!;
  if (i === undefined) return v / r!;
  if (r === undefined) return v / i;
}

export function calcularPotencia(v: number, i: number) {
  return v * i;
}

export function calcularEnergia(p: number, t: number) {
  return p * t;
}