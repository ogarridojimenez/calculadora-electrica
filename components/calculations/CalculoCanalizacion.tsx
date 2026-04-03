'use client';

import { useState } from 'react';
import { Cable, Save } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { useHistory } from '@/components/HistoryProvider';
import { calcularOcupacionTubo } from '@/lib/formulas';

const TUBOS = [
  { nombre: 'DN16', diametro: 16, area: 113 },
  { nombre: 'DN20', diametro: 20, area: 201 },
  { nombre: 'DN25', diametro: 25, area: 314 },
  { nombre: 'DN32', diametro: 32, area: 615 },
  { nombre: 'DN40', diametro: 40, area: 962 },
  { nombre: 'DN50', diametro: 50, area: 1590 },
];

const SECCIONES = [1.5, 2.5, 4, 6, 10, 16, 25, 35];

export function CalculoCanalizacion() {
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const [conductores, setConductores] = useState<{ seccion: number; cantidad: number }[]>([
    { seccion: 2.5, cantidad: 3 },
  ]);
  const [tuboSeleccionado, setTuboSeleccionado] = useState('DN25');

  const [resultado, setResultado] = useState<{
    ocupacion: { valor: number; nota: string };
    cumple: boolean;
    tuboRecomendado?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const agregarConductor = () => {
    setConductores([...conductores, { seccion: 2.5, cantidad: 1 }]);
  };

  const eliminarConductor = (index: number) => {
    setConductores(conductores.filter((_, i) => i !== index));
  };

  const actualizarConductor = (index: number, campo: string, valor: string) => {
    const nuevos = [...conductores];
    if (campo === 'seccion') {
      nuevos[index] = { ...nuevos[index], seccion: parseFloat(valor) };
    } else {
      nuevos[index] = { ...nuevos[index], cantidad: parseInt(valor) || 1 };
    }
    setConductores(nuevos);
  };

  const handleCalcular = async () => {
    setIsLoading(true);
    try {
      const tubo = TUBOS.find(t => t.nombre === tuboSeleccionado);
      if (!tubo) throw new Error('Tubo no seleccionado');

      const result = calcularOcupacionTubo({
        conductores,
        diametroTubo: tubo.diametro,
      });

      const cumple = result.nota?.includes('CUMPLE') ?? false;

      let tuboRec = '';
      if (!cumple) {
        for (const t of TUBOS) {
          const test = calcularOcupacionTubo({ conductores, diametroTubo: t.diametro });
          if (test.nota?.includes('CUMPLE')) {
            tuboRec = t.nombre;
            break;
          }
        }
      }

      setResultado({
        ocupacion: { valor: result.valor, nota: result.nota || '' },
        cumple,
        tuboRecomendado: tuboRec,
      });
      showToast('Cálculo de canalización completado', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error en el cálculo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardar = () => {
    if (!resultado) return;

    addToHistory({
      nombre: 'Canalización - NC 800',
      tipo: 'canalizacion',
      inputs: {
        tubo: tuboSeleccionado,
        numConductores: conductores.reduce((sum, c) => sum + c.cantidad, 0),
      },
      resultado: {
        valor: resultado.ocupacion.valor,
        unidad: '%',
        formula: 'NC 800 Canalización',
      },
    });

    showToast('Cálculo guardado en el historial', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Cable className="w-5 h-5 text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Canalizaciones (NC 800)</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de ocupación de tubos</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          Conductores en el tubo
        </label>
        {conductores.map((conductor, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs text-[var(--text-tertiary)] mb-1">Sección (mm²)</label>
              <select
                value={conductor.seccion}
                onChange={(e) => actualizarConductor(index, 'seccion', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] text-sm"
              >
                {SECCIONES.map(s => (
                  <option key={s} value={s}>{s} mm²</option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs text-[var(--text-tertiary)] mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                value={conductor.cantidad}
                onChange={(e) => actualizarConductor(index, 'cantidad', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] text-sm"
              />
            </div>
            {conductores.length > 1 && (
              <button
                onClick={() => eliminarConductor(index)}
                className="p-2 text-[var(--alert-red)] hover:bg-[var(--alert-red-subtle)] rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={agregarConductor}
          className="text-sm text-[var(--electric-cyan)] hover:underline"
        >
          + Agregar conductor
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Diámetro del tubo
        </label>
        <select
          value={tuboSeleccionado}
          onChange={(e) => setTuboSeleccionado(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)]"
        >
          {TUBOS.map(t => (
            <option key={t.nombre} value={t.nombre}>
              {t.nombre} - Ø{t.diametro}mm (Área: {t.area}mm²)
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCalcular}
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-md bg-[var(--electric-cyan)] text-white hover:bg-[#0e7490] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            isLoading ? 'btn-loading' : ''
          } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]`}
        >
          {isLoading ? 'Calculando...' : 'Calcular'}
        </button>
        {resultado && (
          <button
            onClick={handleGuardar}
            className="py-2 px-4 rounded-md border border-[var(--electric-cyan)] text-[var(--electric-cyan)] hover:bg-[var(--electric-cyan-subtle)] transition-colors font-medium flex items-center gap-2"
          >
            <Save size={18} />
            Guardar
          </button>
        )}
      </div>

      {resultado && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Resultados</h3>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--text-secondary)]">Ocupación del tubo:</span>
              <span className={`text-2xl font-bold ${
                resultado.cumple ? 'text-[var(--ground-green)]' : 'text-[var(--alert-red)]'
              }`}>
                {resultado.ocupacion.valor.toFixed(1)}%
              </span>
            </div>

            <div className={`p-4 rounded-lg ${
              resultado.cumple 
                ? 'bg-[var(--ground-green-subtle)] border border-[var(--ground-green)]' 
                : 'bg-[var(--alert-red-subtle)] border border-[var(--alert-red)]'
            }`}>
              <div className={`font-semibold ${resultado.cumple ? 'text-[var(--ground-green)]' : 'text-[var(--alert-red)]'}`}>
                {resultado.cumple ? '✓ CUMPLE' : '✗ NO CUMPLE'}
              </div>
              {!resultado.cumple && resultado.tuboRecomendado && (
                <div className="text-sm text-[var(--text-secondary)] mt-1">
                  Se recomienda usar {resultado.tuboRecomendado}
                </div>
              )}
            </div>

            <details className="mt-4">
              <summary className="text-sm text-[var(--text-tertiary)] cursor-pointer">
                Ver detalles
              </summary>
              <pre className="mt-2 text-xs text-[var(--text-tertiary)] whitespace-pre-wrap bg-[var(--surface-base)] p-3 rounded">
                {resultado.ocupacion.nota}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
