"use client";

import { useState } from "react";
import { Gauge } from "lucide-react";
import { calcularPotenciaMonofasica, type ResultadoCalculo } from "@/lib/formulas";

type CampoACalcular = "voltaje" | "corriente" | "potencia";

interface Errores {
  voltaje?: string;
  corriente?: string;
  potencia?: string;
  fp?: string;
}

export function CalculoPotenciaMonofasica() {
  const [campoCalcular, setCampoCalcular] = useState<CampoACalcular>("potencia");
  const [voltaje, setVoltaje] = useState("");
  const [corriente, setCorriente] = useState("");
  const [potencia, setPotencia] = useState("");
  const [fp, setFp] = useState("0.9");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (campoCalcular !== "voltaje" && !voltaje) {
      nuevosErrores.voltaje = "Requerido";
      valido = false;
    } else if (campoCalcular !== "voltaje" && voltaje && (Number(voltaje) <= 0 || isNaN(Number(voltaje)))) {
      nuevosErrores.voltaje = "Debe ser positivo";
      valido = false;
    } else if (campoCalcular !== "voltaje" && voltaje && Number(voltaje) > 1000) {
      nuevosErrores.voltaje = "Máx 1000V";
      valido = false;
    }

    if (campoCalcular !== "corriente" && !corriente) {
      nuevosErrores.corriente = "Requerido";
      valido = false;
    } else if (campoCalcular !== "corriente" && corriente && (Number(corriente) <= 0 || isNaN(Number(corriente)))) {
      nuevosErrores.corriente = "Debe ser positivo";
      valido = false;
    }

    if (campoCalcular !== "potencia" && !potencia) {
      nuevosErrores.potencia = "Requerido";
      valido = false;
    } else if (campoCalcular !== "potencia" && potencia && (Number(potencia) <= 0 || isNaN(Number(potencia)))) {
      nuevosErrores.potencia = "Debe ser positivo";
      valido = false;
    }

    if (fp && (Number(fp) <= 0 || Number(fp) > 1 || isNaN(Number(fp)))) {
      nuevosErrores.fp = "Entre 0 y 1";
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
        voltaje: campoCalcular === "voltaje" ? undefined : Number(voltaje),
        corriente: campoCalcular === "corriente" ? undefined : Number(corriente),
        potencia: campoCalcular === "potencia" ? undefined : Number(potencia),
        fp: Number(fp),
      };
      const res = calcularPotenciaMonofasica(params);
      setResultado(res);
    } catch (err) {
      setErrorGeneral((err as Error).message);
    }
  };

  const labels = {
    voltaje: "Voltaje (V)",
    corriente: "Corriente (A)",
    potencia: "Potencia (W)",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Gauge size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Potencia Monofásica</h2>
          <p className="text-sm text-[var(--text-tertiary)]">P = V × I × cos(φ) · Norma NC 800</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Sistema monofásico:</strong> Común en instalaciones residenciales y comerciales pequeñas.
          El factor de potencia cos(φ) indica el desfase entre tensión y corriente.
        </p>
      </div>

      <div>
        <label className="label">¿Qué valor desea calcular?</label>
        <div className="radio-group">
          {(["voltaje", "corriente", "potencia"] as const).map((campo) => (
            <label key={campo} className={`radio-option ${campoCalcular === campo ? "active" : ""}`}>
              <input
                type="radio"
                name="campoCalcularMono"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Voltaje (V)</label>
          <input
            type="number"
            step="any"
            value={voltaje}
            onChange={(e) => {
              setVoltaje(e.target.value);
              if (errores.voltaje) setErrores((prev) => ({ ...prev, voltaje: undefined }));
            }}
            disabled={campoCalcular === "voltaje"}
            placeholder={campoCalcular === "voltaje" ? "Resultado" : "220"}
            className={errores.voltaje ? "border-[var(--alert-red)]" : ""}
          />
          {errores.voltaje && <p className="error-text">{errores.voltaje}</p>}
        </div>
        <div>
          <label className="label">Corriente (A)</label>
          <input
            type="number"
            step="any"
            value={corriente}
            onChange={(e) => {
              setCorriente(e.target.value);
              if (errores.corriente) setErrores((prev) => ({ ...prev, corriente: undefined }));
            }}
            disabled={campoCalcular === "corriente"}
            placeholder={campoCalcular === "corriente" ? "Resultado" : "0.00"}
            className={errores.corriente ? "border-[var(--alert-red)]" : ""}
          />
          {errores.corriente && <p className="error-text">{errores.corriente}</p>}
        </div>
        <div>
          <label className="label">Potencia (W)</label>
          <input
            type="number"
            step="any"
            value={potencia}
            onChange={(e) => {
              setPotencia(e.target.value);
              if (errores.potencia) setErrores((prev) => ({ ...prev, potencia: undefined }));
            }}
            disabled={campoCalcular === "potencia"}
            placeholder={campoCalcular === "potencia" ? "Resultado" : "0.00"}
            className={errores.potencia ? "border-[var(--alert-red)]" : ""}
          />
          {errores.potencia && <p className="error-text">{errores.potencia}</p>}
        </div>
        <div>
          <label className="label">Factor de Potencia (cos φ)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={fp}
            onChange={(e) => {
              setFp(e.target.value);
              if (errores.fp) setErrores((prev) => ({ ...prev, fp: undefined }));
            }}
            className={errores.fp ? "border-[var(--alert-red)]" : ""}
          />
          {errores.fp && <p className="error-text">{errores.fp}</p>}
        </div>
      </div>

      <button onClick={calcular} className="btn btn-primary w-full py-3">
        <Gauge size={18} />
        Calcular
      </button>

      {errorGeneral && (
        <div className="result-error">
          <p className="text-sm text-[var(--alert-red)]">{errorGeneral}</p>
        </div>
      )}

      {resultado && (
        <div className="result-success">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-[var(--ground-green)] font-medium">{labels[campoCalcular]}</p>
              <p className="text-3xl font-bold text-[var(--ground-green)] mt-1">
                {resultado.valor.toFixed(2)}
                <span className="text-lg ml-1">{resultado.unidad}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-tertiary)]">Fórmula</p>
              <p className="text-sm font-mono text-[var(--ground-green)]">{resultado.formula}</p>
            </div>
          </div>
          {resultado.nota && (
            <p className="text-sm text-[var(--ground-green)] mt-3 pt-3 border-t border-[var(--ground-green)]/20">
              {resultado.nota}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
