export interface ResultadoCalculo {
  valor: number;
  unidad: string;
  formula: string;
  nota?: string;
}

export interface CalculoOhm {
  v?: number;
  i?: number;
  r?: number;
}

export interface CalculoPotenciaMonofasica {
  voltaje?: number;
  corriente?: number;
  potencia?: number;
  fp?: number;
}

export interface CalculoPotenciaTrifasica {
  voltajeLinea?: number;
  corriente?: number;
  potencia?: number;
  fp?: number;
}

export interface CalculoCadaTension {
  voltaje: number;
  corriente: number;
  longitud: number;
  seccion: number;
  material: "cobre" | "aluminio";
  fc: number;
}

export interface CalculoConductor {
  corriente: number;
  tipoCircuito: "iluminacion" | "fuerza" | "motores";
  metodoInstalacion: number;
  material: "cobre" | "aluminio";
  temperatura: number;
}

export interface CalculoProteccion {
  corriente: number;
  tipoCarga: "general" | "motores" | "transformador";
}

export interface CalculoPuestaTierra {
  resistividadSuelo: number;
  longitudVarilla: number;
  diametroVarilla: number;
  numVarillas: number;
}

export interface CalculoFactorPotencia {
  potenciaActiva: number;
  fpActual: number;
  fpDeseado: number;
  voltaje: number;
}

export function calcularOhm(params: CalculoOhm): ResultadoCalculo {
  const { v, i, r } = params;
  const valores = [v, i, r].filter((x) => x !== undefined);

  if (valores.length !== 2) {
    throw new Error("Debes proporcionar exactamente 2 valores");
  }

  if (v === undefined) {
    if (i === 0) throw new Error("La corriente no puede ser 0");
    return {
      valor: i! * r!,
      unidad: "V",
      formula: "V = I × R",
    };
  }

  if (i === undefined) {
    if (r === 0) throw new Error("La resistencia no puede ser 0");
    return {
      valor: v / r!,
      unidad: "A",
      formula: "I = V / R",
    };
  }

  if (r === undefined) {
    if (i === 0) throw new Error("La corriente no puede ser 0");
    return {
      valor: v / i,
      unidad: "Ω",
      formula: "R = V / I",
    };
  }

  throw new Error("Error inesperado");
}

export function calcularPotenciaMonofasica(params: CalculoPotenciaMonofasica): ResultadoCalculo {
  const { voltaje, corriente, potencia, fp = 1 } = params;
  const valores = [voltaje, corriente, potencia].filter((x) => x !== undefined);

  if (valores.length !== 2) {
    throw new Error("Debes proporcionar exactamente 2 valores");
  }

  if (potencia === undefined) {
    const p = voltaje! * corriente! * fp;
    return {
      valor: p,
      unidad: "W",
      formula: "P = V × I × cos(φ)",
      nota: `Potencia aparente: ${(voltaje! * corriente!).toFixed(2)} VA`,
    };
  }

  if (corriente === undefined) {
    const i = potencia / (voltaje! * fp);
    return {
      valor: i,
      unidad: "A",
      formula: "I = P / (V × cos(φ))",
    };
  }

  if (voltaje === undefined) {
    const v = potencia / (corriente! * fp);
    return {
      valor: v,
      unidad: "V",
      formula: "V = P / (I × cos(φ))",
    };
  }

  throw new Error("Error inesperado");
}

export function calcularPotenciaTrifasica(params: CalculoPotenciaTrifasica): ResultadoCalculo {
  const { voltajeLinea, corriente, potencia, fp = 1 } = params;
  const valores = [voltajeLinea, corriente, potencia].filter((x) => x !== undefined);

  if (valores.length !== 2) {
    throw new Error("Debes proporcionar exactamente 2 valores");
  }

  const sqrt3 = Math.sqrt(3);

  if (potencia === undefined) {
    const p = sqrt3 * voltajeLinea! * corriente! * fp;
    return {
      valor: p,
      unidad: "W",
      formula: "P = √3 × V_L × I × cos(φ)",
      nota: `Potencia aparente: ${(sqrt3 * voltajeLinea! * corriente!).toFixed(2)} VA`,
    };
  }

  if (corriente === undefined) {
    const i = potencia / (sqrt3 * voltajeLinea! * fp);
    return {
      valor: i,
      unidad: "A",
      formula: "I = P / (√3 × V_L × cos(φ))",
    };
  }

  if (voltajeLinea === undefined) {
    const v = potencia / (sqrt3 * corriente! * fp);
    return {
      valor: v,
      unidad: "V",
      formula: "V_L = P / (√3 × I × cos(φ))",
    };
  }

  throw new Error("Error inesperado");
}

