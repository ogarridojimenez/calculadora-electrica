export type Material = 'Cu' | 'Al';

export type Sistema = 'monofasico' | 'trifasico';

export type TipoArranque = 'directo' | 'estrella-triangulo' | 'variador';

export type EstadoCumplimiento = 'cumple' | 'limite' | 'no_cumple';

export type TipoLocal = {
  nombre: string;
  iluminanciaMinima: number;
  iluminanciaRecomendada: number;
};

export type ResultadoCalculo = {
  valor: number;
  unidad: string;
  cumpleNorma: EstadoCumplimiento;
  normaReferencia: string;
  recomendacion?: string;
};

export type ResultadoIluminacion = ResultadoCalculo & {
  flujoTotal?: number;
  numeroLuminarias?: number;
};

export type ResultadoMotor = ResultadoCalculo & {
  corrienteNominal?: number;
  corrienteArranque?: number;
  proteccion?: number;
  seccion?: number;
};

export type ResultadoCortocircuito = ResultadoCalculo & {
  iccTrifasico?: number;
  iccMonofasico?: number;
  poderCorte?: number;
  esApto?: boolean;
};

export type ResultadoTierra = ResultadoCalculo & {
  resistencia?: number;
  seccionPE?: number;
  electrodos?: number;
};

export type ResultadoDemanda = ResultadoCalculo & {
  demandaKW?: number;
  demandaKVA?: number;
  corrienteAcometida?: number;
};

export type ResultadoCanalizacion = ResultadoCalculo & {
  ocupacionPorcentaje?: number;
  diametroTubo?: string;
};

export type FactorDemanda = {
  tipo: string;
  factor: number;
};

export type TipoSuelo = {
  clave: string;
  nombre: string;
  resistividadMin: number;
  resistividadMax: number;
};

export const FACTORES_DEMANDA: FactorDemanda[] = [
  { tipo: 'Iluminación', factor: 1.0 },
  { tipo: 'Tomas de corriente generales', factor: 0.4 },
  { tipo: 'Tomas de corriente cocina', factor: 0.6 },
  { tipo: 'Aires acondicionados', factor: 0.8 },
  { tipo: 'Motores', factor: 0.75 },
  { tipo: 'Calentadores de agua', factor: 0.65 },
  { tipo: 'Cocinas eléctricas', factor: 0.6 },
];

export const TIPOS_SUELO: TipoSuelo[] = [
  { clave: 'tierraVegetalHumeda', nombre: 'Tierra vegetal húmeda', resistividadMin: 10, resistividadMax: 50 },
  { clave: 'arcillaHumeda', nombre: 'Arcilla húmeda', resistividadMin: 20, resistividadMax: 100 },
  { clave: 'arenaHumeda', nombre: 'Arena húmeda', resistividadMin: 50, resistividadMax: 200 },
  { clave: 'arenaSeca', nombre: 'Arena seca', resistividadMin: 200, resistividadMax: 1000 },
  { clave: 'roca', nombre: 'Roca', resistividadMin: 1000, resistividadMax: 10000 },
  { clave: 'tierraVegetalSeca', nombre: 'Tierra vegetal seca (Cuba costera)', resistividadMin: 300, resistividadMax: 1000 },
];

export interface Carga {
  nombre: string;
  potencia: number;
  tipo: string;
  cantidad?: number;
}

export interface DatosMotor {
  potencia: number;
  tension: number;
  rendimiento: number;
  factorPotencia: number;
  tipoArranque: TipoArranque;
}

export interface DatosConductor {
  longitud: number;
  seccion: number;
  material: Material;
}

export interface DatosTierra {
  seccionFase: number;
  tipoSuelo: string;
  longitudElectrodo: number;
  numeroElectrodos: number;
}
