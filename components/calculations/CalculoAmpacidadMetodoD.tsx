'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import {
  calcularAmpacidadMetodoD,
  type CalculoAmpacidadMetodoD,
  type ResultadoCalculo
} from '@/lib/formulas';
import { useToast } from '@/components/ToastProvider';
import { Input } from '@/components/Input';
import { ResultCard } from '@/components/ResultCard';

export function CalculoAmpacidadMetodoD() {
  const [seccion, setSeccion] = useState<number>(10);
  const [material, setMaterial] = useState<'Cobre' | 'Aluminio'>('Cobre');
  const [aislamiento, setAislamiento] = useState<
    'Dos_PVC' | 'Tres_PVC' | 'Dos_XLPE' | 'Tres_XLPE'
  >('Tres_PVC');
  const [temperaturaTerreno, setTemperaturaTerreno] = useState<number>(20);
  const [resistividadTermica, setResistividadTermica] = useState<number>(2.5);
  const [numCircuitos, setNumCircuitos] = useState<number>(1);
  
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const secciones = {
    Cobre: [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300],
    Aluminio: [2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300]
  };

  const tiposAislamiento = [
    { value: 'Dos_PVC' as const, label: '2 conductores PVC' },
    { value: 'Tres_PVC' as const, label: '3 conductores PVC' },
    { value: 'Dos_XLPE' as const, label: '2 conductores XLPE' },
    { value: 'Tres_XLPE' as const, label: '3 conductores XLPE' }
  ];

  const tiposResistividad = [
    { value: 0.5, label: 'Suelo muy húmedo (turba, marisma)' },
    { value: 0.7, label: 'Suelo húmedo (arcilla compacta)' },
    { value: 1.0, label: 'Suelo normal húmedo' },
    { value: 1.5, label: 'Suelo seco (arena suelta)' },
    { value: 2.0, label: 'Suelo muy seco' },
    { value: 2.5, label: 'Referencia NC IEC (default)' },
    { value: 3.0, label: 'Suelo extremadamente seco (roca)' }
  ];

  const calcular = async () => {
    setResultado(null);
    setError(null);
    setIsLoading(true);

    try {
      const params: CalculoAmpacidadMetodoD = {
        seccion,
        material,
        aislamiento,
        temperaturaTerreno,
        resistividadTermica,
        numCircuitos
      };
      const res = calcularAmpacidadMetodoD(params);
      setResultado(res);
      showToast('Cálculo completado', 'success');
    } catch (err) {
      const mensaje = (err as Error).message;
      setError(mensaje);
      showToast(mensaje, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={24} className="text-electric-cyan" />
        <div>
          <h1 className="text-2xl font-bold">Ampacidad - Método D</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cables directamente enterrados o en ductos subterráneos
          </p>
        </div>
      </div>

      {/* Sección */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Sección del conductor (mm²)
        </label>
        <select
          value={seccion}
          onChange={(e) => setSeccion(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-ds-surface-raised rounded-lg 
                     bg-white dark:bg-ds-surface dark:text-white focus:outline-none focus:ring-2 
                     focus:ring-electric-cyan transition-colors"
        >
          {secciones[material].map((s) => (
            <option key={s} value={s}>
              {s} mm²
            </option>
          ))}
        </select>
      </div>

      {/* Material */}
      <div>
        <label className="block text-sm font-medium mb-2">Material</label>
        <select
          value={material}
          onChange={(e) => {
            const newMaterial = e.target.value as 'Cobre' | 'Aluminio';
            setMaterial(newMaterial);
            // Ajustar sección si es necesario
            const seccionesDisponibles = secciones[newMaterial];
            if (!seccionesDisponibles.includes(seccion)) {
              setSeccion(seccionesDisponibles[0]);
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-ds-surface-raised rounded-lg 
                     bg-white dark:bg-ds-surface dark:text-white focus:outline-none focus:ring-2 
                     focus:ring-electric-cyan transition-colors"
        >
          <option value="Cobre">Cobre</option>
          <option value="Aluminio">Aluminio</option>
        </select>
      </div>

      {/* Aislamiento */}
      <div>
        <label className="block text-sm font-medium mb-2">Aislamiento</label>
        <select
          value={aislamiento}
          onChange={(e) =>
            setAislamiento(e.target.value as typeof aislamiento)
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-ds-surface-raised rounded-lg 
                     bg-white dark:bg-ds-surface dark:text-white focus:outline-none focus:ring-2 
                     focus:ring-electric-cyan transition-colors"
        >
          {tiposAislamiento.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      {/* Temperatura del terreno */}
      <Input
        label="Temperatura del terreno (°C)"
        type="number"
        value={temperaturaTerreno}
        onChange={(e) => setTemperaturaTerreno(Number(e.target.value))}
        min={10}
        max={50}
        step={1}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Rango: 10-50°C. Default: 20°C (norma cubana para suelo)
      </p>

      {/* Resistividad térmica */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Resistividad térmica del suelo (K·m/W)
        </label>
        <select
          value={resistividadTermica}
          onChange={(e) => setResistividadTermica(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-ds-surface-raised rounded-lg 
                     bg-white dark:bg-ds-surface dark:text-white focus:outline-none focus:ring-2 
                     focus:ring-electric-cyan transition-colors"
        >
          {tiposResistividad.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.value} — {tipo.label}
            </option>
          ))}
        </select>
      </div>

      {/* Número de circuitos */}
      <Input
        label="Nº circuitos enterrados en paralelo"
        type="number"
        value={numCircuitos}
        onChange={(e) => setNumCircuitos(Number(e.target.value))}
        min={1}
        max={6}
        step={1}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Máximo: 6 circuitos. Separación mínima: 0.7m entre circuitos
      </p>

      {/* Botón de cálculo */}
      <button
        onClick={calcular}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 
          ${
            isLoading
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-electric-cyan text-black hover:bg-electric-cyan/90 active:scale-95'
          } ${isLoading ? 'btn-loading' : ''}`}
      >
        {isLoading ? 'Calculando...' : 'Calcular Ampacidad'}
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-700 
                        rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <ResultCard
          resultado={resultado}
          titulo="Ampacidad Método D (Cables Enterrados)"
          tipo="ampacidad-enterrado"
          inputs={{
            seccion: String(seccion),
            material,
            aislamiento,
            temperaturaTerreno: String(temperaturaTerreno),
            resistividadTermica: String(resistividadTermica),
            numCircuitos: String(numCircuitos)
          }}
        />
      )}
    </div>
  );
}
