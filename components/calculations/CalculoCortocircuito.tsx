'use client';

import { useState } from 'react';
import { Zap, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { useHistory } from '@/components/HistoryProvider';
import {
  calcularCortocircuitoTrifasico,
  verificarPoderCorte,
  calcularCortocircuitoMonofasico,
} from '@/lib/formulas';

const PODER_CORTE_STANDARD = [6, 10, 16, 25, 36, 50, 100];

export function CalculoCortocircuito() {
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const [tensionLinea, setTensionLinea] = useState('380');
  const [longitud, setLongitud] = useState('');
  const [seccion, setSeccion] = useState('');
  const [material, setMaterial] = useState<'cobre' | 'aluminio'>('cobre');
  const [tensionFase, setTensionFase] = useState('220');
  const [poderCorte, setPoderCorte] = useState('25');

  const [resultado, setResultado] = useState<{
    trifasico: { valor: number; nota: string };
    monofasico?: { valor: number; nota: string };
    verificacion?: { valor: number; nota: string; esApto: boolean };
  } | null>(null);

  const handleCalcular = () => {
    try {
      const cc3Result = calcularCortocircuitoTrifasico({
        tensionLinea: parseFloat(tensionLinea),
        longitud: parseFloat(longitud),
        seccion: parseFloat(seccion),
        material,
      });

      const cc1Result = calcularCortocircuitoMonofasico({
        tensionLinea: parseFloat(tensionLinea),
        longitud: parseFloat(longitud),
        seccion: parseFloat(seccion),
        material,
        tensionFase: parseFloat(tensionFase),
      });

      const verResult = verificarPoderCorte(cc3Result.valor, parseFloat(poderCorte));

      const res: typeof resultado = {
        trifasico: { valor: cc3Result.valor, nota: cc3Result.nota || '' },
        monofasico: { valor: cc1Result.valor, nota: cc1Result.nota || '' },
        verificacion: { 
          valor: verResult.valor, 
          nota: verResult.nota || '', 
          esApto: verResult.nota?.includes('APTO') ?? false 
        },
      };

      setResultado(res);
      showToast('Cálculo de cortocircuito completado', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error en el cálculo', 'error');
    }
  };

  const handleGuardar = () => {
    if (!resultado) return;

    addToHistory({
      nombre: 'Cortocircuito - NC 801',
      tipo: 'cortocircuito',
      inputs: {
        tensionLinea: parseFloat(tensionLinea),
        longitud: parseFloat(longitud),
        seccion: parseFloat(seccion),
        material,
        poderCorte: parseFloat(poderCorte),
      },
      resultado: {
        valor: resultado.trifasico.valor,
        unidad: 'kA',
        formula: 'NC 801 Cortocircuito',
      },
    });

    showToast('Cálculo guardado en el historial', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--alert-red-subtle)] flex items-center justify-center">
          <Zap className="w-5 h-5 text-[var(--alert-red)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cortocircuito (NC 801)</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de corrientes de cortocircuito</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Tensión de línea (V)
          </label>
          <select
            value={tensionLinea}
            onChange={(e) => setTensionLinea(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          >
            <option value="220">220 V</option>
            <option value="380">380 V</option>
            <option value="440">440 V</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Tensión de fase (V)
          </label>
          <select
            value={tensionFase}
            onChange={(e) => setTensionFase(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          >
            <option value="127">127 V</option>
            <option value="220">220 V</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Longitud del conductor (m)
          </label>
          <input
            type="number"
            value={longitud}
            onChange={(e) => setLongitud(e.target.value)}
            placeholder="Ej: 50"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Sección del conductor (mm²)
          </label>
          <input
            type="number"
            value={seccion}
            onChange={(e) => setSeccion(e.target.value)}
            placeholder="Ej: 10"
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Material del conductor
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as typeof material)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          >
            <option value="cobre">Cobre</option>
            <option value="aluminio">Aluminio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Poder de corte del interruptor (kA)
          </label>
          <select
            value={poderCorte}
            onChange={(e) => setPoderCorte(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--control-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--electric-cyan)]"
          >
            {PODER_CORTE_STANDARD.map(p => (
              <option key={p} value={p}>{p} kA</option>
            ))}
          </select>
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
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Resultados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--surface-base)] rounded-lg p-3">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Icc Trifásico</div>
                <div className="text-2xl font-bold text-[var(--electric-cyan)]">
                  {resultado.trifasico.valor.toFixed(2)} kA
                </div>
              </div>

              <div className="bg-[var(--surface-base)] rounded-lg p-3">
                <div className="text-sm text-[var(--text-tertiary)] mb-1">Icc Monofásico (mín)</div>
                <div className="text-2xl font-bold text-[var(--warning-amber)]">
                  {resultado.monofasico?.valor.toFixed(2)} A
                </div>
              </div>
            </div>

            <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
              resultado.verificacion?.esApto 
                ? 'bg-[var(--ground-green-subtle)] border border-[var(--ground-green)]' 
                : 'bg-[var(--alert-red-subtle)] border border-[var(--alert-red)]'
            }`}>
              {resultado.verificacion?.esApto ? (
                <CheckCircle className="w-6 h-6 text-[var(--ground-green)]" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-[var(--alert-red)]" />
              )}
              <div>
                <div className={`font-semibold ${
                  resultado.verificacion?.esApto ? 'text-[var(--ground-green)]' : 'text-[var(--alert-red)]'
                }`}>
                  {resultado.verificacion?.esApto ? '✓ APTO' : '✗ NO APTO'}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Interruptor de {poderCorte} kA vs Icc de {resultado.trifasico.valor.toFixed(2)} kA
                </div>
              </div>
            </div>

            <details className="mt-4">
              <summary className="text-sm text-[var(--text-tertiary)] cursor-pointer">
                Ver detalles del cálculo
              </summary>
              <pre className="mt-2 text-xs text-[var(--text-tertiary)] whitespace-pre-wrap bg-[var(--surface-base)] p-3 rounded">
                {resultado.trifasico.nota}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
