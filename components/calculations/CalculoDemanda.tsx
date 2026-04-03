'use client';

import { useState } from 'react';
import { Gauge, Save } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { useHistory } from '@/components/HistoryProvider';
import {
  calcularDemandaMaxima,
  calcularCorrienteAcometida,
  calcularDemandaResidencial,
} from '@/lib/formulas';

const TIPOS_CARGA = [
  { tipo: 'Iluminación', factor: 1.0 },
  { tipo: 'Tomas generales', factor: 0.4 },
  { tipo: 'Tomas cocina', factor: 0.6 },
  { tipo: 'Aires acondicionados', factor: 0.8 },
  { tipo: 'Motores', factor: 0.75 },
  { tipo: 'Calentadores', factor: 0.65 },
  { tipo: 'Cocinas eléctricas', factor: 0.6 },
];

export function CalculoDemanda() {
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const [modo, setModo] = useState<'detallado' | 'residencial'>('detallado');
  const [cargas, setCargas] = useState<{ tipo: string; potencia: number }[]>([
    { tipo: 'Iluminación', potencia: 1000 },
  ]);
  const [factorPotencia, setFactorPotencia] = useState('0.9');
  const [sistema, setSistema] = useState<'monofasico' | 'trifasico'>('trifasico');
  const [tension, setTension] = useState('380');
  const [potenciaResidencial, setPotenciaResidencial] = useState('');

  const [resultado, setResultado] = useState<{
    demanda: { valor: number; nota: string };
    acometida?: { valor: number; nota: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const agregarCarga = () => {
    setCargas([...cargas, { tipo: 'Iluminación', potencia: 0 }]);
  };

  const eliminarCarga = (index: number) => {
    setCargas(cargas.filter((_, i) => i !== index));
  };

  const actualizarCarga = (index: number, campo: string, valor: string) => {
    const nuevasCargas = [...cargas];
    if (campo === 'tipo') {
      nuevasCargas[index] = { ...nuevasCargas[index], tipo: valor };
    } else {
      nuevasCargas[index] = { ...nuevasCargas[index], potencia: parseFloat(valor) || 0 };
    }
    setCargas(nuevasCargas);
  };

  const handleCalcular = async () => {
    setIsLoading(true);
    try {
      let res: typeof resultado;

      if (modo === 'residencial') {
        const dResult = calcularDemandaResidencial(parseFloat(potenciaResidencial));
        res = {
          demanda: { valor: dResult.valor / 1000, nota: dResult.nota || '' },
        };
      } else {
        const dmResult = calcularDemandaMaxima({
          cargas,
          factorPotencia: parseFloat(factorPotencia),
          sistema,
          tension: parseFloat(tension),
        });

        res = {
          demanda: { valor: dmResult.valor, nota: dmResult.nota || '' },
        };

        const caResult = calcularCorrienteAcometida(
          dmResult.valor,
          parseFloat(tension),
          parseFloat(factorPotencia),
          sistema
        );
        res.acometida = { valor: caResult.valor, nota: caResult.nota || '' };
      }

      setResultado(res);
      showToast('Cálculo de demanda completado', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error en el cálculo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardar = () => {
    if (!resultado) return;

    addToHistory({
      nombre: 'Demanda Máxima - NC 800',
      tipo: 'demanda',
      inputs: {
        modo,
        numCargas: cargas.length,
        potenciaTotal: cargas.reduce((sum, c) => sum + c.potencia, 0),
        factorPotencia: parseFloat(factorPotencia),
        sistema,
        tension: parseFloat(tension),
      },
      resultado: {
        valor: resultado.demanda.valor,
        unidad: 'kW',
        formula: 'NC 800 Demanda',
      },
    });

    showToast('Cálculo guardado en el historial', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Gauge className="w-5 h-5 text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Demanda Máxima (NC 800)</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de demanda de instalación</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setModo('detallado')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            modo === 'detallado'
              ? 'bg-[var(--electric-cyan)] text-white'
              : 'border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-base)]'
          }`}
        >
          Método Detallado
        </button>
        <button
          onClick={() => setModo('residencial')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            modo === 'residencial'
              ? 'bg-[var(--electric-cyan)] text-white'
              : 'border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-base)]'
          }`}
        >
          Residencial Simplificado
        </button>
      </div>

      {modo === 'detallado' ? (
        <>
          <div className="space-y-3">
            {cargas.map((carga, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-[var(--text-tertiary)] mb-1">Tipo de carga</label>
                  <select
                    value={carga.tipo}
                    onChange={(e) => actualizarCarga(index, 'tipo', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] text-sm"
                  >
                    {TIPOS_CARGA.map(t => (
                      <option key={t.tipo} value={t.tipo}>{t.tipo} (fd={t.factor})</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--text-tertiary)] mb-1">Potencia (W)</label>
                  <input
                    type="number"
                    value={carga.potencia || ''}
                    onChange={(e) => actualizarCarga(index, 'potencia', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] text-sm"
                  />
                </div>
                {cargas.length > 1 && (
                  <button
                    onClick={() => eliminarCarga(index)}
                    className="p-2 text-[var(--alert-red)] hover:bg-[var(--alert-red-subtle)] rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={agregarCarga}
              className="text-sm text-[var(--electric-cyan)] hover:underline"
            >
              + Agregar carga
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Factor de potencia
              </label>
              <input
                type="number"
                step="0.01"
                value={factorPotencia}
                onChange={(e) => setFactorPotencia(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Sistema
              </label>
              <select
                value={sistema}
                onChange={(e) => setSistema(e.target.value as typeof sistema)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)]"
              >
                <option value="monofasico">Monofásico</option>
                <option value="trifasico">Trifásico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Tensión (V)
              </label>
              <select
                value={tension}
                onChange={(e) => setTension(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)]"
              >
                <option value="127">127 V</option>
                <option value="220">220 V</option>
                <option value="380">380 V</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Potencia instalada de la vivienda (W)
          </label>
          <input
            type="number"
            value={potenciaResidencial}
            onChange={(e) => setPotenciaResidencial(e.target.value)}
            placeholder="Ej: 5000"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)]"
          />
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            Método simplificado NC 800: D = 1500 + 0.4 × P_adicional
          </p>
        </div>
      )}

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--surface-base)] rounded-lg p-3">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Demanda máxima</div>
                <div className="text-2xl font-bold text-[var(--electric-cyan)]">
                  {resultado.demanda.valor.toFixed(2)} kW
                </div>
              </div>

              {resultado.acometida && (
                <div className="bg-[var(--surface-base)] rounded-lg p-3">
                  <div className="text-sm text-[var(--text-tertiary)] mb-1">Corriente acometida</div>
                  <div className="text-2xl font-bold text-[var(--ground-green)]">
                    {resultado.acometida.valor.toFixed(2)} A
                  </div>
                </div>
              )}
            </div>

            <details className="mt-4">
              <summary className="text-sm text-[var(--text-tertiary)] cursor-pointer">
                Ver detalles
              </summary>
              <pre className="mt-2 text-xs text-[var(--text-tertiary)] whitespace-pre-wrap bg-[var(--surface-base)] p-3 rounded">
                {resultado.demanda.nota}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
