"use client";

import { useState } from "react";
import { Percent, Save } from "lucide-react";
import { calcularCorreccionFactorPotencia, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";
import { useHistory } from "@/components/HistoryProvider";

interface Errores {
  potenciaActiva?: string;
  fpActual?: string;
  fpDeseado?: string;
}

export function CalculoFactorPotencia() {
  const [potenciaActiva, setPotenciaActiva] = useState("");
  const [fpActual, setFpActual] = useState("0.7");
  const [fpDeseado, setFpDeseado] = useState("0.95");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (!potenciaActiva) {
      nuevosErrores.potenciaActiva = "Requerido";
      valido = false;
    } else if (Number(potenciaActiva) <= 0 || isNaN(Number(potenciaActiva))) {
      nuevosErrores.potenciaActiva = "Debe ser positivo";
      valido = false;
    }

    if (!fpActual || Number(fpActual) <= 0 || Number(fpActual) > 1 || isNaN(Number(fpActual))) {
      nuevosErrores.fpActual = "Entre 0 y 1";
      valido = false;
    }

    if (!fpDeseado || Number(fpDeseado) <= 0 || Number(fpDeseado) > 1 || isNaN(Number(fpDeseado))) {
      nuevosErrores.fpDeseado = "Entre 0 y 1";
      valido = false;
    }

    if (fpActual && fpDeseado && Number(fpDeseado) <= Number(fpActual)) {
      nuevosErrores.fpDeseado = "Debe ser mayor que el actual";
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
        potenciaActiva: Number(potenciaActiva),
        fpActual: Number(fpActual),
        fpDeseado: Number(fpDeseado),
        voltaje: 220,
      };
      const res = calcularCorreccionFactorPotencia(params);
      setResultado(res);
      showToast("Cálculo realizado exitosamente", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const guardarEnHistorial = () => {
    if (!resultado) return;
    addToHistory({
      nombre: "Factor de Potencia",
      tipo: "factor-potencia",
      inputs: {
        potenciaActiva,
        fpActual,
        fpDeseado,
      },
      resultado: {
        valor: resultado.valor,
        unidad: resultado.unidad,
        formula: resultado.formula,
      },
    });
    showToast("Cálculo guardado en historial", "success");
  };

  const calcularAngulo = (fp: number) => {
    return (Math.acos(fp) * 180 / Math.PI).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Percent size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Corrección del Factor de Potencia</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de banco de capacitores</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Requisito mínimo:</strong> Según las empresas eléctricas, el factor de potencia debe ser <strong>≥ 0.90</strong>
        </p>
        <p className="text-sm mt-2">
          <strong>Fórmula:</strong> Q_c = P × (tan(φ₁) - tan(φ₂))
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Potencia Activa (kW)</label>
          <input
            type="number"
            step="any"
            min="0.1"
            value={potenciaActiva}
            onChange={(e) => {
              setPotenciaActiva(e.target.value);
              if (errores.potenciaActiva) setErrores((prev) => ({ ...prev, potenciaActiva: undefined }));
            }}
            placeholder="Ej: 100"
            className={errores.potenciaActiva ? "border-[var(--alert-red)]" : ""}
          />
          {errores.potenciaActiva && <p className="error-text">{errores.potenciaActiva}</p>}
        </div>
        <div>
          <label className="label">FP Actual</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={fpActual}
            onChange={(e) => {
              setFpActual(e.target.value);
              if (errores.fpActual) setErrores((prev) => ({ ...prev, fpActual: undefined }));
            }}
            className={errores.fpActual ? "border-[var(--alert-red)]" : ""}
          />
          {errores.fpActual && <p className="error-text">{errores.fpActual}</p>}
          {fpActual && !errores.fpActual && (
            <p className="text-xs text-[var(--text-tertiary)] mt-1">φ = {calcularAngulo(Number(fpActual))}°</p>
          )}
        </div>
        <div>
          <label className="label">FP Deseado</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={fpDeseado}
            onChange={(e) => {
              setFpDeseado(e.target.value);
              if (errores.fpDeseado) setErrores((prev) => ({ ...prev, fpDeseado: undefined }));
            }}
            className={errores.fpDeseado ? "border-[var(--alert-red)]" : ""}
          />
          {errores.fpDeseado && <p className="error-text">{errores.fpDeseado}</p>}
          {fpDeseado && !errores.fpDeseado && (
            <p className="text-xs text-[var(--text-tertiary)] mt-1">φ = {calcularAngulo(Number(fpDeseado))}°</p>
          )}
        </div>
      </div>

      <button onClick={calcular} className="btn btn-primary w-full py-3">
        <Percent size={18} />
        Calcular Banco de Capacitores
      </button>

      {resultado && (
        <div className="result-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--ground-green)] font-medium">Banco de Capacitores</p>
              <p className="text-3xl font-bold text-[var(--ground-green)] mt-1">
                {resultado.valor}
                <span className="text-lg ml-1">{resultado.unidad}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-tertiary)]">Fórmula</p>
              <p className="text-sm font-mono text-[var(--ground-green)]">{resultado.formula}</p>
            </div>
          </div>
          {resultado.nota && (
            <p className="text-sm text-[var(--ground-green)] mt-3 pt-3 border-t border-[var(--ground-green)]/20 whitespace-pre-line">
              {resultado.nota}
            </p>
          )}
        </div>
      )}

      <button
        onClick={guardarEnHistorial}
        className="w-full py-2 px-4 rounded-md bg-[var(--ground-green)] text-white hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Save size={16} />
        Guardar en Historial
      </button>
    </div>
  );
}
