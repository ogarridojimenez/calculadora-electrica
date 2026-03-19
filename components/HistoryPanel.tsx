'use client';

import { X, Trash2, Download, Clock, Calculator } from 'lucide-react';
import { useHistory, type HistoryItem } from './HistoryProvider';

export function HistoryPanel() {
  const { history, removeFromHistory, clearHistory, isPanelOpen, setPanelOpen } = useHistory();

  const formatInputs = (inputs: Record<string, string | number>, tipo: string) => {
    const entries = Object.entries(inputs);
    return entries
      .filter(([key]) => key !== 'tipo')
      .map(([key, value]) => {
        const labels: Record<string, string> = {
          v: 'Voltaje',
          i: 'Corriente',
          r: 'Resistencia',
          potencia: 'Potencia',
          fp: 'Factor de Potencia',
          longitud: 'Longitud',
          seccion: 'Sección',
          calibre: 'Calibre',
          intensidad: 'Intensidad',
        };
        return `${labels[key] || key}: ${value}`;
      })
      .join(' | ');
  };

  const exportToPDF = async () => {
    const { exportHistoryToPDF } = await import('@/lib/pdfExport');
    exportHistoryToPDF(history);
  };

  if (!isPanelOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setPanelOpen(false)}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--surface-raised)] border-l border-[var(--border-default)] z-50 flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[var(--electric-cyan)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">Historial</h2>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-base)] px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={exportToPDF}
                className="p-2 rounded-md hover:bg-[var(--surface-base)] text-[var(--electric-cyan)] transition-colors"
                title="Exportar a PDF"
              >
                <Download size={18} />
              </button>
            )}
            <button
              onClick={() => setPanelOpen(false)}
              className="p-2 rounded-md hover:bg-[var(--surface-base)] text-[var(--text-tertiary)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Calculator size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-tertiary)]">No hay cálculos guardados</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Presiona &quot;Guardar&quot; en un resultado para añadirlo al historial
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--surface-base)] rounded-lg p-4 border border-[var(--border-default)]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">{item.fecha}</span>
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-xs text-[var(--text-muted)]">{item.hora}</span>
                    </div>
                    <button
                      onClick={() => removeFromHistory(item.id)}
                      className="p-1 rounded hover:bg-[var(--alert-red-subtle)] text-[var(--text-muted)] hover:text-[var(--alert-red)] transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">{item.nombre}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">
                    {formatInputs(item.inputs, item.tipo)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[var(--ground-green)]">
                      {item.resultado.valor.toFixed(4)}
                    </span>
                    <span className="text-sm text-[var(--text-tertiary)]">{item.resultado.unidad}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-[var(--border-default)]">
            <button
              onClick={clearHistory}
              className="w-full py-2 px-4 rounded-md bg-[var(--alert-red-subtle)] text-[var(--alert-red)] hover:bg-[var(--alert-red)] hover:text-white transition-colors text-sm font-medium"
            >
              Limpiar Historial
            </button>
          </div>
        )}
      </div>
    </>
  );
}