export function calcularCadaTension(params: CalculoCadaTension): ResultadoCalculo {
  const { voltaje, corriente, longitud, seccion, material, fc } = params;

  const resistividad = material === "cobre" ? 0.0178 : 0.0282;
  const k = material === "cobre" ? 56 : 35;

  const cadaTension = (2 * resistividad * longitud * corriente) / (seccion * 1000);
  const cadaTensionPorciento = (cadaTension / voltaje) * 100 * fc;

  const cumpleNC800 = cadaTensionPorciento <= 3;

  return {
    valor: cadaTensionPorciento,
    unidad: "%",
    formula: "ΔU% = (2 × ρ × L × I × FC) / (S × V) × 100",
    nota: `Caída de tensión: ${cadaTension.toFixed(2)} V\nResistencia conductor: ${((resistividad * longitud * 2) / seccion).toFixed(4)} Ω\nConductor ${material === "cobre" ? "de cobre" : "de aluminio"}\nCapacidad conducción K=${k} A/mm²\n${cumpleNC800 ? "✓ Cumple con NC 800 (≤3%)" : "✗ No cumple NC 800 (debe ser ≤3%)"}`,
  };
}

export function calcularSeccionConductor(params: CalculoConductor): ResultadoCalculo {
  const { corriente, material } = params;
  const k = material === "cobre" ? 56 : 35;

  const seccionMinima = corriente / k;
  const seccionesComerciales = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const seccionElegida = seccionesComerciales.find((s) => s >= seccionMinima) || seccionesComerciales[seccionesComerciales.length - 1];

  return {
    valor: seccionElegida,
    unidad: "mm²",
    formula: "S = I / K",
    nota: `Sección mínima calculada: ${seccionMinima.toFixed(2)} mm²\nSección comercial elegida: ${seccionElegida} mm²\nMaterial: ${material === "cobre" ? "Cobre" : "Aluminio"}\nCapacidad de conducción: ${corriente} A\nNorma参考: NC 800`,
  };
}

export function calcularProteccionMagnetotermica(params: CalculoProteccion): ResultadoCalculo {
  const { corriente, tipoCarga } = params;

  let multiplicador = 1;
  if (tipoCarga === "motores") {
    multiplicador = 1.25;
  } else if (tipoCarga === "transformador") {
    multiplicador = 1.5;
  }

  const corrienteProteccion = corriente * multiplicador;
  const proteccionesComerciales = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
  const proteccionElegida = proteccionesComerciales.find((p) => p >= corrienteProteccion) || proteccionesComerciales[proteccionesComerciales.length - 1];

  return {
    valor: proteccionElegida,
    unidad: "A",
    formula: `I_n = I_load × ${multiplicador}`,
    nota: `Corriente de cálculo: ${corriente} A\nCorriente ajustada: ${corrienteProteccion.toFixed(1)} A\nInterruptor magnetotérmico elegido: ${proteccionElegida} A\nTipo de curva: ${tipoCarga === "motores" ? "C" : "B"}\nNorma参考: NC 801`,
  };
}

export function calcularPuestaTierra(params: CalculoPuestaTierra): ResultadoCalculo {
  const { resistividadSuelo, longitudVarilla, diametroVarilla, numVarillas } = params;

  const resistenciaVarilla = (resistividadSuelo / (2 * Math.PI * longitudVarilla)) * Math.log((4 * longitudVarilla) / diametroVarilla);

  let resistenciaTotal: number;
  let formula: string;

  if (numVarillas === 1) {
    resistenciaTotal = resistenciaVarilla;
    formula = "R = (ρ / 2πL) × ln(4L/d)";
  } else {
    const factorN = numVarillas <= 3 ? numVarillas : numVarillas * 0.9;
    resistenciaTotal = resistenciaVarilla / factorN;
    formula = "R = R_varilla / (N × 0.9)";
  }

  const solicitaMax = 25;
  const cumple = resistenciaTotal <= solicitaMax;

  return {
    valor: resistenciaTotal,
    unidad: "Ω",
    formula,
    nota: `Resistencia de una varilla: ${resistenciaVarilla.toFixed(2)} Ω\nNúmero de varillas: ${numVarillas}\nLongitud varilla: ${longitudVarilla} m\nDiámetro varilla: ${diametroVarilla} mm\nResistividad del suelo: ${resistividadSuelo} Ω·m\n${cumple ? "✓ Cumple con NC 802 (≤25Ω)" : "✗ No cumple NC 802"}`,
  };
}

