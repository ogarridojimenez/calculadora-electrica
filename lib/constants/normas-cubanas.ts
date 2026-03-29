export const NC_800 = {
  CAIDA_TENSION_ILUMINACION_MAX: 0.03,
  CAIDA_TENSION_FUERZA_MAX: 0.05,
  RESISTIVIDAD_CU: 0.01786,
  RESISTIVIDAD_AL: 0.02857,
  TEMPERATURA_REFERENCIA: 30,
  REACTANCIA_BT: 0.08,
  FACTOR_DEMANDA_ILUMINACION: 1.0,
  FACTOR_DEMANDA_TOMAS_GENERALES: 0.4,
  FACTOR_DEMANDA_TOMAS_COCINA: 0.6,
  FACTOR_DEMANDA_AIRES_ACONDICIONADOS: 0.8,
  FACTOR_DEMANDA_MOTORES: 0.75,
  FACTOR_DEMANDA_CALENTADORES: 0.65,
  FACTOR_DEMANDA_COCINAS_ELECTRICAS: 0.6,
  CARGA_BASICA_VIVIENDA: 1500,
  FACTOR_POTENCIA_GLOBAL_MIN: 0.85,
  FACTOR_POTENCIA_GLOBAL_TIPICO: 0.9,
} as const;

export const NC_801 = {
  PROTECCION_TERMICA_FACTOR: 1.25,
  CONDUCTOR_DISENO_FACTOR: 1.25,
  CORTE_MINIMA: 6,
  PODER_CORTE_STANDARD: [6, 10, 16, 25, 36, 50, 100] as const,
  FACTOR_REDUCCION_CORTO: 0.8,
} as const;

export const NC_802 = {
  RESISTENCIA_TIERRA_MAX: 25,
  PROTECCION_TERMICA_MOTOR_FACTOR: 1.15,
  CONDUCTOR_PE_S_FASE_MAX: 16,
  CONDUCTOR_PE_S_FASE_MID: 35,
  ELECTRODO_VERTICAL_LONGITUD: 2.4,
  ELECTRODO_DIAMETRO: 0.016,
  EFICIENCIA_ELECTRODOS_SEPARACION_L: 0.85,
  EFICIENCIA_ELECTRODOS_SEPARACION_MENOR_L: 0.7,
} as const;

export const NC_803 = {
  TIPOS_LOCALES: [
    { nombre: 'Dormitorio residencial', iluminanciaMinima: 50, iluminanciaRecomendada: 100 },
    { nombre: 'Sala-comedor residencial', iluminanciaMinima: 100, iluminanciaRecomendada: 200 },
    { nombre: 'Cocina residencial', iluminanciaMinima: 150, iluminanciaRecomendada: 300 },
    { nombre: 'Oficinas y despachos', iluminanciaMinima: 300, iluminanciaRecomendada: 500 },
    { nombre: 'Pasillos y escaleras', iluminanciaMinima: 50, iluminanciaRecomendada: 100 },
    { nombre: 'Talleres de trabajo fino', iluminanciaMinima: 500, iluminanciaRecomendada: 750 },
    { nombre: 'Talleres de trabajo ordinario', iluminanciaMinima: 200, iluminanciaRecomendada: 300 },
    { nombre: 'Almacenes', iluminanciaMinima: 100, iluminanciaRecomendada: 200 },
    { nombre: 'Consultorios médicos', iluminanciaMinima: 300, iluminanciaRecomendada: 500 },
    { nombre: 'Aulas escolares', iluminanciaMinima: 300, iluminanciaRecomendada: 500 },
  ] as const,
} as const;

export const NC_804 = {
  FACTOR_ARRANQUE_DIRECTO: [5, 7] as [number, number],
  FACTOR_ARRANQUE_ESTRELLA_TRIANGULO: [1.8, 2.5] as [number, number],
  FACTOR_ARRANQUE_VARIADOR: [1.0, 1.5] as [number, number],
  SERVICIO_CONTINUO_FACTOR: 1.25,
} as const;

export const SECCIONES_NORMALIZADAS_CU = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240] as const;

export const SECCIONES_NORMALIZADAS_AL = [16, 25, 35, 50, 70, 95, 120, 150, 185, 240] as const;

export const CAPACIDAD_CONDUCTORES_CU_30C = {
  1.5: 15,
  2.5: 21,
  4: 27,
  6: 34,
  10: 46,
  16: 62,
  25: 80,
  35: 99,
  50: 118,
  70: 150,
  95: 181,
  120: 210,
} as const;

export const TUBOS_STANDARD = {
  DN16: { areaInterior: 113, diametro: 16 },
  DN20: { areaInterior: 201, diametro: 20 },
  DN25: { areaInterior: 314, diametro: 25 },
  DN32: { areaInterior: 615, diametro: 32 },
  DN40: { areaInterior: 962, diametro: 40 },
  DN50: { areaInterior: 1590, diametro: 50 },
} as const;

export const DIAMETROS_EXTERIORES = {
  1.5: 6.1,
  2.5: 7.1,
  4: 8.3,
  6: 9.3,
  10: 11.5,
  16: 13.6,
  25: 16.8,
  35: 19.0,
} as const;

export const FACTORES_TEMPERATURA = {
  20: 1.12,
  25: 1.06,
  30: 1.00,
  35: 0.94,
  40: 0.87,
  45: 0.79,
  50: 0.71,
} as const;

export const FACTORES_GRUPALES = {
  1: 0.8,
  2: 0.7,
  3: 0.65,
  '4-5': 0.57,
} as const;

export const RESISTIVIDAD_SUELOS = {
  tierraVegetalHumeda: { min: 10, max: 50, nombre: 'Tierra vegetal húmeda' },
  arcillaHumeda: { min: 20, max: 100, nombre: 'Arcilla húmeda' },
  arenaHumeda: { min: 50, max: 200, nombre: 'Arena húmeda' },
  arenaSeca: { min: 200, max: 1000, nombre: 'Arena seca' },
  roca: { min: 1000, max: 10000, nombre: 'Roca' },
  tierraVegetalSeca: { min: 300, max: 1000, nombre: 'Tierra vegetal seca (Cuba costera)' },
} as const;
