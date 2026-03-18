"use client";
import { useState } from "react";
import { calcularOhm } from "../lib/formulas";

export default function Calculator() {
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [tipo, setTipo] = useState<string>("");
  const [error, setError] = useState<string>("");

  const calcular = () => {
    try {
      setError("");

      const voltaje = v ? Number(v) : undefined;
      const corriente = i ? Number(i) : undefined;
      const resistencia = r ? Number(r) : undefined;

      const res = calcularOhm(voltaje, corriente, resistencia);

      // Detectar qué se calculó
      if (v === "") setTipo("Voltaje (V)");
      else if (i === "") setTipo("Corriente (I)");
      else if (r === "") setTipo("Resistencia (R)");

      setResultado(res ?? null);
    } catch (err) {
      setResultado(null);
      setTipo("");
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h2>Calculadora Ley de Ohm</h2>

      <input placeholder="Voltaje (V)" onChange={(e) => setV(e.target.value)} />
      <input placeholder="Corriente (I)" onChange={(e) => setI(e.target.value)} />
      <input placeholder="Resistencia (R)" onChange={(e) => setR(e.target.value)} />

      <button onClick={calcular}>Calcular</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultado !== null && (
        <p>
          {tipo}: {resultado}
        </p>
      )}
    </div>
  );
}