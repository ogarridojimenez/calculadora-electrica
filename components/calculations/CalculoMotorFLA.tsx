"use client";

import { useState } from "react";
import { Zap, CheckCircle, Save } from "lucide-react";
import { calcularMotorPorFLA, type CalculoMotorFLA, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";
import { useHistory } from "@/components/HistoryProvider";

export function CalculoMotorFLA() {
  const [hp, setHp] = useState<number>(5);
  const [tension, setTension] = useState<220 | 380 | 440>(380);
  const [tipoArranque, setTipoArranque] = useState<'directo' | 'estrella-triangulo' | 'variador' | 'ITM'>('directo');
  const [metodoInstalacion, setMetodoInstalacion] = useState<'metodo_A1' | 'metodo_B1' | 'metodo_C'>('metodo_B1');
  const [temperaturaAmbiente, setTemperaturaAmbiente] = useState<number>(35);
  const [numCircuitos, setNumCircuitos] = useState<number>(1);
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const hpOptions = [0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30];
  const tensiones: (220 | 380 | 440)[] = [220, 380, 440];
  const metodos = [
    { value: 'metodo_A1', label: 'A1: Tubo empotrado' },
    { value: 'metodo_B1', label: 'B1: Tubo en superficie' },
    { value: 'metodo_C', label: 'C: Sobre bandeja' }
  ];

  const calcular = async () => {
    setResultado(null);
    setError(null);
    setIsLoading(true);

    try {
      const params: CalculoMotorFLA = {
        hp,
        tension,
        tipoArranque,
        metodoInstalacion,
        temperaturaAmbiente,
        numCircuitos
      };
      const res = calcularMotorPorFLA(params);
      setResultado(res);
      showToast("Cálculo de motor por FLA completado", "success");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const guardarEnHistorial = () => {
    if (!resultado) return;
    addToHistory({
      nombre: "Motor por FLA",
      tipo: "motor-fla",
      inputs: { hp, tension, tipoArranque, metodoInstalacion, temperaturaAmbiente, numCircuitos },
      resultado: {
        valor: resultado.valor,
        unidad: resultado.unidad,
        formula: resultado.formula,
      },
    });
    showToast("Guardado en historial", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Zap size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Motor por FLA</h2>
          <p className="text-sm text-[var(--text-tertiary)]"> lookup tabla real</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Cálculo por FLA:</strong> Selecciona conductor, ITM y contactor según tabla real de amperajes del motor (FLA).
        </p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Potencia (HP)</label>
            <select
              value={hp}
              onChange={(e) => setHp(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {hpOptions.map(h => <option key={h} value={h}>{h} HP</option>)}
            </select>
          </div>

          <div>
            <label className="label">Tensión (V)</label>
            <select
              value={tension}
              onChange={(e) => setTension(Number(e.target.value) as 220 | 380 | 440)}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {tensiones.map(t => <option key={t} value={t}>{t} V</option>)}
            </select>
          </div>

          <div>
            <label className="label">Tipo de arranque</label>
            <select
              value={tipoArranque}
              onChange={(e) => setTipoArranque(e.target.value as typeof tipoArranque)}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              <option value="directo">Directo DOL</option>
              <option value="estrella-triangulo">Estrella-Triángulo</option>
              <option value="variador">Variador VFD</option>
              <option value="ITM">ITM</option>
            </select>
          </div>

          <div>
            <label className="label">Método instalación</label>
            <select
              value={metodoInstalacion}
              onChange={(e) => setMetodoInstalacion(e.target.value as typeof metodoInstalacion)}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            >
              {metodos.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Temperatura (°C)</label>
            <input
              type="number"
              value={temperaturaAmbiente}
              onChange={(e) => setTemperaturaAmbiente(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>

          <div>
            <label className="label">Nº circuitos</label>
            <input
              type="number"
              value={numCircuitos}
              onChange={(e) => setNumCircuitos(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 rounded-md border bg-[var(--control-bg)] border-[var(--border-default)]"
            />
          </div>
        </div>

        <button
          onClick={calcular}
          disabled={isLoading}
          className={`btn btn-primary w-full py-3 transition-all duration-150 ${
            isLoading ? "btn-loading" : ""
          } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]`}
        >
          <Zap size={18} />
          {isLoading ? "Calculando..." : "Calcular"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {resultado && (
        <div className="space-y-4">
          <div className="result-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-tertiary)]">FLA (corriente plena carga)</p>
                <p className="text-3xl font-bold text-[var(--ground-green)]">{resultado.valor} {resultado.unidad}</p>
              </div>
              <CheckCircle size={32} className="text-[var(--ground-green)]" />
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-medium mb-2">{resultado.nota}</p>
          </div>

          <p className="text-xs text-[var(--text-muted)]">Norma: NC 804 / NC 800</p>

          <button onClick={guardarEnHistorial} className="btn btn-secondary w-full mt-4">
            <Save size={18} />
            Guardar en historial
          </button>
        </div>
      )}
    </div>
  );
}