export function calcularCorreccionFactorPotencia(params: CalculoFactorPotencia): ResultadoCalculo {
  const { potenciaActiva, fpActual, fpDeseado } = params;

  const anguloActual = Math.acos(fpActual);
  const anguloDeseado = Math.acos(fpDeseado);

  const tangenteActual = Math.tan(anguloActual);
  const tangenteDeseado = Math.tan(anguloDeseado);

  const qActual = potenciaActiva * tangenteActual;
  const qDeseado = potenciaActiva * tangenteDeseado;

  const potenciaReactiva = qActual - qDeseado;

  const capacidadKVAR = potenciaReactiva;

  const kVARCantidad = Math.ceil(capacidadKVAR / 5) * 5;

  return {
    valor: kVARCantidad,
    unidad: "kVAR",
    formula: "Q_c = P × (tan(φ1) - tan(φ2))",
    nota: `Potencia activa: ${potenciaActiva.toFixed(2)} kW\nFactor de potencia actual: ${fpActual} (φ=${((anguloActual * 180) / Math.PI).toFixed(1)}°)\nFactor de potencia deseado: ${fpDeseado} (φ=${((anguloDeseado * 180) / Math.PI).toFixed(1)}°)\nPotencia reactiva a compensar: ${potenciaReactiva.toFixed(2)} kVAR\nBanco de capacitores recomendado: ${kVARCantidad} kVAR\nAhorro estimado en energía reactiva`,
  };
}

export function calcularResistividadSuelo(tipoSuelo: string): number {
  const resistividades: Record<string, number> = {
    pantano: 200,
    tierra_vegetal: 500,
    arcilla: 1000,
    arena: 5000,
    grava: 30000,
    roca: 100000,
  };

  return resistividades[tipoSuelo] || 1000;
}

// ============================================
// MÓDULO 1 - NC 803: ILUMINACIÓN
// ============================================

export interface CalculoIluminacion {
  iluminancia: number;
  area: number;
  factorUtilizacion: number;
  factorMantenimiento: number;
  flujoLuminaria?: number;
  potenciaLuminaria?: number;
  largo?: number;
  ancho?: number;
  alturaMontaje?: number;
}

export function calcularFlujoLuminoso(params: CalculoIluminacion): ResultadoCalculo {
  const { iluminancia, area, factorUtilizacion, factorMantenimiento } = params;

  if (iluminancia <= 0) throw new Error('La iluminancia debe ser mayor que 0');
  if (area <= 0) throw new Error('El área debe ser mayor que 0');
  if (factorUtilizacion <= 0 || factorUtilizacion > 1) throw new Error('El factor de utilización debe estar entre 0 y 1');
  if (factorMantenimiento <= 0 || factorMantenimiento > 1) throw new Error('El factor de mantenimiento debe estar entre 0 y 1');

  const flujoTotal = (iluminancia * area) / (factorUtilizacion * factorMantenimiento);

  return {
    valor: flujoTotal,
    unidad: 'lm',
    formula: 'Φ_total = (E × A) / (η × fm)',
    nota: `Iluminancia: ${iluminancia} lux\nÁrea: ${area} m²\nFactor de utilización: ${factorUtilizacion}\nFactor de mantenimiento: ${factorMantenimiento}\nNorma参考: NC 803`,
  };
}

export function calcularNumeroLuminarias(flujoTotal: number, flujoLuminaria: number): ResultadoCalculo {
  if (flujoTotal <= 0) throw new Error('El flujo total debe ser mayor que 0');
  if (flujoLuminaria <= 0) throw new Error('El flujo de la luminaria debe ser mayor que 0');

  const numero = Math.ceil(flujoTotal / flujoLuminaria);

  return {
    valor: numero,
    unidad: 'und',
    formula: 'N = Φ_total / Φ_luminaria',
    nota: `Flujo total: ${flujoTotal.toFixed(2)} lm\nFlujo por luminaria: ${flujoLuminaria} lm\nNúmero de luminarias: ${numero}`,
  };
}

export function calcularIndiceLocal(largo: number, ancho: number, alturaMontaje: number): ResultadoCalculo {
  if (largo <= 0) throw new Error('El largo debe ser mayor que 0');
  if (ancho <= 0) throw new Error('El ancho debe ser mayor que 0');
  if (alturaMontaje <= 0) throw new Error('La altura de montaje debe ser mayor que 0');

  const k = (largo * ancho) / (alturaMontaje * (largo + ancho));

  return {
    valor: k,
    unidad: '',
    formula: 'k = (a × b) / (h × (a + b))',
    nota: `Largo: ${largo} m\nAncho: ${ancho} m\nAltura de montaje: ${alturaMontaje} m\nÍndice del local: ${k.toFixed(2)}\nNorma参考: NC 803`,
  };
}

