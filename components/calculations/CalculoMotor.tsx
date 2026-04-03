'use client';

import { useState } from 'react';
import { Zap, Save } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { useHistory } from '@/components/HistoryProvider';
import {
  calcularCorrienteNominalMotor,
  calcularCorrienteArranque,
  calcularProteccionMotor,
  calcularConductorMotor,
  calcularContactor,
} from '@/lib/formulas';

export function CalculoMotor() {
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const [potencia, setPotencia] = useState('');
  const [tension, setTension] = useState('380');
  const [rendimiento, setRendimiento] = useState('0.85');
  const [factorPotencia, setFactorPotencia] = useState('0.85');
  const [tipoArranque, setTipoArranque] = useState<'directo' | 'estrella-triangulo' | 'variador'>('directo');

  const [resultado, setResultado] = useState<{
    corrienteNominal: { valor: number; nota: string };
    corrienteArranque?: { valor: number; nota: string };
    proteccion?: { valor: number; nota: string };
    conductor?: { valor: number; nota: string };
    contactor?: { valor: number; nota: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalcular = async () => {
    setIsLoading(true);
    try {
      const cnResult = calcularCorrienteNominalMotor({
        potencia: parseFloat(potencia),
        tension: parseFloat(tension),
        rendimiento: parseFloat(rendimiento),
        factorPotencia: parseFloat(factorPotencia),
        tipoArranque,
      });

      const res: typeof resultado = {
        corrienteNominal: { valor: cnResult.valor, nota: cnResult.nota || '' },
      };

      const caResult = calcularCorrienteArranque(cnResult.valor, tipoArranque);
      res.corrienteArranque = { valor: caResult.valor, nota: caResult.nota || '' };

      const cpResult = calcularProteccionMotor(cnResult.valor);
      res.proteccion = { valor: cpResult.valor, nota: cpResult.nota || '' };

      const ccResult = calcularConductorMotor(cnResult.valor);
      res.conductor = { valor: ccResult.valor, nota: ccResult.nota || '' };

      const contResult = calcularContactor(cnResult.valor, caResult.valor);
      res.contactor = { valor: contResult.valor, nota: contResult.nota || '' };

      setResultado(res);
      showToast('Cálculo de motor completado', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error en el cálculo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardar = () => {
    if (!resultado) return;

    addToHistory({
      nombre: 'Motor Eléctrico - NC 804',
      tipo: 'motor',
      inputs: {
        potencia: parseFloat(potencia),
        tension: parseFloat(tension),
        rendimiento: parseFloat(rendimiento),
        factorPotencia: parseFloat(factorPotencia),
        tipoArranque,
      },
      resultado: {
        valor: resultado.corrienteNominal.valor,
        unidad: 'A',
        formula: 'NC 804 Motor',
      },
    });

    showToast('Cálculo guardado en el historial', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Zap className="w-5 h-5 text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Motores Eléctricos (NC 804)</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de motores trifásicos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Potencia del motor (kW)
          </label>
          <input
            type="number"
            value={potencia}
            onChange={(e) => setPotencia(e.target.value)}
            placeholder="Ej: 7.5"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Tensión de línea (V)
          </label>
          <select
            value={tension}
            onChange={(e) => setTension(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          >
            <option value="220">220 V</option>
            <option value="380">380 V</option>
            <option value="440">440 V</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Rendimiento (η)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={rendimiento}
            onChange={(e) => setRendimiento(e.target.value)}
            placeholder="0.85"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Factor de potencia (cos φ)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={factorPotencia}
            onChange={(e) => setFactorPotencia(e.target.value)}
            placeholder="0.85"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Tipo de arranque
          </label>
          <select
            value={tipoArranque}
            onChange={(e) => setTipoArranque(e.target.value as typeof tipoArranque)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)] focus:ring-2 focus:ring-[var(--control-focus-ring)]"
          >
            <option value="directo">Directo (DOL) - K_arr = 5-7</option>
            <option value="estrella-triangulo">Estrella-Triángulo - K_arr = 1.8-2.5</option>
            <option value="variador">Variador de frecuencia (VFD) - K_arr = 1.0-1.5</option>
          </select>
        </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--surface-base)] rounded-lg p-3">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Corriente nominal</div>
                <div className="text-2xl font-bold text-[var(--electric-cyan)]">
                  {resultado.corrienteNominal.valor.toFixed(2)} A
                </div>
              </div>

              <div className="bg-[var(--surface-base)] rounded-lg p-3">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Corriente de arranque</div>
                <div className="text-2xl font-bold text-[var(--warning-amber)]">
                  {resultado.corrienteArranque?.valor.toFixed(2)} A
                </div>
              </div>

              <div className="bg-[var(--surface-base)] rounded-lg p-3">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Protección térmica</div>
                <div className="text-2xl font-bold text-[var(--ground-green)]">
                  {resultado.proteccion?.valor} A
                </div>
              </div>

              <div className="bg-[var(--surface-base)] rounded-lg p-3">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Conductor</div>
                <div className="text-2xl font-bold text-[var(--electric-cyan)]">
                  {resultado.conductor?.valor} mm²
                </div>
              </div>

              <div className="bg-[var(--surface-base)] rounded-lg p-3 md:col-span-2">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Contactor</div>
                <div className="text-2xl font-bold text-[var(--ground-green)]">
                  {resultado.contactor?.valor} A ({resultado.contactor?.nota?.includes('AC-4') ? 'AC-4' : 'AC-3'})
                </div>
              </div>
            </div>

            <details className="mt-4">
              <summary className="text-sm text-[var(--text-tertiary)] cursor-pointer">
                Ver detalles del cálculo
              </summary>
              <pre className="mt-2 text-xs text-[var(--text-tertiary)] whitespace-pre-wrap bg-[var(--surface-base)] p-3 rounded">
                {resultado.corrienteNominal.nota}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
