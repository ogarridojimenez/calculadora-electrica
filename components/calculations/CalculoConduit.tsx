"use client";

import { useState } from "react";
import { Hash, Plus, Trash2, Save } from "lucide-react";
import { seleccionarConduit, type CalculoConduitParams, type ConductorInput, type ResultadoCalculo } from "@/lib/formulas";
import { TABLA_TUBERIAS, AREAS_CONDUCTORES_MM2 } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";
import { useHistory } from "@/components/HistoryProvider";

export function CalculoConduit() {
  const [conductores, setConductores] = useState<ConductorInput[]>([
    { seccion: 6, cantidad: 3 }
  ]);
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const secciones = Object.keys(AREAS_CONDUCTORES_MM2).map(Number).sort((a, b) => a - b);

  const agregarConductor = () => {
    setConductores([...conductores, { seccion: 6, cantidad: 1 }]);
  };

  const eliminarConductor = (index: number) => {
    if (conductores.length > 1) {
      setConductores(conductores.filter((_, i) => i !== index));
    }
  };

  const actualizarConductor = (index: number, campo: 'seccion' | 'cantidad', valor: number) => {
    const nuevos = [...conductores];
    nuevos[index][campo] = valor;
    setConductores(nuevos);
  };

  const calcular = async () => {
    setResultado(null);
    setError(null);
    setIsLoading(true);

    try {
      const params: CalculoConduitParams = { conductores };
      const res = seleccionarConduit(params);
      setResultado(res);
      showToast("Selección de conduit completada", "success");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const guardarEnHistorial = () => {
    if (!resultado) return;
    addToHistory({
      nombre: "Selección de Conduit",
      tipo: "conduit",
      inputs: { conductores: JSON.stringify(conductores) },
      resultado: {
        valor: resultado.valor,
        unidad: resultado.unidad,
        formula: resultado.formula,
      },
    });
    showToast("Guardado en historial", "success");
  };

  const getOpcionesConduit = () => {
    let areaTotal = 0;
    for (const c of conductores) {
      const area = AREAS_CONDUCTORES_MM2[c.seccion];
      if (area) areaTotal += area * c.cantidad;
    }
    
    const numTotal = conductores.reduce((sum, c) => sum + c.cantidad, 0);
    let factorLlenado: number;
    if (numTotal === 1) factorLlenado = 0.53;
    else if (numTotal === 2) factorLlenado = 0.31;
    else factorLlenado = 0.40;

    return TABLA_TUBERIAS.map(t => ({
      ...t,
      ocupacion: (areaTotal / t.area_total_mm2) * 100,
      disponible: t.area_total_mm2 * factorLlenado >= areaTotal
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Hash size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Selección de Conduit</h2>
          <p className="text-sm text-[var(--text-tertiary)]">NC 800 / NEC Art. 358</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Selección de conduit:</strong> Calcula el conduit mínimo necesario según el área total de conductores y factores de llenado normativos.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-tertiary)]">
                <th className="pb-2">Sección mm²</th>
                <th className="pb-2">Cantidad</th>
                <th className="pb-2">Área mm²</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c, i) => (
                <tr key={i}>
                  <td className="py-1 pr-2">
                    <select
                      value={c.seccion}
                      onChange={(e) => actualizarConductor(i, 'seccion', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border bg-[var(--control-bg)] border-[var(--border-default)]"
                    >
                      {secciones.map(s => <option key={s} value={s}>{s} mm²</option>)}
                    </select>
                  </td>
                  <td className="py-1 pr-2">
                    <input
                      type="number"
                      value={c.cantidad}
                      onChange={(e) => actualizarConductor(i, 'cantidad', Number(e.target.value))}
                      min={1}
                      className="w-full px-2 py-1 rounded border bg-[var(--control-bg)] border-[var(--border-default)]"
                    />
                  </td>
                  <td className="py-1 pr-2 text-[var(--text-tertiary)]">
                    {(AREAS_CONDUCTORES_MM2[c.seccion] * c.cantidad).toFixed(1)}
                  </td>
                  <td className="py-1">
                    <button
                      onClick={() => eliminarConductor(i)}
                      disabled={conductores.length === 1}
                      className="p-1 rounded hover:bg-[var(--alert-red-subtle)] disabled:opacity-50"
                    >
                      <Trash2 size={16} className="text-[var(--alert-red)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={agregarConductor} className="btn btn-ghost w-full">
          <Plus size={16} />
          Agregar conductor
        </button>

        <button
          onClick={calcular}
          disabled={isLoading}
          className={`btn btn-primary w-full py-3 transition-all duration-150 ${
            isLoading ? "btn-loading" : ""
          } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]`}
        >
          <Hash size={18} />
          {isLoading ? "Calculando..." : "Calcular"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {resultado && (
        <div className="space-y-4">
          <div className="result-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-tertiary)]">Ocupación real</p>
                <p className="text-3xl font-bold text-[var(--ground-green)]">{resultado.valor} {resultado.unidad}</p>
              </div>
              <Hash size={32} className="text-[var(--ground-green)]" />
            </div>
            <p className="text-sm mt-2">{resultado.nota}</p>
          </div>

          <div className="card">
            <p className="text-sm font-medium mb-3">Comparación de conduits</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--text-tertiary)]">
                    <th className="pb-2">Conduit</th>
                    <th className="pb-2">Área mm²</th>
                    <th className="pb-2">Ocupación</th>
                    <th className="pb-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {getOpcionesConduit().map((t, i) => (
                    <tr key={i} className={t.disponible ? 'bg-[var(--ground-green-subtle)]' : ''}>
                      <td className="py-1">{t.nombre}</td>
                      <td className="py-1">{t.area_total_mm2}</td>
                      <td className="py-1">{t.ocupacion.toFixed(1)}%</td>
                      <td className="py-1">
                        {t.disponible ? (
                          <span className="text-[var(--ground-green)] font-medium">✓ Recomendado</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">Excedido</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">Norma: NC 800 / NEC Art. 358</p>

          <button onClick={guardarEnHistorial} className="btn btn-secondary w-full mt-4">
            <Save size={18} />
            Guardar en historial
          </button>
        </div>
      )}
    </div>
  );
}