export function getNivelesIluminancia() {
  return [
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
  ];
}

export function calcularPotenciaInstalada(numeroLuminarias: number, potenciaLuminaria: number): ResultadoCalculo {
  if (numeroLuminarias <= 0) throw new Error('El número de luminarias debe ser mayor que 0');
  if (potenciaLuminaria <= 0) throw new Error('La potencia de la luminaria debe ser mayor que 0');

  const potenciaTotal = numeroLuminarias * potenciaLuminaria;

  return {
    valor: potenciaTotal,
    unidad: 'W',
    formula: 'P_total = N × P_luminaria',
    nota: `Número de luminarias: ${numeroLuminarias}\nPotencia por luminaria: ${potenciaLuminaria} W\nPotencia total: ${potenciaTotal} W\nPotencia total: ${(potenciaTotal / 1000).toFixed(2)} kW`,
  };
}

// ============================================
// MÓDULO 2 - NC 804: MOTORES
// ============================================

export interface CalculoMotor {
  potencia: number;
  tension: number;
  rendimiento: number;
  factorPotencia: number;
  tipoArranque: 'directo' | 'estrella-triangulo' | 'variador';
}

export function calcularCorrienteNominalMotor(params: CalculoMotor): ResultadoCalculo {
  const { potencia, tension, rendimiento, factorPotencia } = params;

  if (potencia <= 0) throw new Error('La potencia debe ser mayor que 0');
  if (tension <= 0) throw new Error('La tensión debe ser mayor que 0');
  if (rendimiento <= 0 || rendimiento > 1) throw new Error('El rendimiento debe estar entre 0 y 1');
  if (factorPotencia <= 0 || factorPotencia > 1) throw new Error('El factor de potencia debe estar entre 0 y 1');

  const potenciaW = potencia * 1000;
  const corriente = potenciaW / (Math.sqrt(3) * tension * rendimiento * factorPotencia);

  return {
    valor: corriente,
    unidad: 'A',
    formula: 'I_n = P / (√3 × V_L × η × cos(φ))',
    nota: `Potencia: ${potencia} kW\nTensión: ${tension} V\nRendimiento: ${(rendimiento * 100).toFixed(1)}%\nFactor de potencia: ${factorPotencia}\nNorma参考: NC 804`,
  };
}

export function calcularCorrienteArranque(corrienteNominal: number, tipoArranque: string): ResultadoCalculo {
  if (corrienteNominal <= 0) throw new Error('La corriente nominal debe ser mayor que 0');

  let kArr: number;
  let nombreArranque: string;

  switch (tipoArranque) {
    case 'directo':
      kArr = 6;
      nombreArranque = 'Directo (DOL)';
      break;
    case 'estrella-triangulo':
      kArr = 2.15;
      nombreArranque = 'Estrella-Triángulo';
      break;
    case 'variador':
      kArr = 1.25;
      nombreArranque = 'Variador de frecuencia (VFD)';
      break;
    default:
      kArr = 6;
      nombreArranque = 'Directo (DOL)';
  }

  const corrienteArranque = kArr * corrienteNominal;

  return {
    valor: corrienteArranque,
    unidad: 'A',
    formula: `I_arr = ${kArr} × I_n`,
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nFactor de arranque K_arr: ${kArr}\nTipo de arranque: ${nombreArranque}\nNorma参考: NC 804`,
  };
}

export function calcularProteccionMotor(corrienteNominal: number): ResultadoCalculo {
  if (corrienteNominal <= 0) throw new Error('La corriente nominal debe ser mayor que 0');

  const proteccion = 1.15 * corrienteNominal;
  const proteccionesComerciales = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160];
  const proteccionElegida = proteccionesComerciales.find(p => p >= proteccion) || proteccionesComerciales[proteccionesComerciales.length - 1];

  return {
    valor: proteccionElegida,
    unidad: 'A',
    formula: 'I_protección = 1.15 × I_n',
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nCorriente ajustada (115%): ${proteccion.toFixed(2)} A\nProtección térmica elegida: ${proteccionElegida} A\nNota: NC 804 usa 115% vs NC 801 que usa 125%\nNorma参考: NC 804`,
  };
}

