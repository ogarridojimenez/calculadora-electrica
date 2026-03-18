"use client";
import { useState } from "react";
import { calcularOhm, calcularPotencia } from "../lib/formulas";

export default function Calculator() {
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const res = calcularOhm(
      v ? Number(v) : undefined,
      i ? Number(i) : undefined,
      r ? Number(r) : undefined
    );
    setResultado(res ?? null);
  };

  return (
    <div>
      <h2>Calculadora Ley de Ohm</h2>
      <input placeholder="Voltaje (V)" onChange={(e) => setV(e.target.value)} />
      <input placeholder="Corriente (I)" onChange={(e) => setI(e.target.value)} />
      <input placeholder="Resistencia (R)" onChange={(e) => setR(e.target.value)} />
      <button onClick={calcular}>Calcular</button>

      {resultado && <p>Resultado: {resultado}</p>}
    </div>
  );
}