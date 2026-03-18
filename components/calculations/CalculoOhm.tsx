"use client";

import { useState } from "react";
import { Calculator as CalcIcon } from "lucide-react";
import { calcularOhm, type ResultadoCalculo } from "@/lib/formulas";

type CampoACalcular = "v" | "i" | "r";

interface Errores {
  v?: string;
  i?: string;
  r?: string;
}

export function CalculoOhm() {
  const [campoCalcular, setCampoCalcular] = useState<CampoACalcular>("v");
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (campoCalcular !== "v" && !v) {
      nuevosErrores.v = "Requerido";
      valido = false;
    } else if (campoCalcular !== "v" && v && (Number(v) <= 0 || isNaN(Number(v)))) {
      nuevosErrores.v = "Debe ser un número positivo";
      valido = false;
    }

    if (campoCalcular !== "i" && !i) {
      nuevosErrores.i = "Requerido";
      valido = false;
    } else if (campoCalcular !== "i" && i && (Number(i) <= 0 || isNaN(Number(i)))) {
      nuevosErrores.i = "Debe ser un número positivo";
      valido = false;
    }

    if (campoCalcular !== "r" && !r) {
      nuevosErrores.r = "Requerido";
      valido = false;
    } else if (campoCalcular !== "r" && r && (Number(r) <= 0 || isNaN(Number(r)))) {
      nuevosErrores.r = "Debe ser un número positivo";
      valido = false;
    }

    if (campoCalcular === "i" && i && Number(i) === 0) {
      nuevosErrores.i = "La corriente no puede ser 0";
      valido = false;
    }

    if (campoCalcular === "r" && r && Number(r) === 0) {
      nuevosErrores.r = "La resistencia no puede ser 0";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const calcular = () => {
    setErrorGeneral("");
    setResultado(null);

    if (!validarCampos()) {
      return;
    }

    try {
      const params = {
        v: campoCalcular === "v" ? undefined : Number(v),
        i: campoCalcular === "i" ? undefined : Number(i),
        r: campoCalcular === "r" ? undefined : Number(r),
      };
      const res = calcularOhm(params);
      setResultado(res);
    } catch (err) {
      setErrorGeneral((err as Error).message);
    }
  };

  const labels = {
    v: "Voltaje (V)",
    i: "Corriente (A)",
    r: "Resistencia (Ω)",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <CalcIcon size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Ley de Ohm</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de V, I y R</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Ley de Ohm:</strong> V = I × R. Seleccione qué valor desea calcular y proporcione los otros dos.
        </p>
      </div>

      {/* Selector de campo a calcular */}
      <div>
        <label className="label">¿Qué valor desea calcular?</label>
        <div className="radio-group">
          {(["v", "i", "r"] as const).map((campo) => (
            <label
              key={campo}
              className={`radio-option ${campoCalcular === campo ? "active" : ""}`}
            >
              <input
                type="radio"
                name="campoCalcular"
                value={campo}
                checked={campoCalcular === campo}
                onChange={() => {
                  setCampoCalcular(campo);
                  setResultado(null);
                  setErrores({});
                  setErrorGeneral("");
                }}
                className="sr-only"
              />
              {labels[campo]}
            </label>
          ))}
        </div>
      </div>

      {/* Campos de entrada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["v", "i", "r"] as const).map((campo) => (
          <div key={campo}>
            <label className="label">{labels[campo]}</label>
            <input
              type="number"
              step="any"
              value={campo === "v" ? v : campo === "i" ? i : r}
              onChange={(e) => {
                if (campo === "v") setV(e.target.value);
                else if (campo === "i") setI(e.target.value);
                else setR(e.target.value);
                if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }));
              }}
              disabled={campoCalcular === campo}
              placeholder={campoCalcular === campo ? "Resultado" : "0.00"}
              className={`w-full ${
                errores[campo] ? "border-[var(--alert-red)]" : ""
              }`}
            />
            {errores[campo] && <p className="error-text">{errores[campo]}</p>}
          </div>
        ))}
      </div>

      {/* Botón de cálculo */}
      <button onClick={calcular} className="btn btn-primary w-full py-3">
        <CalcIcon size={18} />
        Calcular
      </button>

      {/* Error general */}
      {errorGeneral && (
        <div className="result-error">
          <p className="text-sm text-[var(--alert-red)]">{errorGeneral}</p>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="result-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--ground-green)] font-medium">
                {labels[campoCalcular]}
              </p>
              <p className="text-3xl font-bold text-[var(--ground-green)] mt-1">
                {resultado.valor.toFixed(4)}
                <span className="text-lg ml-1">{resultado.unidad}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-tertiary)]">Fórmula</p>
              <p className="text-sm font-mono text-[var(--ground-green)]">{resultado.formula}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