export function calcularConductorMotor(corrienteNominal: number): ResultadoCalculo {
  if (corrienteNominal <= 0) throw new Error('La corriente nominal debe ser mayor que 0');

  const iDiseno = 1.25 * corrienteNominal;
  const secciones = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const capacidades = { 1.5: 15, 2.5: 21, 4: 27, 6: 34, 10: 46, 16: 62, 25: 80, 35: 99, 50: 118, 70: 150, 95: 181, 120: 210 };
  const seccion = secciones.find(s => capacidades[s as keyof typeof capacidades] >= iDiseno) || secciones[secciones.length - 1];

  return {
    valor: seccion,
    unidad: 'mm²',
    formula: 'I_diseño = 1.25 × I_n → seleccionar sección',
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nCorriente de diseño (125%): ${iDiseno.toFixed(2)} A\nSección recomendada: ${seccion} mm²\nCapacidad: ${capacidades[seccion as keyof typeof capacidades]} A\nNorma参考: NC 804`,
  };
}

export function calcularContactor(corrienteNominal: number, corrienteArranque: number): ResultadoCalculo {
  if (corrienteNominal <= 0) throw new Error('La corriente nominal debe ser mayor que 0');
  if (corrienteArranque <= 0) throw new Error('La corriente de arranque debe ser mayor que 0');

  const contactores = [9, 12, 18, 25, 32, 40, 50, 65, 80, 95, 115, 150, 170, 205, 250, 300, 400];
  const contactorMinimo = contactores.find(c => c >= corrienteNominal) || contactores[contactores.length - 1];

  const ratioArranque = corrienteArranque / corrienteNominal;
  const categoria = ratioArranque > 10 ? 'AC-4 (arranque difícil)' : 'AC-3 (uso general)';
  const advertencia = ratioArranque > 10 ? '⚠️ ALERTA: I_arr > 10 × I_n requiere categoría AC-4' : '';

  return {
    valor: contactorMinimo,
    unidad: 'A',
    formula: 'I_contactor ≥ I_n',
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nContactor mínimo: ${contactorMinimo} A\nRatio I_arr/I_n: ${ratioArranque.toFixed(1)}\nCategoría recomendada: ${categoria}\n${advertencia}\nNorma参考: IEC 60947-4`,
  };
}

// ============================================
// MÓDULO 3 - NC 801: CORTOCIRCUITO
// ============================================

export interface CalculoCortocircuito {
  tensionLinea: number;
  longitud: number;
  seccion: number;
  material: 'cobre' | 'aluminio';
  tensionFase?: number;
}

export function calcularCortocircuitoTrifasico(params: CalculoCortocircuito): ResultadoCalculo {
  const { tensionLinea, longitud, seccion, material } = params;

  if (tensionLinea <= 0) throw new Error('La tensión de línea debe ser mayor que 0');
  if (longitud <= 0) throw new Error('La longitud debe ser mayor que 0');
  if (seccion <= 0) throw new Error('La sección debe ser mayor que 0');

  const resistividad = material === 'cobre' ? 0.01786 : 0.02857;
  const reactancia = 0.08;

  const rTotal = (resistividad * longitud * 2) / seccion;
  const zTotal = Math.sqrt(Math.pow(rTotal, 2) + Math.pow(reactancia, 2));
  const icc = (tensionLinea / (Math.sqrt(3) * zTotal)) / 1000;

  return {
    valor: icc,
    unidad: 'kA',
    formula: 'I_cc = V_L / (√3 × Z_total)',
    nota: `Tensión de línea: ${tensionLinea} V\nLongitud: ${longitud} m\nSección: ${seccion} mm²\nMaterial: ${material === 'cobre' ? 'Cobre' : 'Aluminio'}\nR_total: ${rTotal.toFixed(4)} Ω\nZ_total: ${zTotal.toFixed(4)} Ω\nI_cc: ${icc.toFixed(2)} kA\nNorma参考: NC 801`,
  };
}

export function verificarPoderCorte(icc: number, poderCorte: number): ResultadoCalculo {
  if (icc <= 0) throw new Error('La corriente de cortocircuito debe ser mayor que 0');
  if (poderCorte <= 0) throw new Error('El poder de corte debe ser mayor que 0');

  const esApto = icc <= poderCorte;

  return {
    valor: esApto ? 1 : 0,
    unidad: esApto ? 'APTO' : 'NO APTO',
    formula: 'I_cc ≤ I_cu del interruptor',
    nota: `I_cc calculada: ${icc.toFixed(2)} kA\nPoder de corte del interruptor: ${poderCorte} kA\n${esApto ? '✓ APTO - El interruptor puede cortar esta corriente' : '✗ NO APTO - Interruptor insuficiente'}\nNorma参考: NC 801`,
  };
}

