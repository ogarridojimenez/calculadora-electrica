"use client";

import { useState } from "react";
import { Layers, Save } from "lucide-react";
import { calcularSeccionConductor, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";
import { useHistory } from "@/components/HistoryProvider";

interface Errores {
  corriente?: string;
}

export function CalculoSeccionConductor() {
  const [corriente, setCorriente] = useState("");
  const [material, setMaterial] = useState<"cobre" | "aluminio">("cobre");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (!corriente) {
      nuevosErrores.corriente = "Requerido";
      valido = false;
    } else if (Number(corriente) <= 0 || isNaN(Number(corriente))) {
      nuevosErrores.corriente = "Debe ser positivo";
      valido = false;
    } else if (Number(corriente) > 1000) {
      nuevosErrores.corriente = "Máx 1000A";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const calcular = async () => {
    setResultado(null);
    setIsLoading(true);

    try {
      if (!validarCampos()) {
        return;
      }

      const params = {
        corriente: Number(corriente),
        tipoCircuito: "fuerza" as const,
        metodoInstalacion: 1,
        material,
        temperatura: 30,
      };
      const res = calcularSeccionConductor(params);
      setResultado(res);
      showToast("Cálculo realizado exitosamente", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const guardarEnHistorial = () => {
    if (!resultado) return;
    addToHistory({
      nombre: "Sección de Conductor",
      tipo: "seccion-conductor",
      inputs: {
        corriente,
        material,
      },
      resultado: {
        valor: resultado.valor,
        unidad: resultado.unidad,
        formula: resultado.formula,
      },
    });
    showToast("Cálculo guardado en historial", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Layers size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Sección de Conductor</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Dimensionamiento según norma NC 800</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Fórmula:</strong> S = I / K
        </p>
        <div className="mt-2 flex gap-4 text-sm">
          <div className="p-2 bg-white/50 rounded">
            <p className="font-semibold text-[var(--electric-cyan)]">K = 56 A/mm²</p>
            <p className="text-xs">Cobre (30°C)</p>
          </div>
          <div className="p-2 bg-white/50 rounded">
            <p className="font-semibold text-[var(--warning-amber)]">K = 35 A/mm²</p>
            <p className="text-xs">Aluminio (30°C)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Corriente de Diseño (A)</label>
          <input
            type="number"
            step="any"
            min="0.1"
            value={corriente}
            onChange={(e) => {
              setCorriente(e.target.value);
              if (errores.corriente) setErrores((prev) => ({ ...prev, corriente: undefined }));
            }}
            placeholder="Ej: 25"
            className={errores.corriente ? "border-[var(--alert-red)]" : ""}
          />
          {errores.corriente && <p className="error-text">{errores.corriente}</p>}
        </div>
        <div>
          <label className="label">Material del Conductor</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as "cobre" | "aluminio")}
            className="w-full"
          >
            <option value="cobre">Cobre (K=56 A/mm²)</option>
            <option value="aluminio">Aluminio (K=35 A/mm²)</option>
          </select>
        </div>
      </div>

      {corriente && !errores.corriente && (
        <div className="info-box info-box-cyan">
          <p className="text-sm">
            Sección mínima calculada: <strong>{(Number(corriente) / (material === "cobre" ? 56 : 35)).toFixed(2)} mm²</strong>
          </p>
        </div>
      )}

      <button
        onClick={calcular}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-label={isLoading ? "Calculando sección del conductor" : "Calcular sección del conductor"}
        className={`btn btn-primary w-full py-3 transition-all duration-150
          ${isLoading ? "btn-loading" : ""}
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]
        `}
      >
        <Layers size={18} aria-hidden="true" />
        {isLoading ? "Calculando..." : "Calcular Sección"}
      </button>

      {resultado && (
        <div className="result-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--ground-green)] font-medium">Sección Recomendada</p>
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
