"use client";

import { Save } from "lucide-react";
import type { ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "./ToastProvider";
import { useHistory } from "./HistoryProvider";

interface ResultCardProps {
  resultado: ResultadoCalculo;
  titulo: string;
  tipo: string;
  inputs?: Record<string, string>;
}

export function ResultCard({ resultado, titulo, tipo, inputs }: ResultCardProps) {
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const guardarEnHistorial = () => {
    addToHistory({
      nombre: titulo,
      tipo,
      inputs: inputs || {},
      resultado: {
        valor: resultado.valor,
        unidad: resultado.unidad,
        formula: resultado.formula,
      },
    });
    showToast("Cálculo guardado en historial", "success");
  };

  const esExitoso = resultado.unidad !== "ERROR";
  const colorClass = esExitoso ? "var(--ground-green)" : "var(--alert-red)";
  const bgClass = esExitoso ? "result-success" : "result-error";

  return (
    <div className={`${bgClass} animate-fade-in`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1">
            Resultado
          </div>
          <div className="text-4xl sm:text-5xl font-bold" style={{ color: colorClass }}>
            {typeof resultado.valor === "number" 
              ? resultado.valor.toLocaleString("es-ES", { 
                  maximumFractionDigits: 4,
                  minimumFractionDigits: resultado.valor % 1 === 0 ? 0 : 2
                })
              : resultado.valor
            }
            <span className="text-xl sm:text-2xl ml-2 opacity-80">{resultado.unidad}</span>
          </div>
        </div>
        
        <div className="sm:text-right sm:border-l sm:border-[var(--border-default)] sm:pl-4">
          <div className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1">
            Fórmula
          </div>
          <div className="font-mono text-sm" style={{ color: colorClass }}>
            {resultado.formula}
          </div>
        </div>
      </div>

      {resultado.nota && (
        <div className="mt-4 pt-4 border-t border-[var(--border-default)] opacity-80">
          <pre className="text-xs whitespace-pre-wrap font-mono text-[var(--text-secondary)]">
            {resultado.nota}
          </pre>
        </div>
      )}

      <button
        onClick={guardarEnHistorial}
        className="w-full mt-4 py-3 px-4 rounded-lg bg-[var(--ground-green)] text-white hover:bg-[#047857] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Save size={16} />
        Guardar en Historial
      </button>
    </div>
  );
}
