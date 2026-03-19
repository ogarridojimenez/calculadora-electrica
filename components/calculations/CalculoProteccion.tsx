"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { calcularProteccionMagnetotermica, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";

interface Errores {
  corriente?: string;
}

export function CalculoProteccion() {
  const [corriente, setCorriente] = useState("");
  const [tipoCarga, setTipoCarga] = useState<"general" | "motores" | "transformador">("general");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const { showToast } = useToast();

  const multiplicadores = {
    general: 1.15,
    motores: 1.25,
    transformador: 1.5,
  };

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (!corriente) {
      nuevosErrores.corriente = "Requerido";
      valido = false;
    } else if (Number(corriente) <= 0 || isNaN(Number(corriente))) {
      nuevosErrores.corriente = "Debe ser positivo";
      valido = false;
    } else if (Number(corriente) > 630) {
      nuevosErrores.corriente = "Máx 630A";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const calcular = () => {
    setResultado(null);

    if (!validarCampos()) {
      return;
    }

    try {
      const params = {
        corriente: Number(corriente),
        tipoCarga,
      };
      const res = calcularProteccionMagnetotermica(params);
      setResultado(res);
      showToast("Cálculo realizado exitosamente", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Shield size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Protección Magnetotérmica</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Dimensionamiento según norma NC 801</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm font-medium mb-2">Multiplicadores de ajuste:</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="p-2 bg-white/50 rounded text-center">
            <p className="font-semibold">×1.15</p>
            <p className="text-xs text-[var(--text-tertiary)]">Circuitos generales</p>
          </div>
          <div className="p-2 bg-white/50 rounded text-center">
            <p className="font-semibold">×1.25</p>
            <p className="text-xs text-[var(--text-tertiary)]">Motores</p>
          </div>
          <div className="p-2 bg-white/50 rounded text-center">
            <p className="font-semibold">×1.50</p>
            <p className="text-xs text-[var(--text-tertiary)]">Transformadores</p>
          </div>
        </div>
        <p className="text-xs mt-2 text-[var(--text-tertiary)]">
          Curva B: protección resistiva · Curva C: protección inductiva
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Corriente de Carga (A)</label>
          <input
            type="number"
            step="any"
            min="0.1"
            value={corriente}
            onChange={(e) => {
              setCorriente(e.target.value);
              if (errores.corriente) setErrores((prev) => ({ ...prev, corriente: undefined }));
            }}
            placeholder="Ej: 16"
            className={errores.corriente ? "border-[var(--alert-red)]" : ""}
          />
          {errores.corriente && <p className="error-text">{errores.corriente}</p>}
        </div>
        <div>
          <label className="label">Tipo de Carga</label>
          <select
            value={tipoCarga}
            onChange={(e) => setTipoCarga(e.target.value as "general" | "motores" | "transformador")}
            className="w-full"
          >
            <option value="general">Circuitos Generales (×1.15)</option>
            <option value="motores">Motores Eléctricos (×1.25)</option>
            <option value="transformador">Transformadores (×1.50)</option>
          </select>
        </div>
      </div>

      {corriente && !errores.corriente && (
        <div className="info-box info-box-cyan">
          <p className="text-sm">
            Corriente ajustada: <strong>{(Number(corriente) * multiplicadores[tipoCarga]).toFixed(2)} A</strong>
          </p>
        </div>
      )}

      <button onClick={calcular} className="btn btn-primary w-full py-3">
        <Shield size={18} />
        Calcular Protección
      </button>

      {resultado && (
        <div className="result-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--ground-green)] font-medium">Interruptor Magnetotérmico</p>
              <p className="text-3xl font-bold text-[var(--ground-green)] mt-1">
                {resultado.valor}
                <span className="text-lg ml-1">{resultado.unidad}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-tertiary)]">Curva</p>
              <p className="text-sm font-medium text-[var(--ground-green)]">
                {tipoCarga === "motores" ? "Curva C" : "Curva B"}
              </p>
            </div>
          </div>
          {resultado.nota && (
            <p className="text-sm text-[var(--ground-green)] mt-3 pt-3 border-t border-[var(--ground-green)]/20 whitespace-pre-line">
              {resultado.nota}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
