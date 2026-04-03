"use client";

import { useState } from "react";
import { Gauge, Save } from "lucide-react";
import { calcularPotenciaMonofasica, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";
import { useHistory } from "@/components/HistoryProvider";
import { Input } from "@/components/Input";

type CampoACalcular = "voltaje" | "corriente" | "potencia";

interface Errores {
  voltaje?: string;
  corriente?: string;
  potencia?: string;
  fp?: string;
}

export function CalculoPotenciaMonofasica() {
  const [campoCalcular, setCampoCalcular] = useState<CampoACalcular>("potencia");
  const [voltaje, setVoltaje] = useState("");
  const [corriente, setCorriente] = useState("");
  const [potencia, setPotencia] = useState("");
  const [fp, setFp] = useState("0.9");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const { showToast } = useToast();
  const { addToHistory } = useHistory();

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (campoCalcular !== "voltaje" && !voltaje) {
      nuevosErrores.voltaje = "Requerido";
      valido = false;
    } else if (campoCalcular !== "voltaje" && voltaje && (Number(voltaje) <= 0 || isNaN(Number(voltaje)))) {
      nuevosErrores.voltaje = "Debe ser positivo";
      valido = false;
    } else if (campoCalcular !== "voltaje" && voltaje && Number(voltaje) > 1000) {
      nuevosErrores.voltaje = "Máx 1000V";
      valido = false;
    }

    if (campoCalcular !== "corriente" && !corriente) {
      nuevosErrores.corriente = "Requerido";
      valido = false;
    } else if (campoCalcular !== "corriente" && corriente && (Number(corriente) <= 0 || isNaN(Number(corriente)))) {
      nuevosErrores.corriente = "Debe ser positivo";
      valido = false;
    }

    if (campoCalcular !== "potencia" && !potencia) {
      nuevosErrores.potencia = "Requerido";
      valido = false;
    } else if (campoCalcular !== "potencia" && potencia && (Number(potencia) <= 0 || isNaN(Number(potencia)))) {
      nuevosErrores.potencia = "Debe ser positivo";
      valido = false;
    }

    if (fp && (Number(fp) <= 0 || Number(fp) > 1 || isNaN(Number(fp)))) {
      nuevosErrores.fp = "Entre 0 y 1";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const calcular = async () => {
    setResultado(null);
    setIsLoading(true);

    try {
      if (!validarCampos()) {
        return;
      }

      const params = {
        voltaje: campoCalcular === "voltaje" ? undefined : Number(voltaje),
        corriente: campoCalcular === "corriente" ? undefined : Number(corriente),
        potencia: campoCalcular === "potencia" ? undefined : Number(potencia),
        fp: Number(fp),
      };
      const res = calcularPotenciaMonofasica(params);
      setResultado(res);
      showToast("Cálculo realizado exitosamente", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const guardarEnHistorial = () => {
    if (!resultado) return;
    addToHistory({
      nombre: "Potencia Monofásica",
      tipo: "potencia-monofasica",
      inputs: {
        campoCalcular,
        voltaje,
        corriente,
        potencia,
        fp,
      },
      resultado: {
        valor: resultado.valor,
        unidad: resultado.unidad,
        formula: resultado.formula,
      },
    });
    showToast("Cálculo guardado en historial", "success");
  };

  const labels = {
    voltaje: "Voltaje (V)",
    corriente: "Corriente (A)",
    potencia: "Potencia (W)",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <Gauge size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Potencia Monofásica</h2>
          <p className="text-sm text-[var(--text-tertiary)]">P = V × I × cos(φ) · Norma NC 800</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Sistema monofásico:</strong> Común en instalaciones residenciales y comerciales pequeñas.
          El factor de potencia cos(φ) indica el desfase entre tensión y corriente.
        </p>
      </div>

      <div>
        <label className="label">¿Qué valor desea calcular?</label>
        <div className="radio-group">
          {(["voltaje", "corriente", "potencia"] as const).map((campo) => (
            <label key={campo} className={`radio-option ${campoCalcular === campo ? "active" : ""}`}>
              <input
                type="radio"
                name="campoCalcularMono"
                value={campo}
                checked={campoCalcular === campo}
                onChange={() => {
                  setCampoCalcular(campo);
                  setResultado(null);
                  setErrores({});
                }}
                className="sr-only"
              />
              {labels[campo]}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Voltaje (V)"
          type="number"
          step="any"
          value={voltaje}
          onChange={(e) => {
            setVoltaje(e.target.value);
            if (errores.voltaje) setErrores((prev) => ({ ...prev, voltaje: undefined }));
          }}
          disabled={campoCalcular === "voltaje"}
          error={errores.voltaje}
        />
        <Input
          label="Corriente (A)"
          type="number"
          step="any"
          value={corriente}
          onChange={(e) => {
            setCorriente(e.target.value);
            if (errores.corriente) setErrores((prev) => ({ ...prev, corriente: undefined }));
          }}
          disabled={campoCalcular === "corriente"}
          error={errores.corriente}
        />
        <Input
          label="Potencia (W)"
          type="number"
          step="any"
          value={potencia}
          onChange={(e) => {
            setPotencia(e.target.value);
            if (errores.potencia) setErrores((prev) => ({ ...prev, potencia: undefined }));
          }}
          disabled={campoCalcular === "potencia"}
          error={errores.potencia}
        />
        <Input
          label="Factor de Potencia (cos φ)"
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={fp}
          onChange={(e) => {
            setFp(e.target.value);
            if (errores.fp) setErrores((prev) => ({ ...prev, fp: undefined }));
          }}
          error={errores.fp}
        />
      </div>

      <button
        onClick={calcular}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-label={isLoading ? "Calculando potencia monofásica" : "Calcular potencia monofásica"}
        className={`btn btn-primary w-full py-3 transition-all duration-150
          ${isLoading ? "btn-loading" : ""}
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]
        `}
      >
        <Gauge size={18} aria-hidden="true" />
        {isLoading ? "Calculando..." : "Calcular"}
      </button>

      {resultado && (
        <div className="space-y-4">
          <div className="result-success">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-[var(--ground-green)] font-medium">{labels[campoCalcular]}</p>
                <p className="text-3xl font-bold text-[var(--ground-green)] mt-1">
                  {resultado.valor.toFixed(2)}
                  <span className="text-lg ml-1">{resultado.unidad}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--text-tertiary)]">Fórmula</p>
                <p className="text-sm font-mono text-[var(--ground-green)]">{resultado.formula}</p>
              </div>
            </div>
            {resultado.nota && (
              <p className="text-sm text-[var(--ground-green)] mt-3 pt-3 border-t border-[var(--ground-green)]/20">
                {resultado.nota}
              </p>
            )}
          </div>

          <button
            onClick={guardarEnHistorial}
            className="w-full py-2 px-4 rounded-md bg-[var(--ground-green)] text-white hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Save size={16} />
            Guardar en Historial
          </button>
        </div>
      )}
    </div>
  );
}
