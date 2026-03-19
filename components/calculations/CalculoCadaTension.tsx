"use client";

import { useState } from "react";
import { Cable, AlertTriangle, CheckCircle, Save } from "lucide-react";
import { calcularCadaTension, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";
import { useHistory } from "@/components/HistoryProvider";

interface Errores {
  voltaje?: string;
  corriente?: string;
  longitud?: string;
  seccion?: string;
  fc?: string;
}

const seccionesComerciales = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

export function CalculoCadaTension() {
  const [voltaje, setVoltaje] = useState("220");
  const [corriente, setCorriente] = useState("");
  const [longitud, setLongitud] = useState("");
  const [seccion, setSeccion] = useState("2.5");
  const [material, setMaterial] = useState<"cobre" | "aluminio">("cobre");
  const [fc, setFc] = useState("1");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (!voltaje || Number(voltaje) <= 0 || isNaN(Number(voltaje))) {
      nuevosErrores.voltaje = "Requerido";
      valido = false;
    } else if (Number(voltaje) > 1000) {
      nuevosErrores.voltaje = "Máx 1000V";
      valido = false;
    }

    if (!corriente || Number(corriente) <= 0 || isNaN(Number(corriente))) {
      nuevosErrores.corriente = "Requerido";
      valido = false;
    }

    if (!longitud || Number(longitud) <= 0 || isNaN(Number(longitud))) {
      nuevosErrores.longitud = "Requerido";
      valido = false;
    } else if (Number(longitud) > 500) {
      nuevosErrores.longitud = "Máx 500m";
      valido = false;
    }

    if (!seccion) {
      nuevosErrores.seccion = "Requerido";
      valido = false;
    }

    if (fc && (Number(fc) <= 0 || Number(fc) > 1 || isNaN(Number(fc)))) {
      nuevosErrores.fc = "Entre 0 y 1";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const calcular = () => {
    setResultado(null);

    if (!validarCampos()) {
      return;
    }

    try {
      const params = {
        voltaje: Number(voltaje),
        corriente: Number(corriente),
        longitud: Number(longitud),
        seccion: Number(seccion),
        material,
        fc: Number(fc),
      };
      const res = calcularCadaTension(params);
      setResultado(res);
      showToast("Cálculo realizado exitosamente", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const guardarEnHistorial = () => {
    if (!resultado) return;
    addToHistory({
      nombre: "Caída de Tensión",
      tipo: "cada-tension",
      inputs: {
        voltaje,
        corriente,
        longitud,
        seccion,
        material,
        fc,
      },
      resultado: {
        valor: resultado.valor,
        unidad: resultado.unidad,
        formula: resultado.formula,
      },
    });
    showToast("Cálculo guardado en historial", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Cable size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Caída de Tensión</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Verificación según norma NC 800</p>
        </div>
      </div>

      <div className="info-box info-box-amber">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-2">Límites según NC 800:</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-2 bg-white/50 rounded">
                <p className="font-semibold text-[var(--ground-green)]">≤ 3%</p>
                <p className="text-xs">Iluminación</p>
              </div>
              <div className="p-2 bg-white/50 rounded">
                <p className="font-semibold text-[var(--warning-amber)]">≤ 5%</p>
                <p className="text-xs">Fuerza</p>
              </div>
              <div className="p-2 bg-white/50 rounded">
                <p className="font-semibold text-[var(--warning-amber)]">≤ 5%</p>
                <p className="text-xs">Motores</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Voltaje (V)</label>
          <input
            type="number"
            step="any"
            value={voltaje}
            onChange={(e) => {
              setVoltaje(e.target.value);
              if (errores.voltaje) setErrores((prev) => ({ ...prev, voltaje: undefined }));
            }}
            className={errores.voltaje ? "border-[var(--alert-red)]" : ""}
          />
          {errores.voltaje && <p className="error-text">{errores.voltaje}</p>}
        </div>
        <div>
          <label className="label">Corriente (A)</label>
          <input
            type="number"
            step="any"
            min="0.1"
            value={corriente}
            onChange={(e) => {
              setCorriente(e.target.value);
              if (errores.corriente) setErrores((prev) => ({ ...prev, corriente: undefined }));
            }}
            placeholder="Ej: 10"
            className={errores.corriente ? "border-[var(--alert-red)]" : ""}
          />
          {errores.corriente && <p className="error-text">{errores.corriente}</p>}
        </div>
        <div>
          <label className="label">Longitud del conductor (m)</label>
          <input
            type="number"
            step="any"
            min="1"
            value={longitud}
            onChange={(e) => {
              setLongitud(e.target.value);
              if (errores.longitud) setErrores((prev) => ({ ...prev, longitud: undefined }));
            }}
            placeholder="Ej: 50"
            className={errores.longitud ? "border-[var(--alert-red)]" : ""}
          />
          {errores.longitud && <p className="error-text">{errores.longitud}</p>}
        </div>
        <div>
          <label className="label">Sección del conductor (mm²)</label>
          <select
            value={seccion}
            onChange={(e) => {
              setSeccion(e.target.value);
              if (errores.seccion) setErrores((prev) => ({ ...prev, seccion: undefined }));
            }}
            className={errores.seccion ? "border-[var(--alert-red)]" : ""}
          >
            {seccionesComerciales.map((s) => (
              <option key={s} value={s}>{s} mm²</option>
            ))}
          </select>
          {errores.seccion && <p className="error-text">{errores.seccion}</p>}
        </div>
        <div>
          <label className="label">Material del conductor</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as "cobre" | "aluminio")}
            className="w-full"
          >
            <option value="cobre">Cobre (ρ=0.0178)</option>
            <option value="aluminio">Aluminio (ρ=0.0282)</option>
          </select>
        </div>
        <div>
          <label className="label">Factor de potencia (cos φ)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={fc}
            onChange={(e) => {
              setFc(e.target.value);
              if (errores.fc) setErrores((prev) => ({ ...prev, fc: undefined }));
            }}
            className={errores.fc ? "border-[var(--alert-red)]" : ""}
          />
          {errores.fc && <p className="error-text">{errores.fc}</p>}
        </div>
      </div>

      <button onClick={calcular} className="btn btn-primary w-full py-3">
        <Cable size={18} />
        Calcular Caída de Tensión
      </button>

      {resultado && (
        <div className={resultado.valor <= 3 ? "result-success" : resultado.valor <= 5 ? "result-warning" : "result-error"}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {resultado.valor <= 3 ? (
                <CheckCircle size={24} className="text-[var(--ground-green)]" />
              ) : (
                <AlertTriangle size={24} className={resultado.valor <= 5 ? "text-[var(--warning-amber)]" : "text-[var(--alert-red)]"} />
              )}
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Caída de Tensión</p>
                <p className={`text-3xl font-bold ${
                  resultado.valor <= 3 ? "text-[var(--ground-green)]" : 
                  resultado.valor <= 5 ? "text-[var(--warning-amber)]" : "text-[var(--alert-red)]"
                }`}>
                  {resultado.valor.toFixed(2)}<span className="text-lg ml-1">%</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-tertiary)]">Estado</p>
              <p className={`text-sm font-medium ${
                resultado.valor <= 3 ? "text-[var(--ground-green)]" : 
                resultado.valor <= 5 ? "text-[var(--warning-amber)]" : "text-[var(--alert-red)]"
              }`}>
                {resultado.valor <= 3 ? "Cumple (Iluminación)" : resultado.valor <= 5 ? "Cumple (Fuerza)" : "No cumple"}
              </p>
            </div>
          </div>
          {resultado.nota && (
            <p className={`text-sm mt-3 pt-3 border-t ${
              resultado.valor <= 3 ? "text-[var(--ground-green)] border-[var(--ground-green)]/20" : 
              resultado.valor <= 5 ? "text-[var(--warning-amber)] border-[var(--warning-amber)]/20" : "text-[var(--alert-red)] border-[var(--alert-red)]/20"
            }`}>
              {resultado.nota}
            </p>
          )}
        </div>
      )}

      <button
        onClick={guardarEnHistorial}
        className="w-full py-2 px-4 rounded-md bg-[var(--ground-green)] text-white hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Save size={16} />
        Guardar en Historial
      </button>
    </div>
  );
}