export function calcularCortocircuitoMonofasico(params: CalculoCortocircuito): ResultadoCalculo {
  const { tensionFase = 127, longitud, seccion, material } = params;

  if (tensionFase <= 0) throw new Error('La tensión de fase debe ser mayor que 0');
  if (longitud <= 0) throw new Error('La longitud debe ser mayor que 0');
  if (seccion <= 0) throw new Error('La sección debe ser mayor que 0');

  const resistividad = material === 'cobre' ? 0.01786 : 0.02857;
  const zConductor = (2 * resistividad * longitud) / seccion;
  const iccMin = (0.8 * tensionFase) / (2 * zConductor);

  return {
    valor: iccMin,
    unidad: 'A',
    formula: 'I_cc_min = 0.8 × V_fase / (2 × Z)',
    nota: `Tensión de fase: ${tensionFase} V\nLongitud: ${longitud} m\nSección: ${seccion} mm²\nMaterial: ${material === 'cobre' ? 'Cobre' : 'Aluminio'}\nZ_conductor: ${zConductor.toFixed(4)} Ω\nI_cc_mín: ${iccMin.toFixed(2)} A (monofásico)\nFactor 0.8 según NC 801 para condición mínima\nNorma参考: NC 801`,
  };
}

// ============================================
// MÓDULO 4 - NC 802: PUESTA A TIERRA (MEJORAS)
// ============================================

export function calcularConductorTierra(seccionFase: number): ResultadoCalculo {
  if (seccionFase <= 0) throw new Error('La sección de fase debe ser mayor que 0');

  let seccionPE: number;
  let nota: string;

  if (seccionFase <= 16) {
    seccionPE = seccionFase;
    nota = `S_fase ≤ 16mm² → S_PE = S_fase`;
  } else if (seccionFase <= 35) {
    seccionPE = 16;
    nota = `16 < S_fase ≤ 35mm² → S_PE = 16mm²`;
  } else {
    seccionPE = Math.ceil(seccionFase / 2);
    const seccionesComerciales = [16, 25, 35, 50, 70, 95, 120];
    seccionPE = seccionesComerciales.find(s => s >= seccionPE) || seccionPE;
    nota = `S_fase > 35mm² → S_PE = S_fase/2 = ${seccionPE}mm²`;
  }

  return {
    valor: seccionPE,
    unidad: 'mm²',
    formula: 'S_PE según NC 802',
    nota: `Sección de fase: ${seccionFase} mm²\nSección PE recomendada: ${seccionPE} mm²\n${nota}\nNorma参考: NC 802 / IEC 60364-5-54`,
  };
}

export interface CalculoResistenciaElectrodo {
  resistividad: number;
  longitudElectrodo: number;
  diametroElectrodo: number;
}

export function calcularResistenciaElectrodo(params: CalculoResistenciaElectrodo): ResultadoCalculo {
  const { resistividad, longitudElectrodo, diametroElectrodo } = params;

  if (resistividad <= 0) throw new Error('La resistividad debe ser mayor que 0');
  if (longitudElectrodo <= 0) throw new Error('La longitud del electrodo debe ser mayor que 0');
  if (diametroElectrodo <= 0) throw new Error('El diámetro del electrodo debe ser mayor que 0');

  const resistencia = (resistividad / (2 * Math.PI * longitudElectrodo)) * Math.log((4 * longitudElectrodo) / diametroElectrodo);
  const cumple = resistencia <= 25;

  return {
    valor: resistencia,
    unidad: 'Ω',
    formula: 'R = (ρ / 2πL) × ln(4L/d)',
    nota: `Resistividad del suelo: ${resistividad} Ω·m\nLongitud del electrodo: ${longitudElectrodo} m\nDiámetro del electrodo: ${diametroElectrodo} m\nResistencia: ${resistencia.toFixed(2)} Ω\n${cumple ? '✓ CUMPLE con NC 802 (≤25Ω)' : '✗ NO CUMPLE - necesita electrodos en paralelo'}\nNorma参考: NC 802`,
  };
}

export function calcularElectrodosParalelo(resistenciaIndividual: number, numeroElectrodos: number, separacion: 'L' | 'menor'): ResultadoCalculo {
  if (resistenciaIndividual <= 0) throw new Error('La resistencia individual debe ser mayor que 0');
  if (numeroElectrodos <= 0) throw new Error('El número de electrodos debe ser mayor que 0');

  const etaP = separacion === 'L' ? 0.85 : 0.7;
  const resistenciaParalelo = resistenciaIndividual / (numeroElectrodos * etaP);
  const cumple = resistenciaParalelo <= 25;

  return {
    valor: resistenciaParalelo,
    unidad: 'Ω',
    formula: 'R_paralelo = R / (n × η_p)',
    nota: `Resistencia de un electrodo: ${resistenciaIndividual.toFixed(2)} Ω\nNúmero de electrodos: ${numeroElectrodos}\nFactor de eficiencia: ${etaP}\nResistencia en paralelo: ${resistenciaParalelo.toFixed(2)} Ω\n${cumple ? '✓ CUMPLE con NC 802 (≤25Ω)' : '✗ NO CUMPLE - aumentar electrodos'}\nNorma参考: NC 802`,
  };
}

