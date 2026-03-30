"use client";

import { useState } from "react";
import { Calculator as CalcIcon } from "lucide-react";
import { calcularOhm, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";
import { ResultCard } from "@/components/ResultCard";
import { Input } from "@/components/Input";

type CampoACalcular = "v" | "i" | "r";

interface Errores {
  v?: string;
  i?: string;
  r?: string;
}

export function CalculoOhm() {
  const [campoCalcular, setCampoCalcular] = useState<CampoACalcular>("v");
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const { showToast } = useToast();

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (campoCalcular !== "v" && !v) {
      nuevosErrores.v = "Requerido";
      valido = false;
    } else if (campoCalcular !== "v" && v && (Number(v) <= 0 || isNaN(Number(v)))) {
      nuevosErrores.v = "Debe ser un número positivo";
      valido = false;
    }

    if (campoCalcular !== "i" && !i) {
      nuevosErrores.i = "Requerido";
      valido = false;
    } else if (campoCalcular !== "i" && i && (Number(i) <= 0 || isNaN(Number(i)))) {
      nuevosErrores.i = "Debe ser un número positivo";
      valido = false;
    }

    if (campoCalcular !== "r" && !r) {
      nuevosErrores.r = "Requerido";
      valido = false;
    } else if (campoCalcular !== "r" && r && (Number(r) <= 0 || isNaN(Number(r)))) {
      nuevosErrores.r = "Debe ser un número positivo";
      valido = false;
    }

    if (campoCalcular === "i" && i && Number(i) === 0) {
      nuevosErrores.i = "La corriente no puede ser 0";
      valido = false;
    }

    if (campoCalcular === "r" && r && Number(r) === 0) {
      nuevosErrores.r = "La resistencia no puede ser 0";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const calcular = () => {
    setResultado(null);

    if (!validarCampos()) {
      showToast("Verifique los campos ingresados", "error");
      return;
    }

    try {
      const params = {
        v: campoCalcular === "v" ? undefined : Number(v),
        i: campoCalcular === "i" ? undefined : Number(i),
        r: campoCalcular === "r" ? undefined : Number(r),
      };
      const res = calcularOhm(params);
      setResultado(res);
      showToast("Cálculo realizado con éxito", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const labels = {
    v: "Voltaje (V)",
    i: "Corriente (A)",
    r: "Resistencia (Ω)",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--electric-cyan-subtle)] flex items-center justify-center">
          <CalcIcon size={20} className="text-[var(--electric-cyan)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Ley de Ohm</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo de V, I y R</p>
        </div>
      </div>

      <div className="info-box info-box-cyan">
        <p className="text-sm">
          <strong>Ley de Ohm:</strong> V = I × R. Seleccione qué valor desea calcular y proporcione los otros dos.
        </p>
      </div>

      {/* Selector de campo a calcular */}
      <div>
        <label className="label">¿Qué valor desea calcular?</label>
        <div className="radio-group">
          {(["v", "i", "r"] as const).map((campo) => (
            <label
              key={campo}
              className={`radio-option ${campoCalcular === campo ? "active" : ""}`}
            >
              <input
                type="radio"
                name="campoCalcular"
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

      {/* Campos de entrada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Voltaje (V)"
          type="number"
          step="any"
          value={v}
          onChange={(e) => {
            setV(e.target.value);
            if (errores.v) setErrores((prev) => ({ ...prev, v: undefined }));
          }}
          disabled={campoCalcular === "v"}
          error={errores.v}
        />
        <Input
          label="Corriente (A)"
          type="number"
          step="any"
          value={i}
          onChange={(e) => {
            setI(e.target.value);
            if (errores.i) setErrores((prev) => ({ ...prev, i: undefined }));
          }}
          disabled={campoCalcular === "i"}
          error={errores.i}
        />
        <Input
          label="Resistencia (Ω)"
          type="number"
          step="any"
          value={r}
          onChange={(e) => {
            setR(e.target.value);
            if (errores.r) setErrores((prev) => ({ ...prev, r: undefined }));
          }}
          disabled={campoCalcular === "r"}
          error={errores.r}
        />
      </div>

      {/* Botón de cálculo */}
      <button onClick={calcular} className="btn btn-primary w-full py-3">
        <CalcIcon size={18} />
        Calcular
      </button>

      {/* Resultado */}
      {resultado && (
        <ResultCard
          resultado={resultado}
          titulo="Ley de Ohm"
          tipo="ohm"
          inputs={{ [campoCalcular]: resultado.valor.toString() }}
        />
      )}
    </div>
  );
}
