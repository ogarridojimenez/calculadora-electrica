"use client";

import { useState } from "react";
import { Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { calcularCaidaTensionRX, type CalculoCaidaTensionRX, type ResultadoCalculo } from "@/lib/formulas";

export function CalculoCaidaTensionAvanzada() {
  const [seccion, setSeccion] = useState<number>(10);
  const [longitud, setLongitud] = useState<number>(100);
  const [corriente, setCorriente] = useState<number>(30);
  const [voltaje, setVoltaje] = useState<number>(220);
  const [cosPhi, setCosPhi] = useState<number>(0.85);
  const [sistema, setSistema] = useState<'monofasico' | 'trifasico'>('monofasico');
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const secciones = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const voltajes = [127, 220, 380, 440];

  const calcular = () => {
    setResultado(null);
    setError(null);

    try {
      const params: CalculoCaidaTensionRX = {
        seccion,
        longitud,
        corriente,
        voltaje,
        cosPhi,
        sistema
      };
      const res = calcularCaidaTensionRX(params);
      setResultado(res);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getEstado = () => {
    if (!resultado) return null;
    if (resultado.valor <= 3) return { status: 'cumple', icon: <CheckCircle size={16} />, text: '✓ Cumple iluminación y fuerza', color: 'green' };
    if (resultado.valor <= 5) return { status: 'limite', icon: <AlertTriangle size={16} />, text: '⚠️ Solo fuerza motriz', color: 'amber' };
    return { status: 'no_cumple', icon: <XCircle size={16} />, text: '✗ No cumple NC 800', color: 'red' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Activity size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Caída de Tensión Avanzada</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Con resistencia y reactancia</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Cálculo avanzado:</strong> Considera resistencia R y reactancia X del conductor. Más preciso para secciones ≥ 35mm².
        </p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Sección (mm²)</label>
            <select
              value={seccion}
              onChange={(e) => setSeccion(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {secciones.map(s => <option key={s} value={s}>{s} mm²</option>)}
            </select>
          </div>

          <div>
            <label className="label">Longitud (m)</label>
            <input
              type="number"
              value={longitud}
              onChange={(e) => setLongitud(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>

          <div>
            <label className="label">Corriente (A)</label>
            <input
              type="number"
              value={corriente}
              onChange={(e) => setCorriente(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>

          <div>
            <label className="label">Tensión nominal (V)</label>
            <select
              value={voltaje}
              onChange={(e) => setVoltaje(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {voltajes.map(v => <option key={v} value={v}>{v} V</option>)}
            </select>
          </div>

          <div>
            <label className="label">Factor de potencia cos(φ)</label>
            <input
              type="number"
              value={cosPhi}
              onChange={(e) => setCosPhi(Number(e.target.value))}
              min={0.5}
              max={1}
              step={0.05}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>

          <div>
            <label className="label">Sistema</label>
            <div className="radio-group">
              <label className={`radio-option ${sistema === 'monofasico' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="sistema"
                  value="monofasico"
                  checked={sistema === 'monofasico'}
                  onChange={() => setSistema('monofasico')}
                />
                Monofásico
              </label>
              <label className={`radio-option ${sistema === 'trifasico' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="sistema"
                  value="trifasico"
                  checked={sistema === 'trifasico'}
                  onChange={() => setSistema('trifasico')}
                />
                Trifásico
              </label>
            </div>
          </div>
        </div>

        <button onClick={calcular} className="btn btn-primary w-full py-3">
          <Activity size={18} />
          Calcular
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {resultado && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            getEstado()?.color === 'green' ? 'result-success' :
            getEstado()?.color === 'amber' ? 'result-warning' : 'result-error'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Caída de tensión</p>
              {getEstado()?.icon}
            </div>
            <p className="text-3xl font-bold">{resultado.valor} {resultado.unidad}</p>
            <p className="text-sm mt-1">{getEstado()?.text}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">0-3% Iluminación y Fuerza</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium">3-5% Solo Fuerza Motriz</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium">&gt;5% No cumple</span>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">Fórmula: {resultado.formula}</p>
          <p className="text-xs text-[var(--text-muted)]">{resultado.nota}</p>
        </div>
      )}
    </div>
  );
}