// ============================================
// MÓDULO 5 - NC 800: DEMANDA MÁXIMA
// ============================================

export interface CalculoDemanda {
  cargas: { potencia: number; tipo: string }[];
  factorPotencia: number;
  sistema: 'monofasico' | 'trifasico';
  tension: number;
}

export function calcularDemandaMaxima(params: CalculoDemanda): ResultadoCalculo {
  const { cargas, factorPotencia } = params;

  if (cargas.length === 0) throw new Error('Debe proporcionar al menos una carga');
  if (factorPotencia <= 0 || factorPotencia > 1) throw new Error('El factor de potencia debe estar entre 0 y 1');

  const factores: Record<string, number> = {
    'Iluminación': 1.0,
    'Tomas generales': 0.4,
    'Tomas cocina': 0.6,
    'Aires acondicionados': 0.8,
    'Motores': 0.75,
    'Calentadores': 0.65,
    'Cocinas eléctricas': 0.6,
  };

  let demandaKW = 0;
  let detalle = '';

  for (const carga of cargas) {
    const fd = factores[carga.tipo] || 0.5;
    demandaKW += carga.potencia * fd;
    detalle += `${carga.tipo}: ${carga.potencia}W × ${fd} = ${(carga.potencia * fd / 1000).toFixed(2)}kW\n`;
  }

  const demandaKVA = demandaKW / factorPotencia;

  return {
    valor: demandaKW,
    unidad: 'kW',
    formula: 'D_max = Σ(P_i × fd_i) / fp',
    nota: `${detalle}\nDemanda máxima: ${demandaKW.toFixed(2)} kW\nDemanda aparente: ${demandaKVA.toFixed(2)} kVA\nFactor de potencia: ${factorPotencia}\nNorma参考: NC 800`,
  };
}

export function calcularCorrienteAcometida(demandaKW: number, tension: number, factorPotencia: number, sistema: string): ResultadoCalculo {
  if (demandaKW <= 0) throw new Error('La demanda debe ser mayor que 0');
  if (tension <= 0) throw new Error('La tensión debe ser mayor que 0');
  if (factorPotencia <= 0 || factorPotencia > 1) throw new Error('El factor de potencia debe estar entre 0 y 1');

  const demandaW = demandaKW * 1000;
  let corriente: number;

  if (sistema === 'trifasico') {
    corriente = demandaW / (Math.sqrt(3) * tension * factorPotencia);
  } else {
    corriente = demandaW / (tension * factorPotencia);
  }

  return {
    valor: corriente,
    unidad: 'A',
    formula: sistema === 'trifasico' ? 'I = D / (√3 × V_L × cos(φ))' : 'I = D / (V × cos(φ))',
    nota: `Demanda: ${demandaKW.toFixed(2)} kW\nTensión: ${tension} V (${sistema})\nFactor de potencia: ${factorPotencia}\nCorriente de acometida: ${corriente.toFixed(2)} A\nNorma参考: NC 800`,
  };
}

export function calcularDemandaResidencial(potenciaInstalada: number): ResultadoCalculo {
  if (potenciaInstalada <= 0) throw new Error('La potencia instalada debe ser mayor que 0');

  const cargaBasica = 1500;
  let demanda: number;

  if (potenciaInstalada <= cargaBasica) {
    demanda = potenciaInstalada;
  } else {
    const adicional = potenciaInstalada - cargaBasica;
    demanda = cargaBasica + 0.4 * adicional;
  }

  return {
    valor: demanda,
    unidad: 'W',
    formula: 'D = 1500 + 0.4 × P_adicional',
    nota: `Potencia instalada: ${potenciaInstalada} W\nCarga básica: ${cargaBasica} W\nPotencia adicional: ${potenciaInstalada > cargaBasica ? potenciaInstalada - cargaBasica : 0} W\nDemanda calculada: ${demanda.toFixed(0)} W\nMétodo simplificado NC 800 para viviendas\nNorma参考: NC 800 Anexo`,
  };
}

// ============================================
// MÓDULO 6 - NC 800: CANALIZACIONES
// ============================================

export interface CalculoOcupacionTubo {
  conductores: { seccion: number; cantidad: number }[];
  diametroTubo: number;
}

