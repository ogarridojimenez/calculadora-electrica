'use client';

import { useState } from 'react';
import { Lightbulb, Save } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { useHistory } from '@/components/HistoryProvider';
import {
  calcularFlujoLuminoso,
  calcularNumeroLuminarias,
  calcularIndiceLocal,
  getNivelesIluminancia,
  calcularPotenciaInstalada,
} from '@/lib/formulas';

const TIPOS_LOCALES = getNivelesIluminancia();

export function CalculoIluminacion() {
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const [tipoLocal, setTipoLocal] = useState('');
  const [iluminancia, setIluminancia] = useState('');
  const [area, setArea] = useState('');
  const [factorUtilizacion, setFactorUtilizacion] = useState('0.5');
  const [factorMantenimiento, setFactorMantenimiento] = useState('0.8');
  const [flujoLuminaria, setFlujoLuminaria] = useState('');
  const [potenciaLuminaria, setPotenciaLuminaria] = useState('');
  const [largo, setLargo] = useState('');
  const [ancho, setAncho] = useState('');
  const [alturaMontaje, setAlturaMontaje] = useState('');

  const [resultado, setResultado] = useState<{
    flujoTotal: { valor: number; nota: string };
    numeroLuminarias?: { valor: number; nota: string };
    indiceLocal?: { valor: number; nota: string };
    potenciaInstalada?: { valor: number; nota: string };
  } | null>(null);

  const handleTipoLocalChange = (tipo: string) => {
    setTipoLocal(tipo);
    const found = TIPOS_LOCALES.find(t => t.nombre === tipo);
    if (found) {
      setIluminancia(found.iluminanciaRecomendada.toString());
    }
  };

  const handleCalcular = () => {
    try {
      const flujoResult = calcularFlujoLuminoso({
        iluminancia: parseFloat(iluminancia),
        area: parseFloat(area),
        factorUtilizacion: parseFloat(factorUtilizacion),
        factorMantenimiento: parseFloat(factorMantenimiento),
      });

      const res: typeof resultado = {
        flujoTotal: { valor: flujoResult.valor, nota: flujoResult.nota || '' },
      };

      if (flujoLuminaria) {
        const numResult = calcularNumeroLuminarias(flujoResult.valor, parseFloat(flujoLuminaria));
        res.numeroLuminarias = { valor: numResult.valor, nota: numResult.nota || '' };
      }

      if (largo && ancho && alturaMontaje) {
        const kResult = calcularIndiceLocal(parseFloat(largo), parseFloat(ancho), parseFloat(alturaMontaje));
        res.indiceLocal = { valor: kResult.valor, nota: kResult.nota || '' };
      }

      if (res.numeroLuminarias && potenciaLuminaria) {
        const potResult = calcularPotenciaInstalada(res.numeroLuminarias.valor, parseFloat(potenciaLuminaria));
        res.potenciaInstalada = { valor: potResult.valor, nota: potResult.nota || '' };
      }

      setResultado(res);
      showToast('Cálculo de iluminación completado', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error en el cálculo', 'error');
    }
  };

  const handleGuardar = () => {
    if (!resultado) return;

    addToHistory({
      nombre: 'Iluminación - NC 803',
      tipo: 'iluminacion',
      inputs: {
        tipoLocal,
        iluminancia: parseFloat(iluminancia),
        area: parseFloat(area),
        factorUtilizacion: parseFloat(factorUtilizacion),
        factorMantenimiento: parseFloat(factorMantenimiento),
        flujoLuminaria: flujoLuminaria ? parseFloat(flujoLuminaria) : 0,
        potenciaLuminaria: potenciaLuminaria ? parseFloat(potenciaLuminaria) : 0,
      },
      resultado: {
        valor: resultado.flujoTotal.valor,
        unidad: 'lm',
        formula: 'NC 803 Iluminación',
      },
    });

    showToast('Cálculo guardado en el historial', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Iluminación (NC 803)</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de iluminación de interiores</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Tipo de local
          </label>
          <select
            value={tipoLocal}
            onChange={(e) => handleTipoLocalChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          >
            <option value="">Seleccionar tipo...</option>
            {TIPOS_LOCALES.map((t) => (
              <option key={t.nombre} value={t.nombre}>
                {t.nombre} ({t.iluminanciaMinima}-{t.iluminanciaRecomendada} lux)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Iluminancia requerida (lux)
          </label>
          <input
            type="number"
            value={iluminancia}
            onChange={(e) => setIluminancia(e.target.value)}
            placeholder="Ej: 300"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Área del local (m²)
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Ej: 50"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Factor de utilización (η)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={factorUtilizacion}
            onChange={(e) => setFactorUtilizacion(e.target.value)}
            placeholder="0.5"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Factor de mantenimiento (fm)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={factorMantenimiento}
            onChange={(e) => setFactorMantenimiento(e.target.value)}
            placeholder="0.8"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Flujo luminaria (lm) <span className="text-[var(--text-tertiary)]">(opcional)</span>
          </label>
          <input
            type="number"
            value={flujoLuminaria}
            onChange={(e) => setFlujoLuminaria(e.target.value)}
            placeholder="Ej: 4000"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Potencia luminaria (W) <span className="text-[var(--text-tertiary)]">(opcional)</span>
          </label>
          <input
            type="number"
            value={potenciaLuminaria}
            onChange={(e) => setPotenciaLuminaria(e.target.value)}
            placeholder="Ej: 40"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--surface-base)] rounded-lg">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Largo (m)
          </label>
          <input
            type="number"
            value={largo}
            onChange={(e) => setLargo(e.target.value)}
            placeholder="Ej: 10"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Ancho (m)
          </label>
          <input
            type="number"
            value={ancho}
            onChange={(e) => setAncho(e.target.value)}
            placeholder="Ej: 5"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Altura montaje (m)
          </label>
          <input
            type="number"
            value={alturaMontaje}
            onChange={(e) => setAlturaMontaje(e.target.value)}
            placeholder="Ej: 2.5"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCalcular}
          className="flex-1 py-2 px-4 rounded-md bg-[var(--electric-cyan)] text-white hover:bg-[#0e7490] transition-colors font-medium"
        >
          Calcular
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
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Resultados</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Flujo luminoso total:</span>
                <span className="text-xl font-bold text-[var(--electric-cyan)]">
                  {resultado.flujoTotal.valor.toFixed(2)} lm
                </span>
              </div>

              {resultado.numeroLuminarias && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Número de luminarias:</span>
                  <span className="text-xl font-bold text-[var(--ground-green)]">
                    {resultado.numeroLuminarias.valor} uds
                  </span>
                </div>
              )}

              {resultado.indiceLocal && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Índice del local (k):</span>
                  <span className="text-xl font-bold text-[var(--warning-amber)]">
                    {resultado.indiceLocal.valor.toFixed(2)}
                  </span>
                </div>
              )}

              {resultado.potenciaInstalada && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Potencia instalada:</span>
                  <span className="text-xl font-bold text-[var(--electric-cyan)]">
                    {resultado.potenciaInstalada.valor.toFixed(2)} W
                  </span>
                </div>
              )}
            </div>

            <details className="mt-4">
              <summary className="text-sm text-[var(--text-tertiary)] cursor-pointer">
                Ver detalles del cálculo
              </summary>
              <pre className="mt-2 text-xs text-[var(--text-tertiary)] whitespace-pre-wrap bg-[var(--surface-base)] p-3 rounded">
                {resultado.flujoTotal.nota}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
