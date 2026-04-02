"use client";

import { useState } from "react";
import { Zap, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { calcularAmpacidadCorregida, type CalculoAmpacidad, type ResultadoCalculo } from "@/lib/formulas";

export function CalculoAmpacidad() {
  const [seccion, setSeccion] = useState<number>(6);
  const [material, setMaterial] = useState<'Cobre' | 'Aluminio'>('Cobre');
  const [metodo, setMetodo] = useState<'metodo_A1' | 'metodo_B1' | 'metodo_C'>('metodo_A1');
  const [aislamiento, setAislamiento] = useState<'Dos_PVC' | 'Tres_PVC' | 'Dos_XLPE' | 'Tres_XLPE'>('Tres_PVC');
  const [temperaturaAmbiente, setTemperaturaAmbiente] = useState<number>(35);
  const [numCircuitos, setNumCircuitos] = useState<number>(1);
  const [disposicion, setDisposicion] = useState<string>('Empotrados o encerrados');
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [corrienteDiseño, setCorrienteDiseño] = useState<string>("");

  const secciones = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const metodos = [
    { value: 'metodo_A1', label: 'A1: Cable unipolar en tubo empotrado en pared' },
    { value: 'metodo_B1', label: 'B1: Cable unipolar en tubo en superficie o bandeja' },
    { value: 'metodo_C', label: 'C: Cable multiconductor sobre pared o bandeja' }
  ];
  const aislamientos = [
    { value: 'Dos_PVC', label: '2 conductores PVC (monofásico)' },
    { value: 'Tres_PVC', label: '3 conductores PVC (trifásico)' },
    { value: 'Dos_XLPE', label: '2 conductores XLPE (monofásico)' },
    { value: 'Tres_XLPE', label: '3 conductores XLPE (trifásico)' }
  ];
  const disposiciones = [
    'Empotrados o encerrados',
    'Sobre bandeja no perforada',
    'Sobre bandeja perforada',
    'En tubería en superficie'
  ];

  const calcular = () => {
    setResultado(null);
    setError(null);

    try {
      const params: CalculoAmpacidad = {
        seccion,
        material,
        metodo,
        aislamiento,
        temperaturaAmbiente,
        numCircuitos,
        disposicion
      };
      const res = calcularAmpacidadCorregida(params);
      setResultado(res);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const verificarCumplimiento = () => {
    if (!resultado || !corrienteDiseño) return null;
    const Id = parseFloat(corrienteDiseño);
    if (isNaN(Id)) return null;
    
    if (Id <= resultado.valor * 0.8) {
      return { status: 'cumple', icon: <CheckCircle size={16} />, text: 'Cumple (Id ≤ 80% Iz)' };
    } else if (Id <= resultado.valor) {
      return { status: 'limite', icon: <AlertTriangle size={16} />, text: 'Límite (80% < Id ≤ Iz)' };
    } else {
      return { status: 'no_cumple', icon: <XCircle size={16} />, text: 'No cumple (Id > Iz)' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Zap size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Ampacidad Corregida</h2>
          <p className="text-sm text-[var(--text-tertiary)]">NC IEC 60364-5-52</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Cálculo de ampacidad:</strong> Iz = Ia × Ft × Fg. Considera temperatura ambiente y agrupamiento de circuitos según normativa cubana.
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
            <label className="label">Material</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as 'Cobre' | 'Aluminio')}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              <option value="Cobre">Cobre</option>
              <option value="Aluminio">Aluminio</option>
            </select>
          </div>

          <div>
            <label className="label">Método de instalación</label>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value as typeof metodo)}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {metodos.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Tipo de aislamiento</label>
            <select
              value={aislamiento}
              onChange={(e) => setAislamiento(e.target.value as typeof aislamiento)}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {aislamientos.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Temperatura ambiente (°C)</label>
            <input
              type="number"
              value={temperaturaAmbiente}
              onChange={(e) => setTemperaturaAmbiente(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>

          <div>
            <label className="label">Nº circuitos agrupados</label>
            <input
              type="number"
              value={numCircuitos}
              onChange={(e) => setNumCircuitos(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Disposición de cables</label>
            <select
              value={disposicion}
              onChange={(e) => setDisposicion(e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {disposiciones.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="label">Corriente de diseño Id (A) - opcional</label>
            <input
              type="number"
              value={corrienteDiseño}
              onChange={(e) => setCorrienteDiseño(e.target.value)}
              placeholder="Ingrese corriente de diseño para verificar"
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>
        </div>

        <button onClick={calcular} className="btn btn-primary w-full py-3">
          <Zap size={18} />
          Calcular
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {resultado && (
        <div className="result-success">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--text-tertiary)]">Ampacidad corregida Iz</p>
              <p className="text-3xl font-bold text-[var(--ground-green)]">{resultado.valor} {resultado.unidad}</p>
            </div>
            <Zap size={32} className="text-[var(--ground-green)]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{resultado.nota}</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Fórmula: {resultado.formula}</p>
          
          {verificarCumplimiento() && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              verificarCumplimiento()!.status === 'cumple' ? 'bg-[var(--ground-green-subtle)]' :
              verificarCumplimiento()!.status === 'limite' ? 'bg-[var(--warning-amber-subtle)]' :
              'bg-[var(--alert-red-subtle)]'
            }`}>
              {verificarCumplimiento()!.icon}
              <span className={`text-sm font-medium ${
                verificarCumplimiento()!.status === 'cumple' ? 'text-[var(--ground-green)]' :
                verificarCumplimiento()!.status === 'limite' ? 'text-[var(--warning-amber)]' :
                'text-[var(--alert-red)]'
              }`}>
                {verificarCumplimiento()!.text}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