export function calcularOcupacionTubo(params: CalculoOcupacionTubo): ResultadoCalculo {
  const { conductores, diametroTubo } = params;

  if (conductores.length === 0) throw new Error('Debe proporcionar al menos un conductor');
  if (diametroTubo <= 0) throw new Error('El diámetro del tubo debe ser mayor que 0');

  const areasConductor: Record<number, number> = {
    1.5: 29.2,
    2.5: 39.6,
    4: 54.1,
    6: 67.9,
    10: 103.9,
    16: 145.3,
    25: 221.9,
    35: 283.5,
  };

  let areaTotalConductores = 0;
  const numConductores = conductores.reduce((sum, c) => sum + c.cantidad, 0);

  for (const conductor of conductores) {
    const area = areasConductor[conductor.seccion as keyof typeof areasConductor] || Math.PI * Math.pow(1.13 * conductor.seccion, 2);
    areaTotalConductores += area * conductor.cantidad;
  }

  const areaTubo = Math.PI * Math.pow(diametroTubo / 2, 2);
  const ocupacion = (areaTotalConductores / areaTubo) * 100;

  let maxOcupacion: number;
  if (numConductores === 1) maxOcupacion = 53;
  else if (numConductores === 2) maxOcupacion = 31;
  else maxOcupacion = 40;

  const cumple = ocupacion <= maxOcupacion;

  return {
    valor: ocupacion,
    unidad: '%',
    formula: '%Ocup = (Σ Áreas / Área_tubo) × 100',
    nota: `Área total conductores: ${areaTotalConductores.toFixed(2)} mm²\nÁrea interior tubo: ${areaTubo.toFixed(2)} mm²\nOcupación: ${ocupacion.toFixed(1)}%\nMáximo permitido (${numConductores} conductors): ${maxOcupacion}%\n${cumple ? '✓ CUMPLE con NC 800' : '✗ NO CUMPLE - aumentar diámetro del tubo'}\nNorma参考: NC 800 / IEC`,
  };
}

// ============================================
// MÓDULO 7 - FACTORES DE CORRECCIÓN
// ============================================

export function aplicarFactoresCorreccion(corriente: number, temperatura: number, numConductores: number): ResultadoCalculo {
  if (corriente <= 0) throw new Error('La corriente debe ser mayor que 0');

  const fcTemp: Record<number, number> = { 20: 1.12, 25: 1.06, 30: 1.00, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71 };
  const fcGrupal: Record<string, number> = { '1': 0.80, '2': 0.70, '3': 0.65, '4-5': 0.57 };

  let fg: number;
  if (numConductores === 1) fg = fcGrupal['1'];
  else if (numConductores === 2) fg = fcGrupal['2'];
  else if (numConductores === 3) fg = fcGrupal['3'];
  else fg = fcGrupal['4-5'];

  const fc = fcTemp[temperatura as keyof typeof fcTemp] || 1.00;
  const corrienteCorregida = corriente / (fc * fg);

  return {
    valor: corrienteCorregida,
    unidad: 'A',
    formula: 'I_corr = I / (fc × fg)',
    nota: `Corriente original: ${corriente} A\nTemperatura ambiente: ${temperatura}°C → fc = ${fc}\nConductores agrupados: ${numConductores} → fg = ${fg}\nFactor total: ${(fc * fg).toFixed(2)}\nCorriente corregida: ${corrienteCorregida.toFixed(2)} A\nNorma参考: NC 800`,
  };
}

export function verificarSelectividad(InAguasAbajo: number, InAguasArriba: number): ResultadoCalculo {
  if (InAguasAbajo <= 0) throw new Error('La corriente abajo debe ser mayor que 0');
  if (InAguasArriba <= 0) throw new Error('La corriente arriba debe ser mayor que 0');

  const esSelectivo = InAguasAbajo < InAguasArriba * 0.5;

  return {
    valor: esSelectivo ? 1 : 0,
    unidad: esSelectivo ? 'SELECTIVO' : 'NO SELECTIVO',
    formula: 'In_abajo < In_arriba × 0.5',
    nota: `I_n aguas abajo: ${InAguasAbajo} A\nI_n aguas arriba: ${InAguasArriba} A\nRelación: ${(InAguasAbajo / InAguasArriba).toFixed(2)}\n${esSelectivo ? '✓ SELECTIVO - Coordinación correcta' : '⚠️ NO SELECTIVO - Revisar coordinación'}\nNorma参考: NC 801`,
  };
}

export function siguienteSeccion(seccionCalculada: number, material: 'Cu' | 'Al'): number {
  const seccionesCu = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const seccionesAl = [16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const secciones = material === 'Cu' ? seccionesCu : seccionesAl;

  return secciones.find(s => s >= seccionCalculada) || secciones[secciones.length - 1];
}
