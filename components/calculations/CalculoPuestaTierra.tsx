"use client";

import { useState } from "react";
import { Anchor, AlertTriangle, CheckCircle } from "lucide-react";
import { calcularPuestaTierra, calcularResistividadSuelo, type ResultadoCalculo } from "@/lib/formulas";
import { useToast } from "@/components/ToastProvider";

interface Errores {
  resistividadSuelo?: string;
  longitudVarilla?: string;
  diametroVarilla?: string;
  numVarillas?: string;
}

export function CalculoPuestaTierra() {
  const [tipoSuelo, setTipoSuelo] = useState("arcilla");
  const [resistividadSuelo, setResistividadSuelo] = useState("1000");
  const [longitudVarilla, setLongitudVarilla] = useState("2.4");
  const [diametroVarilla, setDiametroVarilla] = useState("16");
  const [numVarillas, setNumVarillas] = useState("1");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const { showToast } = useToast();

  const handleTipoSueloChange = (value: string) => {
    setTipoSuelo(value);
    setResistividadSuelo(String(calcularResistividadSuelo(value)));
  };

  const validarCampos = (): boolean => {
    const nuevosErrores: Errores = {};
    let valido = true;

    if (!resistividadSuelo || Number(resistividadSuelo) <= 0 || isNaN(Number(resistividadSuelo))) {
      nuevosErrores.resistividadSuelo = "Requerido";
      valido = false;
    }

    if (!longitudVarilla || Number(longitudVarilla) <= 0 || isNaN(Number(longitudVarilla))) {
      nuevosErrores.longitudVarilla = "Requerido";
      valido = false;
    } else if (Number(longitudVarilla) > 10) {
      nuevosErrores.longitudVarilla = "Máx 10m";
      valido = false;
    }

    if (!diametroVarilla) {
      nuevosErrores.diametroVarilla = "Requerido";
      valido = false;
    }

    if (!numVarillas || Number(numVarillas) <= 0 || isNaN(Number(numVarillas))) {
      nuevosErrores.numVarillas = "Requerido";
      valido = false;
    } else if (Number(numVarillas) > 20) {
      nuevosErrores.numVarillas = "Máx 20 varillas";
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
        resistividadSuelo: Number(resistividadSuelo),
        longitudVarilla: Number(longitudVarilla),
        diametroVarilla: Number(diametroVarilla),
        numVarillas: Number(numVarillas),
      };
      const res = calcularPuestaTierra(params);
      setResultado(res);
      showToast("Cálculo realizado exitosamente", "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--ground-green-subtle)] flex items-center justify-center">
          <Anchor size={20} className="text-[var(--ground-green)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Puesta a Tierra</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Cálculo según norma NC 802</p>
        </div>
      </div>

      <div className="info-box info-box-amber">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Requisito NC 802</p>
            <p className="text-sm mt-1">
              La resistencia de puesta a tierra debe ser <strong>≤ 25 Ω</strong> para sistemas de baja tensión.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Tipo de Suelo</label>
          <select
            value={tipoSuelo}
            onChange={(e) => handleTipoSueloChange(e.target.value)}
            className="w-full"
          >
            <option value="pantano">Pantano (200 Ω·m)</option>
            <option value="tierra_vegetal">Tierra Vegetal (500 Ω·m)</option>
            <option value="arcilla">Arcilla (1000 Ω·m)</option>
            <option value="arena">Arena (5000 Ω·m)</option>
            <option value="grava">Grava (30000 Ω·m)</option>
            <option value="roca">Roca (100000 Ω·m)</option>
          </select>
        </div>
        <div>
          <label className="label">Resistividad (Ω·m)</label>
          <input
            type="number"
            step="any"
            min="1"
            value={resistividadSuelo}
            onChange={(e) => {
              setResistividadSuelo(e.target.value);
              setTipoSuelo("custom");
              if (errores.resistividadSuelo) setErrores((prev) => ({ ...prev, resistividadSuelo: undefined }));
            }}
            className={errores.resistividadSuelo ? "border-[var(--alert-red)]" : ""}
          />
          {errores.resistividadSuelo && <p className="error-text">{errores.resistividadSuelo}</p>}
        </div>
        <div>
          <label className="label">Longitud Varilla (m)</label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            max="10"
            value={longitudVarilla}
            onChange={(e) => {
              setLongitudVarilla(e.target.value);
              if (errores.longitudVarilla) setErrores((prev) => ({ ...prev, longitudVarilla: undefined }));
            }}
            className={errores.longitudVarilla ? "border-[var(--alert-red)]" : ""}
          />
          {errores.longitudVarilla && <p className="error-text">{errores.longitudVarilla}</p>}
        </div>
        <div>
          <label className="label">Diámetro Varilla (mm)</label>
          <select
            value={diametroVarilla}
            onChange={(e) => {
              setDiametroVarilla(e.target.value);
              if (errores.diametroVarilla) setErrores((prev) => ({ ...prev, diametroVarilla: undefined }));
            }}
            className={errores.diametroVarilla ? "border-[var(--alert-red)]" : ""}
          >
            <option value="12">12 mm (Copperweld)</option>
            <option value="16">16 mm (estándar)</option>
            <option value="20">20 mm (cobre sólido)</option>
          </select>
          {errores.diametroVarilla && <p className="error-text">{errores.diametroVarilla}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="label">Número de Varillas</label>
          <input
            type="number"
            min="1"
            max="20"
            value={numVarillas}
            onChange={(e) => {
              setNumVarillas(e.target.value);
              if (errores.numVarillas) setErrores((prev) => ({ ...prev, numVarillas: undefined }));
            }}
            className={errores.numVarillas ? "border-[var(--alert-red)]" : ""}
          />
          {errores.numVarillas && <p className="error-text">{errores.numVarillas}</p>}
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            Recomendación: espaciado mínimo 2× la longitud de la varilla
          </p>
        </div>
      </div>

      <button onClick={calcular} className="btn btn-primary w-full py-3">
        <Anchor size={18} />
        Calcular Puesta a Tierra
      </button>

      {resultado && (
        <div className={resultado.valor <= 25 ? "result-success" : "result-error"}>
          <div className="flex items-center gap-3">
            {resultado.valor <= 25 ? (
              <CheckCircle size={24} className="text-[var(--ground-green)]" />
            ) : (
              <AlertTriangle size={24} className="text-[var(--alert-red)]" />
            )}
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Resistencia de Puesta a Tierra</p>
              <p className={`text-3xl font-bold ${
                resultado.valor <= 25 ? "text-[var(--ground-green)]" : "text-[var(--alert-red)]"
              }`}>
                {resultado.valor.toFixed(2)}
                <span className="text-lg ml-1">{resultado.unidad}</span>
              </p>
            </div>
          </div>
          {resultado.nota && (
            <p className={`text-sm mt-3 pt-3 border-t ${
              resultado.valor <= 25 ? "text-[var(--ground-green)] border-[var(--ground-green)]/20" : "text-[var(--alert-red)] border-[var(--alert-red)]/20"
            }`}>
              {resultado.nota}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
