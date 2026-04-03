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
    nota: `Sección mínima calculada: ${seccionMinima.toFixed(2)} mm²\nSección comercial elegida: ${seccionElegida} mm²\nMaterial: ${material === "cobre" ? "Cobre" : "Aluminio"}\nCapacidad de conducción: ${corriente} A\nNorma Ref:: NC 800`,
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
    nota: `Corriente de cálculo: ${corriente} A\nCorriente ajustada: ${corrienteProteccion.toFixed(1)} A\nInterruptor magnetotérmico elegido: ${proteccionElegida} A\nTipo de curva: ${tipoCarga === "motores" ? "C" : "B"}\nNorma Ref:: NC 801`,
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
    nota: `Iluminancia: ${iluminancia} lux\nÁrea: ${area} m²\nFactor de utilización: ${factorUtilizacion}\nFactor de mantenimiento: ${factorMantenimiento}\nNorma Ref:: NC 803`,
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
    nota: `Largo: ${largo} m\nAncho: ${ancho} m\nAltura de montaje: ${alturaMontaje} m\nÍndice del local: ${k.toFixed(2)}\nNorma Ref:: NC 803`,
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
    nota: `Potencia: ${potencia} kW\nTensión: ${tension} V\nRendimiento: ${(rendimiento * 100).toFixed(1)}%\nFactor de potencia: ${factorPotencia}\nNorma Ref:: NC 804`,
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
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nFactor de arranque K_arr: ${kArr}\nTipo de arranque: ${nombreArranque}\nNorma Ref:: NC 804`,
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
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nCorriente ajustada (115%): ${proteccion.toFixed(2)} A\nProtección térmica elegida: ${proteccionElegida} A\nNota: NC 804 usa 115% vs NC 801 que usa 125%\nNorma Ref:: NC 804`,
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
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nCorriente de diseño (125%): ${iDiseno.toFixed(2)} A\nSección recomendada: ${seccion} mm²\nCapacidad: ${capacidades[seccion as keyof typeof capacidades]} A\nNorma Ref:: NC 804`,
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
    nota: `Corriente nominal: ${corrienteNominal.toFixed(2)} A\nContactor mínimo: ${contactorMinimo} A\nRatio I_arr/I_n: ${ratioArranque.toFixed(1)}\nCategoría recomendada: ${categoria}\n${advertencia}\nNorma Ref:: IEC 60947-4`,
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
    nota: `Tensión de línea: ${tensionLinea} V\nLongitud: ${longitud} m\nSección: ${seccion} mm²\nMaterial: ${material === 'cobre' ? 'Cobre' : 'Aluminio'}\nR_total: ${rTotal.toFixed(4)} Ω\nZ_total: ${zTotal.toFixed(4)} Ω\nI_cc: ${icc.toFixed(2)} kA\nNorma Ref:: NC 801`,
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
    nota: `I_cc calculada: ${icc.toFixed(2)} kA\nPoder de corte del interruptor: ${poderCorte} kA\n${esApto ? '✓ APTO - El interruptor puede cortar esta corriente' : '✗ NO APTO - Interruptor insuficiente'}\nNorma Ref:: NC 801`,
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
    nota: `Tensión de fase: ${tensionFase} V\nLongitud: ${longitud} m\nSección: ${seccion} mm²\nMaterial: ${material === 'cobre' ? 'Cobre' : 'Aluminio'}\nZ_conductor: ${zConductor.toFixed(4)} Ω\nI_cc_mín: ${iccMin.toFixed(2)} A (monofásico)\nFactor 0.8 según NC 801 para condición mínima\nNorma Ref:: NC 801`,
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
    nota: `Sección de fase: ${seccionFase} mm²\nSección PE recomendada: ${seccionPE} mm²\n${nota}\nNorma Ref:: NC 802 / IEC 60364-5-54`,
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
    nota: `Resistividad del suelo: ${resistividad} Ω·m\nLongitud del electrodo: ${longitudElectrodo} m\nDiámetro del electrodo: ${diametroElectrodo} m\nResistencia: ${resistencia.toFixed(2)} Ω\n${cumple ? '✓ CUMPLE con NC 802 (≤25Ω)' : '✗ NO CUMPLE - necesita electrodos en paralelo'}\nNorma Ref:: NC 802`,
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
    nota: `Resistencia de un electrodo: ${resistenciaIndividual.toFixed(2)} Ω\nNúmero de electrodos: ${numeroElectrodos}\nFactor de eficiencia: ${etaP}\nResistencia en paralelo: ${resistenciaParalelo.toFixed(2)} Ω\n${cumple ? '✓ CUMPLE con NC 802 (≤25Ω)' : '✗ NO CUMPLE - aumentar electrodos'}\nNorma Ref:: NC 802`,
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
    nota: `${detalle}\nDemanda máxima: ${demandaKW.toFixed(2)} kW\nDemanda aparente: ${demandaKVA.toFixed(2)} kVA\nFactor de potencia: ${factorPotencia}\nNorma Ref:: NC 800`,
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
    nota: `Demanda: ${demandaKW.toFixed(2)} kW\nTensión: ${tension} V (${sistema})\nFactor de potencia: ${factorPotencia}\nCorriente de acometida: ${corriente.toFixed(2)} A\nNorma Ref:: NC 800`,
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
    nota: `Potencia instalada: ${potenciaInstalada} W\nCarga básica: ${cargaBasica} W\nPotencia adicional: ${potenciaInstalada > cargaBasica ? potenciaInstalada - cargaBasica : 0} W\nDemanda calculada: ${demanda.toFixed(0)} W\nMétodo simplificado NC 800 para viviendas\nNorma Ref:: NC 800 Anexo`,
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
    nota: `Área total conductores: ${areaTotalConductores.toFixed(2)} mm²\nÁrea interior tubo: ${areaTubo.toFixed(2)} mm²\nOcupación: ${ocupacion.toFixed(1)}%\nMáximo permitido (${numConductores} conductors): ${maxOcupacion}%\n${cumple ? '✓ CUMPLE con NC 800' : '✗ NO CUMPLE - aumentar diámetro del tubo'}\nNorma Ref:: NC 800 / IEC`,
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
    nota: `Corriente original: ${corriente} A\nTemperatura ambiente: ${temperatura}°C → fc = ${fc}\nConductores agrupados: ${numConductores} → fg = ${fg}\nFactor total: ${(fc * fg).toFixed(2)}\nCorriente corregida: ${corrienteCorregida.toFixed(2)} A\nNorma Ref:: NC 800`,
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
    nota: `I_n aguas abajo: ${InAguasAbajo} A\nI_n aguas arriba: ${InAguasArriba} A\nRelación: ${(InAguasAbajo / InAguasArriba).toFixed(2)}\n${esSelectivo ? '✓ SELECTIVO - Coordinación correcta' : '⚠️ NO SELECTIVO - Revisar coordinación'}\nNorma Ref:: NC 801`,
  };
}

export function siguienteSeccion(seccionCalculada: number, material: 'Cu' | 'Al'): number {
  const seccionesCu = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const seccionesAl = [16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const secciones = material === 'Cu' ? seccionesCu : seccionesAl;

  return secciones.find(s => s >= seccionCalculada) || secciones[secciones.length - 1];
}

// ============================================================
// TABLAS NORMATIVAS NC IEC 60364-5-52
// ============================================================

export const TABLA_B52_1 = {
  metodo_A1: {
    Cobre: {
      Dos_PVC: [
        {mm2:1.5,amp:14.5},{mm2:2.5,amp:19.5},{mm2:4,amp:26},{mm2:6,amp:34},
        {mm2:10,amp:46},{mm2:16,amp:61},{mm2:25,amp:80},{mm2:35,amp:99},
        {mm2:50,amp:119},{mm2:70,amp:151},{mm2:95,amp:182},{mm2:120,amp:210}
      ],
      Tres_PVC: [
        {mm2:1.5,amp:13.5},{mm2:2.5,amp:18},{mm2:4,amp:24},{mm2:6,amp:31},
        {mm2:10,amp:42},{mm2:16,amp:56},{mm2:25,amp:73},{mm2:35,amp:89},
        {mm2:50,amp:108},{mm2:70,amp:136},{mm2:95,amp:164},{mm2:120,amp:188}
      ],
      Dos_XLPE: [
        {mm2:1.5,amp:19},{mm2:2.5,amp:26},{mm2:4,amp:35},{mm2:6,amp:45},
        {mm2:10,amp:61},{mm2:16,amp:81},{mm2:25,amp:106},{mm2:35,amp:131},
        {mm2:50,amp:158},{mm2:70,amp:200},{mm2:95,amp:241},{mm2:120,amp:278}
      ],
      Tres_XLPE: [
        {mm2:1.5,amp:17},{mm2:2.5,amp:23},{mm2:4,amp:31},{mm2:6,amp:40},
        {mm2:10,amp:54},{mm2:16,amp:73},{mm2:25,amp:95},{mm2:35,amp:117},
        {mm2:50,amp:141},{mm2:70,amp:179},{mm2:95,amp:216},{mm2:120,amp:249}
      ]
    },
    Aluminio: {
      Dos_PVC: [{mm2:2.5,amp:15},{mm2:4,amp:20},{mm2:6,amp:26},{mm2:10,amp:36},{mm2:16,amp:48},{mm2:25,amp:63}],
      Tres_PVC: [{mm2:2.5,amp:14},{mm2:4,amp:18.5},{mm2:6,amp:24},{mm2:10,amp:32},{mm2:16,amp:43},{mm2:25,amp:57},{mm2:35,amp:70},{mm2:50,amp:86},{mm2:70,amp:110},{mm2:95,amp:133},{mm2:120,amp:154}],
      Dos_XLPE: [{mm2:2.5,amp:19.5},{mm2:4,amp:26},{mm2:6,amp:33},{mm2:10,amp:46},{mm2:16,amp:61},{mm2:25,amp:78},{mm2:35,amp:96},{mm2:50,amp:117},{mm2:70,amp:150},{mm2:95,amp:183},{mm2:120,amp:212},{mm2:150,amp:245},{mm2:185,amp:280},{mm2:240,amp:330}],
      Tres_XLPE: [{mm2:2.5,amp:18.5},{mm2:4,amp:25},{mm2:6,amp:32},{mm2:10,amp:44},{mm2:16,amp:58},{mm2:25,amp:73},{mm2:35,amp:90},{mm2:50,amp:110},{mm2:70,amp:140},{mm2:95,amp:170},{mm2:120,amp:197},{mm2:150,amp:226},{mm2:185,amp:256},{mm2:240,amp:300}]
    }
  },
  metodo_A2: {
    Cobre: {
      Dos_PVC: [{mm2:1.5,amp:13.5},{mm2:2.5,amp:18},{mm2:4,amp:24},{mm2:6,amp:31},{mm2:10,amp:42},{mm2:16,amp:56},{mm2:25,amp:73}],
      Tres_PVC: [{mm2:1.5,amp:13},{mm2:2.5,amp:17.5},{mm2:4,amp:23},{mm2:6,amp:30},{mm2:10,amp:39},{mm2:16,amp:52},{mm2:25,amp:68}],
      Dos_XLPE: [{mm2:1.5,amp:17},{mm2:2.5,amp:23},{mm2:4,amp:31},{mm2:6,amp:40},{mm2:10,amp:54},{mm2:16,amp:73},{mm2:25,amp:95},{mm2:35,amp:117},{mm2:50,amp:141},{mm2:70,amp:179},{mm2:95,amp:216},{mm2:120,amp:249},{mm2:150,amp:285},{mm2:185,amp:324},{mm2:240,amp:380}],
      Tres_XLPE: [{mm2:1.5,amp:15.5},{mm2:2.5,amp:21},{mm2:4,amp:28},{mm2:6,amp:36},{mm2:10,amp:50},{mm2:16,amp:68},{mm2:25,amp:89},{mm2:35,amp:110},{mm2:50,amp:134},{mm2:70,amp:171},{mm2:95,amp:207},{mm2:120,amp:239}]
    },
    Aluminio: {
      Dos_PVC: [{mm2:2.5,amp:14},{mm2:4,amp:18.5},{mm2:6,amp:24},{mm2:10,amp:32},{mm2:16,amp:43},{mm2:25,amp:57}],
      Tres_PVC: [{mm2:2.5,amp:13.5},{mm2:4,amp:17.5},{mm2:6,amp:23},{mm2:10,amp:31},{mm2:16,amp:41},{mm2:25,amp:53}],
      Dos_XLPE: [{mm2:2.5,amp:18.5},{mm2:4,amp:25},{mm2:6,amp:32},{mm2:10,amp:44},{mm2:16,amp:58},{mm2:25,amp:73},{mm2:35,amp:90},{mm2:50,amp:110},{mm2:70,amp:140},{mm2:95,amp:170},{mm2:120,amp:197},{mm2:150,amp:226},{mm2:185,amp:256},{mm2:240,amp:300}],
      Tres_XLPE: [{mm2:2.5,amp:16.5},{mm2:4,amp:22},{mm2:6,amp:28},{mm2:10,amp:39},{mm2:16,amp:53},{mm2:25,amp:70},{mm2:35,amp:86},{mm2:50,amp:104},{mm2:70,amp:133},{mm2:95,amp:161},{mm2:120,amp:186}]
    }
  },
  metodo_B1: {
    Cobre: {
      Dos_PVC: [
        {mm2:1.5,amp:17.5},{mm2:2.5,amp:24},{mm2:4,amp:32},{mm2:6,amp:41},
        {mm2:10,amp:57},{mm2:16,amp:76},{mm2:25,amp:101},{mm2:35,amp:125},
        {mm2:50,amp:151},{mm2:70,amp:192},{mm2:95,amp:232},{mm2:120,amp:269}
      ],
      Tres_PVC: [
        {mm2:1.5,amp:15.5},{mm2:2.5,amp:21},{mm2:4,amp:28},{mm2:6,amp:36},
        {mm2:10,amp:50},{mm2:16,amp:68},{mm2:25,amp:89},{mm2:35,amp:110},
        {mm2:50,amp:134},{mm2:70,amp:171},{mm2:95,amp:207},{mm2:120,amp:239}
      ],
      Dos_XLPE: [{mm2:1.5,amp:24},{mm2:2.5,amp:32},{mm2:4,amp:42},{mm2:6,amp:58},{mm2:10,amp:77},{mm2:16,amp:85},{mm2:25,amp:97},{mm2:35,amp:120},{mm2:50,amp:146},{mm2:70,amp:187},{mm2:95,amp:227},{mm2:120,amp:263},{mm2:150,amp:304},{mm2:185,amp:347},{mm2:240,amp:409}],
      Tres_XLPE: [{mm2:1.5,amp:21},{mm2:2.5,amp:28},{mm2:4,amp:36},{mm2:6,amp:49},{mm2:10,amp:66},{mm2:16,amp:66},{mm2:25,amp:83},{mm2:35,amp:103},{mm2:50,amp:125},{mm2:70,amp:160},{mm2:95,amp:195},{mm2:120,amp:226},{mm2:150,amp:261},{mm2:185,amp:298},{mm2:240,amp:352}]
    },
    Aluminio: {
      Dos_PVC: [{mm2:2.5,amp:16.5},{mm2:4,amp:22},{mm2:6,amp:28},{mm2:10,amp:39},{mm2:16,amp:53},{mm2:25,amp:70},{mm2:35,amp:86},{mm2:50,amp:104},{mm2:70,amp:133},{mm2:95,amp:161},{mm2:120,amp:186}],
      Tres_PVC: [{mm2:2.5,amp:18.5},{mm2:4,amp:25},{mm2:6,amp:32},{mm2:10,amp:44},{mm2:16,amp:58},{mm2:25,amp:73},{mm2:35,amp:90},{mm2:50,amp:110},{mm2:70,amp:140},{mm2:95,amp:170},{mm2:120,amp:197}],
      Dos_XLPE: [{mm2:2.5,amp:24},{mm2:4,amp:32},{mm2:6,amp:42},{mm2:10,amp:58},{mm2:16,amp:77},{mm2:25,amp:97},{mm2:35,amp:120},{mm2:50,amp:146},{mm2:70,amp:187},{mm2:95,amp:227},{mm2:120,amp:263},{mm2:150,amp:304},{mm2:185,amp:347},{mm2:240,amp:409}],
      Tres_XLPE: [{mm2:2.5,amp:21},{mm2:4,amp:28},{mm2:6,amp:36},{mm2:10,amp:49},{mm2:16,amp:66},{mm2:25,amp:83},{mm2:35,amp:103},{mm2:50,amp:125},{mm2:70,amp:160},{mm2:95,amp:195},{mm2:120,amp:226},{mm2:150,amp:261},{mm2:185,amp:298},{mm2:240,amp:352}]
    }
  },
  metodo_B2: {
    Cobre: {
      Dos_PVC: [{mm2:1.5,amp:15.5},{mm2:2.5,amp:21},{mm2:4,amp:28},{mm2:6,amp:36},{mm2:10,amp:50},{mm2:16,amp:68},{mm2:25,amp:89},{mm2:35,amp:110},{mm2:50,amp:134},{mm2:70,amp:171},{mm2:95,amp:207},{mm2:120,amp:239}],
      Tres_PVC: [{mm2:1.5,amp:14.5},{mm2:2.5,amp:19.5},{mm2:4,amp:26},{mm2:6,amp:34},{mm2:10,amp:46},{mm2:16,amp:61},{mm2:25,amp:80}],
      Dos_XLPE: [{mm2:1.5,amp:19.5},{mm2:2.5,amp:27},{mm2:4,amp:36},{mm2:6,amp:46},{mm2:10,amp:63},{mm2:16,amp:85},{mm2:25,amp:110},{mm2:35,amp:137},{mm2:50,amp:167},{mm2:70,amp:213},{mm2:95,amp:258},{mm2:120,amp:299},{mm2:150,amp:344},{mm2:185,amp:392},{mm2:240,amp:461}],
      Tres_XLPE: [{mm2:1.5,amp:18.5},{mm2:2.5,amp:25},{mm2:4,amp:34},{mm2:6,amp:43},{mm2:10,amp:60},{mm2:16,amp:80},{mm2:25,amp:101},{mm2:35,amp:126},{mm2:50,amp:153},{mm2:70,amp:196},{mm2:95,amp:238},{mm2:120,amp:276},{mm2:150,amp:318},{mm2:185,amp:362},{mm2:240,amp:424}]
    },
    Aluminio: {
      Dos_PVC: [{mm2:2.5,amp:16.5},{mm2:4,amp:22},{mm2:6,amp:28},{mm2:10,amp:39},{mm2:16,amp:53},{mm2:25,amp:70},{mm2:35,amp:86},{mm2:50,amp:104},{mm2:70,amp:133},{mm2:95,amp:161},{mm2:120,amp:186}],
      Tres_PVC: [{mm2:2.5,amp:15},{mm2:4,amp:20},{mm2:6,amp:26},{mm2:10,amp:36},{mm2:16,amp:48},{mm2:25,amp:63}],
      Dos_XLPE: [{mm2:2.5,amp:21},{mm2:4,amp:28},{mm2:6,amp:36},{mm2:10,amp:49},{mm2:16,amp:66},{mm2:25,amp:83},{mm2:35,amp:103},{mm2:50,amp:125},{mm2:70,amp:160},{mm2:95,amp:195},{mm2:120,amp:226},{mm2:150,amp:261},{mm2:185,amp:298},{mm2:240,amp:352}],
      Tres_XLPE: [{mm2:2.5,amp:19.5},{mm2:4,amp:26},{mm2:6,amp:33},{mm2:10,amp:46},{mm2:16,amp:61},{mm2:25,amp:78},{mm2:35,amp:96},{mm2:50,amp:117},{mm2:70,amp:150},{mm2:95,amp:183},{mm2:120,amp:212},{mm2:150,amp:245},{mm2:185,amp:280},{mm2:240,amp:330}]
    }
  },
  metodo_C: {
    Cobre: {
      Dos_PVC: [
        {mm2:1.5,amp:22},{mm2:2.5,amp:30},{mm2:4,amp:40},{mm2:6,amp:51},
        {mm2:10,amp:70},{mm2:16,amp:94},{mm2:25,amp:119},{mm2:35,amp:148},
        {mm2:50,amp:180},{mm2:70,amp:232},{mm2:95,amp:282},{mm2:120,amp:328}
      ],
      Tres_PVC: [
        {mm2:1.5,amp:20},{mm2:2.5,amp:27},{mm2:4,amp:36},{mm2:6,amp:46},
        {mm2:10,amp:63},{mm2:16,amp:85},{mm2:25,amp:110},{mm2:35,amp:137},
        {mm2:50,amp:167},{mm2:70,amp:214},{mm2:95,amp:261},{mm2:120,amp:300}
      ]
    },
    Aluminio: {
      Dos_PVC: [{mm2:16,amp:48},{mm2:25,amp:63},{mm2:35,amp:77},{mm2:50,amp:94},{mm2:70,amp:120},{mm2:95,amp:146},{mm2:120,amp:169},{mm2:150,amp:195},{mm2:185,amp:221},{mm2:240,amp:260}],
      Tres_PVC: [{mm2:16,amp:43},{mm2:25,amp:57},{mm2:35,amp:70},{mm2:50,amp:86},{mm2:70,amp:110},{mm2:95,amp:133},{mm2:120,amp:154},{mm2:150,amp:178},{mm2:185,amp:201},{mm2:240,amp:236}],
      Dos_XLPE: [{mm2:16,amp:61},{mm2:25,amp:78},{mm2:35,amp:96},{mm2:50,amp:117},{mm2:70,amp:150},{mm2:95,amp:183},{mm2:120,amp:212},{mm2:150,amp:245},{mm2:185,amp:280},{mm2:240,amp:330}],
      Tres_XLPE: [{mm2:16,amp:58},{mm2:25,amp:73},{mm2:35,amp:90},{mm2:50,amp:110},{mm2:70,amp:140},{mm2:95,amp:170},{mm2:120,amp:197},{mm2:150,amp:226},{mm2:185,amp:256},{mm2:240,amp:300}]
    }
  },
  metodo_E: {
    Cobre: {
      Dos_PVC: [{mm2:1.5,amp:22},{mm2:2.5,amp:30},{mm2:4,amp:40},{mm2:6,amp:51},{mm2:10,amp:70},{mm2:16,amp:94},{mm2:25,amp:119},{mm2:35,amp:147},{mm2:50,amp:179},{mm2:70,amp:229},{mm2:95,amp:278},{mm2:120,amp:322},{mm2:150,amp:371},{mm2:185,amp:424},{mm2:240,amp:500}],
      Tres_PVC: [{mm2:1.5,amp:18.5},{mm2:2.5,amp:25},{mm2:4,amp:34},{mm2:6,amp:43},{mm2:10,amp:60},{mm2:16,amp:80},{mm2:25,amp:101},{mm2:35,amp:126},{mm2:50,amp:153},{mm2:70,amp:196},{mm2:95,amp:238},{mm2:120,amp:276},{mm2:150,amp:318},{mm2:185,amp:362},{mm2:240,amp:424}],
      Dos_XLPE: [{mm2:1.5,amp:26},{mm2:2.5,amp:36},{mm2:4,amp:49},{mm2:6,amp:63},{mm2:10,amp:86},{mm2:16,amp:115},{mm2:25,amp:149},{mm2:35,amp:185},{mm2:50,amp:225},{mm2:70,amp:289},{mm2:95,amp:352},{mm2:120,amp:410},{mm2:150,amp:473},{mm2:185,amp:542},{mm2:240,amp:641}],
      Tres_XLPE: [{mm2:1.5,amp:23},{mm2:2.5,amp:31},{mm2:4,amp:42},{mm2:6,amp:54},{mm2:10,amp:75},{mm2:16,amp:100},{mm2:25,amp:127},{mm2:35,amp:158},{mm2:50,amp:192},{mm2:70,amp:246},{mm2:95,amp:298},{mm2:120,amp:346},{mm2:150,amp:395},{mm2:185,amp:450},{mm2:240,amp:538}]
    },
    Aluminio: {
      Dos_PVC: [{mm2:16,amp:61},{mm2:25,amp:78},{mm2:35,amp:96},{mm2:50,amp:117},{mm2:70,amp:150},{mm2:95,amp:183},{mm2:120,amp:212},{mm2:150,amp:245},{mm2:185,amp:280},{mm2:240,amp:330}],
      Tres_PVC: [{mm2:16,amp:53},{mm2:25,amp:70},{mm2:35,amp:86},{mm2:50,amp:104},{mm2:70,amp:133},{mm2:95,amp:161},{mm2:120,amp:186},{mm2:150,amp:213},{mm2:185,amp:240},{mm2:240,amp:277}],
      Dos_XLPE: [{mm2:16,amp:77},{mm2:25,amp:97},{mm2:35,amp:120},{mm2:50,amp:146},{mm2:70,amp:187},{mm2:95,amp:227},{mm2:120,amp:263},{mm2:150,amp:304},{mm2:185,amp:347},{mm2:240,amp:409}],
      Tres_XLPE: [{mm2:16,amp:66},{mm2:25,amp:83},{mm2:35,amp:103},{mm2:50,amp:125},{mm2:70,amp:160},{mm2:95,amp:195},{mm2:120,amp:226},{mm2:150,amp:261},{mm2:185,amp:298},{mm2:240,amp:352}]
    }
  },
  metodo_F: {
    Cobre: {
      Dos_PVC: [{mm2:1.5,amp:23},{mm2:2.5,amp:31},{mm2:4,amp:42},{mm2:6,amp:54},{mm2:10,amp:75},{mm2:16,amp:100},{mm2:25,amp:127},{mm2:35,amp:158},{mm2:50,amp:192},{mm2:70,amp:246},{mm2:95,amp:298},{mm2:120,amp:346},{mm2:150,amp:395},{mm2:185,amp:450},{mm2:240,amp:538}],
      Tres_PVC: [{mm2:1.5,amp:19.5},{mm2:2.5,amp:27},{mm2:4,amp:36},{mm2:6,amp:46},{mm2:10,amp:63},{mm2:16,amp:85},{mm2:25,amp:110},{mm2:35,amp:137},{mm2:50,amp:167},{mm2:70,amp:213},{mm2:95,amp:258},{mm2:120,amp:299},{mm2:150,amp:344},{mm2:185,amp:392},{mm2:240,amp:461}],
      Dos_XLPE: [{mm2:1.5,amp:28},{mm2:2.5,amp:38},{mm2:4,amp:50},{mm2:6,amp:64},{mm2:10,amp:87},{mm2:16,amp:116},{mm2:25,amp:150},{mm2:35,amp:186},{mm2:50,amp:227},{mm2:70,amp:291},{mm2:95,amp:355},{mm2:120,amp:413},{mm2:150,amp:476},{mm2:185,amp:546},{mm2:240,amp:645}],
      Tres_XLPE: [{mm2:1.5,amp:24},{mm2:2.5,amp:33},{mm2:4,amp:45},{mm2:6,amp:58},{mm2:10,amp:80},{mm2:16,amp:107},{mm2:25,amp:135},{mm2:35,amp:169},{mm2:50,amp:207},{mm2:70,amp:268},{mm2:95,amp:328},{mm2:120,amp:382},{mm2:150,amp:441},{mm2:185,amp:506},{mm2:240,amp:599}]
    },
    Aluminio: {
      Dos_PVC: [{mm2:16,amp:66},{mm2:25,amp:83},{mm2:35,amp:103},{mm2:50,amp:125},{mm2:70,amp:160},{mm2:95,amp:195},{mm2:120,amp:226},{mm2:150,amp:261},{mm2:185,amp:298},{mm2:240,amp:352}],
      Tres_PVC: [{mm2:16,amp:58},{mm2:25,amp:73},{mm2:35,amp:90},{mm2:50,amp:110},{mm2:70,amp:140},{mm2:95,amp:170},{mm2:120,amp:197},{mm2:150,amp:226},{mm2:185,amp:256},{mm2:240,amp:300}],
      Dos_XLPE: [{mm2:16,amp:77},{mm2:25,amp:97},{mm2:35,amp:120},{mm2:50,amp:146},{mm2:70,amp:187},{mm2:95,amp:227},{mm2:120,amp:263},{mm2:150,amp:304},{mm2:185,amp:347},{mm2:240,amp:409}],
      Tres_XLPE: []
    }
  }
} as const;

/**
 * TABLA B.52-2 — Método D: Cables directamente enterrados o en ductos subterráneos
 * @norma NC IEC 60364-5-52:2004 Tabla B.52-2
 */
export const TABLA_B52_2 = {
  metodo_D: {
    Cobre: {
      Dos_PVC: [
        {mm2:1.5,amp:22},{mm2:2.5,amp:29},{mm2:4,amp:38},{mm2:6,amp:47},{mm2:10,amp:63},{mm2:16,amp:81},
        {mm2:25,amp:104},{mm2:35,amp:125},{mm2:50,amp:148},{mm2:70,amp:183},{mm2:95,amp:216},
        {mm2:120,amp:246},{mm2:150,amp:278},{mm2:185,amp:312},{mm2:240,amp:361},{mm2:300,amp:408}
      ],
      Tres_PVC: [
        {mm2:1.5,amp:18},{mm2:2.5,amp:24},{mm2:4,amp:31},{mm2:6,amp:39},{mm2:10,amp:52},{mm2:16,amp:67},
        {mm2:25,amp:86},{mm2:35,amp:103},{mm2:50,amp:122},{mm2:70,amp:151},{mm2:95,amp:179},
        {mm2:120,amp:203},{mm2:150,amp:230},{mm2:185,amp:258},{mm2:240,amp:297},{mm2:300,amp:336}
      ],
      Dos_XLPE: [
        {mm2:1.5,amp:26},{mm2:2.5,amp:34},{mm2:4,amp:44},{mm2:6,amp:56},{mm2:10,amp:73},{mm2:16,amp:95},
        {mm2:25,amp:121},{mm2:35,amp:146},{mm2:50,amp:173},{mm2:70,amp:213},{mm2:95,amp:252},
        {mm2:120,amp:287},{mm2:150,amp:324},{mm2:185,amp:363},{mm2:240,amp:419},{mm2:300,amp:474}
      ],
      Tres_XLPE: [
        {mm2:1.5,amp:22},{mm2:2.5,amp:29},{mm2:4,amp:37},{mm2:6,amp:46},{mm2:10,amp:61},{mm2:16,amp:79},
        {mm2:25,amp:101},{mm2:35,amp:122},{mm2:50,amp:144},{mm2:70,amp:178},{mm2:95,amp:211},
        {mm2:120,amp:240},{mm2:150,amp:271},{mm2:185,amp:304},{mm2:240,amp:351},{mm2:300,amp:396}
      ]
    },
    Aluminio: {
      Dos_PVC: [
        {mm2:2.5,amp:22},{mm2:4,amp:29},{mm2:6,amp:36},{mm2:10,amp:48},{mm2:16,amp:62},{mm2:25,amp:80},
        {mm2:35,amp:96},{mm2:50,amp:113},{mm2:70,amp:140},{mm2:95,amp:166},{mm2:120,amp:189},
        {mm2:150,amp:213},{mm2:185,amp:240},{mm2:240,amp:277},{mm2:300,amp:313}
      ],
      Tres_PVC: [
        {mm2:2.5,amp:18.5},{mm2:4,amp:24},{mm2:6,amp:30},{mm2:10,amp:40},{mm2:16,amp:52},{mm2:25,amp:66},
        {mm2:35,amp:80},{mm2:50,amp:94},{mm2:70,amp:117},{mm2:95,amp:138},{mm2:120,amp:157},
        {mm2:150,amp:178},{mm2:185,amp:200},{mm2:240,amp:230},{mm2:300,amp:260}
      ],
      Dos_XLPE: [
        {mm2:2.5,amp:26},{mm2:4,amp:34},{mm2:6,amp:42},{mm2:10,amp:56},{mm2:16,amp:73},{mm2:25,amp:93},
        {mm2:35,amp:112},{mm2:50,amp:132},{mm2:70,amp:163},{mm2:95,amp:193},{mm2:120,amp:220},
        {mm2:150,amp:249},{mm2:185,amp:279},{mm2:240,amp:322},{mm2:300,amp:364}
      ],
      Tres_XLPE: [
        {mm2:2.5,amp:22},{mm2:4,amp:29},{mm2:6,amp:36},{mm2:10,amp:47},{mm2:16,amp:61},{mm2:25,amp:78},
        {mm2:35,amp:94},{mm2:50,amp:112},{mm2:70,amp:138},{mm2:95,amp:164},{mm2:120,amp:186},
        {mm2:150,amp:210},{mm2:185,amp:236},{mm2:240,amp:272},{mm2:300,amp:308}
      ]
    }
  }
} as const;

export const TABLA_B52_3 = [
  {
    item: 1,
    disposicion: 'Empotrados o encerrados',
    factores: {1:1.00, 2:0.80, 3:0.70, 4:0.70, 6:0.55, 9:0.50, 12:0.45, 16:0.40, 20:0.40}
  },
  {
    item: 2,
    disposicion: 'Una capa sobre paredes, pisos o bandejas no perforadas',
    factores: {1:1.00, 2:0.85, 3:0.80, 4:0.75, 6:0.70, 9:0.70}
  },
  {
    item: 3,
    disposicion: 'Una capa fijada directamente debajo del techo',
    factores: {1:0.95, 2:0.80, 3:0.70, 4:0.70, 6:0.65, 9:0.60}
  },
  {
    item: 4,
    disposicion: 'Una capa sobre bandejas horizontales perforadas o bandejas verticales',
    factores: {1:1.00, 2:0.90, 3:0.80, 4:0.75, 6:0.75, 9:0.70}
  },
  {
    item: 5,
    disposicion: 'Una capa sobre soporte de cables tipo escalera o abrazaderas',
    factores: {1:1.00, 2:0.85, 3:0.80, 4:0.80, 6:0.80, 9:0.80}
  }
] as const;

export const TABLA_IMPEDANCIAS = [
  {mm2:1.5, R_ohm_km:12.10, X_ohm_km:0.177},
  {mm2:2.5, R_ohm_km:7.41,  X_ohm_km:0.166},
  {mm2:4,   R_ohm_km:4.61,  X_ohm_km:0.157},
  {mm2:6,   R_ohm_km:3.08,  X_ohm_km:0.149},
  {mm2:10,  R_ohm_km:1.83,  X_ohm_km:0.143},
  {mm2:16,  R_ohm_km:1.15,  X_ohm_km:0.138},
  {mm2:25,  R_ohm_km:0.727, X_ohm_km:0.127},
  {mm2:35,  R_ohm_km:0.524, X_ohm_km:0.119},
  {mm2:50,  R_ohm_km:0.387, X_ohm_km:0.119},
  {mm2:70,  R_ohm_km:0.268, X_ohm_km:0.114},
  {mm2:95,  R_ohm_km:0.193, X_ohm_km:0.110},
  {mm2:120, R_ohm_km:0.153, X_ohm_km:0.107},
  {mm2:150, R_ohm_km:0.124, X_ohm_km:0.107},
  {mm2:185, R_ohm_km:0.0991,X_ohm_km:0.106},
  {mm2:240, R_ohm_km:0.0754,X_ohm_km:0.100}
] as const;

export const TABLA_MOTORES_FLA = [
  {hp:0.5,  kw:0.37,  v220:2.2,  v380:1.3,  v440:1.1},
  {hp:1.0,  kw:0.75,  v220:4.2,  v380:2.4,  v440:2.1},
  {hp:1.5,  kw:1.1,   v220:6.0,  v380:3.5,  v440:3.0},
  {hp:2.0,  kw:1.5,   v220:7.5,  v380:4.3,  v440:3.8},
  {hp:3.0,  kw:2.2,   v220:10.6, v380:6.1,  v440:5.3},
  {hp:5.0,  kw:3.7,   v220:15.2, v380:8.8,  v440:7.6},
  {hp:7.5,  kw:5.5,   v220:22.0, v380:12.7, v440:11.0},
  {hp:10.0, kw:7.5,   v220:28.0, v380:16.2, v440:14.0},
  {hp:15.0, kw:11.0,  v220:42.0, v380:24.2, v440:21.0},
  {hp:20.0, kw:15.0,  v220:54.0, v380:31.2, v440:27.0},
  {hp:25.0, kw:18.5,  v220:68.0, v380:39.2, v440:34.0},
  {hp:30.0, kw:22.0,  v220:80.0, v380:46.2, v440:40.0}
] as const;

export const TABLA_TUBERIAS = [
  {nombre:'Conduit 1/2"', diametro_mm:16, area_total_mm2:196,  area_util_53:104, area_util_31:61,  area_util_40:78},
  {nombre:'Conduit 3/4"', diametro_mm:21, area_total_mm2:342,  area_util_53:181, area_util_31:106, area_util_40:137},
  {nombre:'Conduit 1"',   diametro_mm:27, area_total_mm2:547,  area_util_53:290, area_util_31:170, area_util_40:219},
  {nombre:'Conduit 1¼"', diametro_mm:35, area_total_mm2:951,  area_util_53:504, area_util_31:295, area_util_40:380},
  {nombre:'Conduit 1½"', diametro_mm:41, area_total_mm2:1314, area_util_53:696, area_util_31:407, area_util_40:526},
  {nombre:'Conduit 2"',   diametro_mm:53, area_total_mm2:2165, area_util_53:1147,area_util_31:671, area_util_40:866}
] as const;

export const AREAS_CONDUCTORES_MM2: Record<number, number> = {
  1.5:8.11, 2.5:13.48, 4:20.43, 6:28.89,
  10:51.87, 16:81.07, 25:126.7, 35:166.3,
  50:229.7, 70:352.0, 95:483.1, 120:616.8
};

const FACTORES_TEMP_PVC: Record<number, number> = {
  10:1.22, 15:1.17, 20:1.12, 25:1.06,
  30:1.00, 35:0.94, 40:0.87, 45:0.79,
  50:0.71, 55:0.61, 60:0.50
};

const FACTORES_TEMP_XLPE: Record<number, number> = {
  10:1.15, 15:1.12, 20:1.08, 25:1.04,
  30:1.00, 35:0.96, 40:0.91, 45:0.87,
  50:0.82, 55:0.76, 60:0.71
};

/**
 * Factores de corrección para temperatura del suelo (Método D)
 * Referencia: 20°C para cables PVC de 70mm²
 */
const FACTORES_TEMP_SUELO_PVC: Record<number, number> = {
  10:1.10, 15:1.05, 20:1.00, 25:0.95,
  30:0.89, 35:0.84, 40:0.77, 45:0.71, 50:0.63
};

/**
 * Factores de corrección para temperatura del suelo (Método D)
 * Referencia: 20°C para cables XLPE de 70mm²
 */
const FACTORES_TEMP_SUELO_XLPE: Record<number, number> = {
  10:1.07, 15:1.04, 20:1.00, 25:0.96,
  30:0.93, 35:0.89, 40:0.85, 45:0.80, 50:0.76
};

/**
 * Factores de corrección para resistividad térmica del suelo (Método D)
 * Referencia: 2.5 K·m/W (resistividad normal según NC IEC 60364-5-52)
 */
const FACTORES_RESIST_TERMICA: Record<number, number> = {
  0.5:1.28, 0.7:1.20, 1.0:1.18, 1.5:1.10,
  2.0:1.05, 2.5:1.00, 3.0:0.96
};

/**
 * Factores de agrupamiento para cables enterrados en paralelo (Método D)
 * Referencia: separación 0.7m entre circuitos
 */
const FACTORES_AGRUPAMIENTO_D: Record<number, number> = {
  1:1.00, 2:0.80, 3:0.70, 4:0.65, 5:0.60, 6:0.57
};

// ============================================================
// INTERFACES PARA MÓDULOS AVANZADOS
// ============================================================

export interface CalculoAmpacidad {
  seccion: number;
  material: 'Cobre' | 'Aluminio';
  metodo: 'metodo_A1' | 'metodo_A2' | 'metodo_B1' | 'metodo_B2' | 'metodo_C' | 'metodo_E' | 'metodo_F';
  aislamiento: 'Dos_PVC' | 'Tres_PVC' | 'Dos_XLPE' | 'Tres_XLPE';
  temperaturaAmbiente: number;
  numCircuitos: number;
  disposicion: string;
}

/**
 * Parámetros para cálculo de ampacidad con cables enterrados (Método D)
 * @norma NC IEC 60364-5-52:2004 Tabla B.52-2
 */
export interface CalculoAmpacidadMetodoD {
  seccion: number;
  material: 'Cobre' | 'Aluminio';
  aislamiento: 'Dos_PVC' | 'Tres_PVC' | 'Dos_XLPE' | 'Tres_XLPE';
  temperaturaTerreno: number;  // °C — default 20
  resistividadTermica: number; // K·m/W — default 2.5
  numCircuitos: number;        // circuitos paralelos — default 1, máx 6
}

export interface CalculoCaidaTensionRX {
  seccion: number;
  longitud: number;
  corriente: number;
  voltaje: number;
  cosPhi: number;
  sistema: 'monofasico' | 'trifasico';
}

export interface CalculoMotorFLA {
  hp: number;
  tension: 220 | 380 | 440;
  tipoArranque: 'directo' | 'estrella-triangulo' | 'variador' | 'ITM';
  metodoInstalacion: 'metodo_A1' | 'metodo_B1' | 'metodo_C';
  temperaturaAmbiente: number;
  numCircuitos: number;
}

export interface ConductorInput {
  seccion: number;
  cantidad: number;
}

export interface CalculoConduitParams {
  conductores: ConductorInput[];
}

// ============================================================
// FUNCIONES DE CÁLCULO AVANZADO
// ============================================================

/**
 * Interpola linealmente entre dos valores
 */
function interpolar(x: number, x1: number, y1: number, x2: number, y2: number): number {
  return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
}

/**
 * Obtiene el factor de temperatura más cercano o interpolado
 */
function obtenerFactorTemperatura(temp: number, esPVC: boolean): number {
  const factores = esPVC ? FACTORES_TEMP_PVC : FACTORES_TEMP_XLPE;
  const temps = Object.keys(factores).map(Number).sort((a, b) => a - b);
  
  if (temp in factores) {
    return factores[temp];
  }
  
  const tempMenor = temps.find(t => t < temp);
  const tempMayor = temps.find(t => t > temp);
  
  if (tempMenor === undefined) return factores[temps[0]];
  if (tempMayor === undefined) return factores[temps[temps.length - 1]];
  
  return interpolar(temp, tempMenor, factores[tempMenor], tempMayor, factores[tempMayor]);
}

/**
 * Obtiene el factor de agrupamiento y valida límites de circuitos
 * @throws Error si el número de circuitos excede el máximo para la disposición
 */
function obtenerFactorAgrupamiento(numCircuitos: number, disposicion: string): number {
  const fila = TABLA_B52_3.find(f => f.disposicion === disposicion);
  if (!fila) throw new Error('Disposición no válida');
  
  const niveles = Object.keys(fila.factores).map(Number).sort((a, b) => a - b);
  const maxNiveles = Math.max(...niveles);
  
  if (numCircuitos > maxNiveles) {
    throw new Error(
      `La disposición "${disposicion}" no tiene factor definido para más de ${maxNiveles} circuitos ` +
      `según NC IEC 60364-5-52:2004`
    );
  }
  
  const nivel = niveles.find(n => n >= numCircuitos) || niveles[niveles.length - 1];
  return fila.factores[nivel as keyof typeof fila.factores];
}

/**
 * Calcula la ampacidad corregida Iz = Ia × Ft × Fg
 * @param seccion Sección en mm²
 * @param material Material del conductor
 * @param metodo Método de instalación (A1, B1, C)
 * @param aislamiento Tipo de aislamiento y conductores
 * @param temperaturaAmbiente °C
 * @param numCircuitos Número de circuitos agrupados
 * @param disposicion Disposición física de los cables
 * @returns Iz en Amperios
 * @norma NC 800 / NC IEC 60364-5-52 Tabla B.52.1, B.52.3
 */
export function calcularAmpacidadCorregida(params: CalculoAmpacidad): ResultadoCalculo {
  const { seccion, material, metodo, aislamiento, temperaturaAmbiente, numCircuitos, disposicion } = params;
  
  // Paso 1: Buscar Ia en tabla
  const metodoData = TABLA_B52_1[metodo];
  if (!metodoData) throw new Error('Método de instalación no válido');
  
  const materialData = metodoData[material as keyof typeof metodoData];
  if (!materialData) throw new Error('Material no disponible para este método');
  
  const aislamientoData = materialData[aislamiento as keyof typeof materialData];
  if (!aislamientoData) throw new Error('Combinación de aislamiento no disponible');
  
  const fila = aislamientoData.find((f: {mm2: number; amp: number}) => f.mm2 === seccion);
  if (!fila) throw new Error(`Sección ${seccion}mm² no disponible para esta combinación`);
  const Ia = fila.amp;
  
  // Paso 2: Factor de temperatura
  const esPVC = aislamiento.includes('PVC');
  const Ft = obtenerFactorTemperatura(temperaturaAmbiente, esPVC);
  
  // Paso 3: Factor de agrupamiento
  const Fg = obtenerFactorAgrupamiento(numCircuitos, disposicion);
  
  // Paso 4: Ampacidad corregida
  const Iz = Ia * Ft * Fg;
  
  return {
    valor: Math.round(Iz * 10) / 10,
    unidad: 'A',
    formula: 'Iz = Ia × Ft × Fg',
    nota: `Ia=${Ia}A (tabla) × Ft=${Ft.toFixed(2)} (${temperaturaAmbiente}°C) × Fg=${Fg.toFixed(2)} (${numCircuitos} circuitos)`
  };
}

/**
 * Calcula caída de tensión considerando resistencia R y reactancia X
 * @param seccion Sección en mm²
 * @param longitud Longitud en metros
 * @param corriente Corriente en A
 * @param voltaje Tensión nominal en V
 * @param cosPhi Factor de potencia
 * @param sistema Monofásico o trifásico
 * @returns dV en porcentaje
 * @norma NC 800
 */
export function calcularCaidaTensionRX(params: CalculoCaidaTensionRX): ResultadoCalculo {
  const { seccion, longitud, corriente, voltaje, cosPhi, sistema } = params;
  
  // Paso 1: Buscar impedancia
  const imp = TABLA_IMPEDANCIAS.find(f => f.mm2 === seccion);
  if (!imp) throw new Error(`Sección ${seccion}mm² no disponible`);
  
  const R = imp.R_ohm_km;
  const X = imp.X_ohm_km;
  const senPhi = Math.sqrt(1 - cosPhi ** 2);
  const L_km = longitud / 1000;
  
  // Paso 2 y 3: Calcular caída de tensión
  let dV_V: number;
  let formula: string;
  
  if (sistema === 'monofasico') {
    dV_V = 2 * L_km * corriente * (R * cosPhi + X * senPhi);
    formula = 'dV% = (2 × L × I × (R×cosφ + X×senφ)) / V × 100';
  } else {
    dV_V = Math.sqrt(3) * L_km * corriente * (R * cosPhi + X * senPhi);
    formula = 'dV% = (√3 × L × I × (R×cosφ + X×senφ)) / V × 100';
  }
  
  const dV_pct = (dV_V / voltaje) * 100;
  
  // Paso 4: Evaluar cumplimiento
  let nota: string;
  if (dV_pct <= 3) {
    nota = '✓ Cumple iluminación y fuerza (≤3%)';
  } else if (dV_pct <= 5) {
    nota = '⚠️ Solo cumple fuerza motriz (≤5%). No apta para iluminación';
  } else {
    nota = '✗ No cumple ningún límite normativo NC 800';
  }
  
  return {
    valor: Math.round(dV_pct * 100) / 100,
    unidad: '%',
    formula,
    nota: `R=${R.toFixed(3)}Ω/km, X=${X.toFixed(3)}Ω/km, ΔV=${dV_V.toFixed(2)}V. ${nota}`
  };
}

/**
 * Obtiene factor de temperatura para suelo (Método D)
 */
function obtenerFactorTemperaturaSuelo(temp: number, esPVC: boolean): number {
  const factores = esPVC ? FACTORES_TEMP_SUELO_PVC : FACTORES_TEMP_SUELO_XLPE;
  const temps = Object.keys(factores).map(Number).sort((a, b) => a - b);
  
  if (temp in factores) {
    return factores[temp];
  }
  
  const tempMenor = temps.find(t => t < temp);
  const tempMayor = temps.find(t => t > temp);
  
  if (tempMenor === undefined) return factores[temps[0]];
  if (tempMayor === undefined) return factores[temps[temps.length - 1]];
  
  return interpolar(temp, tempMenor, factores[tempMenor], tempMayor, factores[tempMayor]);
}

/**
 * Obtiene factor de resistividad térmica del suelo (Método D)
 */
function obtenerFactorResistividadTermica(resistividad: number): number {
  const temores = Object.keys(FACTORES_RESIST_TERMICA).map(Number).sort((a, b) => a - b);
  
  if (resistividad in FACTORES_RESIST_TERMICA) {
    return FACTORES_RESIST_TERMICA[resistividad];
  }
  
  const resMenor = temores.find(r => r < resistividad);
  const resMayor = temores.find(r => r > resistividad);
  
  if (resMenor === undefined) return FACTORES_RESIST_TERMICA[temores[0]];
  if (resMayor === undefined) return FACTORES_RESIST_TERMICA[temores[temores.length - 1]];
  
  return interpolar(
    resistividad,
    resMenor,
    FACTORES_RESIST_TERMICA[resMenor],
    resMayor,
    FACTORES_RESIST_TERMICA[resMayor]
  );
}

/**
 * Obtiene factor de agrupamiento para cables enterrados (Método D)
 */
function obtenerFactorAgrupamientoD(numCircuitos: number): number {
  if (numCircuitos > 6) {
    throw new Error(
      'El número máximo de circuitos enterrados en paralelo es 6 según NC IEC 60364-5-52:2004'
    );
  }
  
  const nivel = Object.keys(FACTORES_AGRUPAMIENTO_D)
    .map(Number)
    .sort((a, b) => a - b)
    .find(n => n >= numCircuitos) || 6;
  
  return FACTORES_AGRUPAMIENTO_D[nivel];
}

/**
 * Calcula ampacidad para cables directamente enterrados (Método D)
 * @param seccion Sección en mm²
 * @param material Material del conductor (Cobre o Aluminio)
 * @param aislamiento Tipo de aislamiento y número de conductores
 * @param temperaturaTerreno Temperatura del suelo en °C (rango 10-50)
 * @param resistividadTermica Resistividad térmica del suelo K·m/W
 * @param numCircuitos Número de circuitos enterrados en paralelo (máx 6)
 * @returns Iz en Amperios
 * @formula Iz = Ia × Ft × Fr × Fg
 * @norma NC IEC 60364-5-52:2004 Tabla B.52-2, Tabla B.52-3
 */
export function calcularAmpacidadMetodoD(params: CalculoAmpacidadMetodoD): ResultadoCalculo {
  const { seccion, material, aislamiento, temperaturaTerreno, resistividadTermica, numCircuitos } = params;
  
  // Validación de rango de temperaturaTerreno
  if (temperaturaTerreno < 10 || temperaturaTerreno > 50) {
    throw new Error('La temperatura del terreno debe estar entre 10°C y 50°C');
  }
  
  // Validación de resistividad térmica
  if (resistividadTermica < 0.5 || resistividadTermica > 3.0) {
    throw new Error('La resistividad térmica debe estar entre 0.5 y 3.0 K·m/W');
  }
  
  // Paso 1: Buscar Ia en TABLA_B52_2
  const metodoD = TABLA_B52_2.metodo_D;
  const materialData = metodoD[material as keyof typeof metodoD];
  if (!materialData) throw new Error('Material no disponible para Método D');
  
  const aislamientoData = materialData[aislamiento as keyof typeof materialData];
  if (!aislamientoData) throw new Error('Combinación de aislamiento no disponible para Método D');
  
  const fila = aislamientoData.find((f: {mm2: number; amp: number}) => f.mm2 === seccion);
  if (!fila) throw new Error(`Sección ${seccion}mm² no disponible para esta combinación en Método D`);
  const Ia = fila.amp;
  
  // Paso 2: Factor de temperatura del suelo
  const esPVC = aislamiento.includes('PVC');
  const Ft = obtenerFactorTemperaturaSuelo(temperaturaTerreno, esPVC);
  
  // Paso 3: Factor de resistividad térmica
  const Fr = obtenerFactorResistividadTermica(resistividadTermica);
  
  // Paso 4: Factor de agrupamiento (circuitos paralelos)
  const Fg = obtenerFactorAgrupamientoD(numCircuitos);
  
  // Paso 5: Ampacidad corregida
  const Iz = Ia * Ft * Fr * Fg;
  
  return {
    valor: Math.round(Iz * 10) / 10,
    unidad: 'A',
    formula: 'Iz = Ia × Ft × Fr × Fg',
    nota: `Ia=${Ia}A (tabla D) × Ft=${Ft.toFixed(2)} (${temperaturaTerreno}°C suelo) × Fr=${Fr.toFixed(2)} (${resistividadTermica} K·m/W) × Fg=${Fg.toFixed(2)} (${numCircuitos} circuitos) — NC IEC 60364-5-52:2004 Tabla B.52-2`
  };
}

/**
 * Calcula alimentación completa de motor por lookup FLA real
 * @param hp Potencia en caballos de fuerza
 * @param tension Tensión de alimentación en V
 * @param tipoArranque Tipo de arranque
 * @param metodoInstalacion Método para selección de cable
 * @returns Objeto con FLA, conductor, ITM y contactor
 * @norma NC 804 / NC 800
 */
export function calcularMotorPorFLA(params: CalculoMotorFLA): ResultadoCalculo {
  const { hp, tension, tipoArranque, metodoInstalacion, temperaturaAmbiente, numCircuitos } = params;
  
  // Paso 1: FLA
  const fila = TABLA_MOTORES_FLA.find(f => f.hp === hp);
  if (!fila) throw new Error(`HP ${hp} no disponible en tabla`);
  
  const FLA = tension === 220 ? fila.v220 : tension === 440 ? fila.v440 : fila.v380;
  
  // Paso 2: Conductor
  const I_conductor = FLA * 1.25;
  const aislamientoData = TABLA_B52_1[metodoInstalacion].Cobre.Tres_PVC;
  let seccionCable = aislamientoData.find(f => f.amp >= I_conductor);
  if (!seccionCable) {
    seccionCable = aislamientoData[aislamientoData.length - 1];
  }
  
  const Ft = obtenerFactorTemperatura(temperaturaAmbiente, true);
  const Fg = obtenerFactorAgrupamiento(numCircuitos, 'Empotrados o encerrados');
  const Iz = seccionCable.amp * Ft * Fg;
  
  // Paso 3: Protección ITM
  const factoresITM: Record<string, number> = {
    'directo': 2.5,
    'ITM': 2.5,
    'estrella-triangulo': 1.5,
    'variador': 1.25
  };
  const I_proteccion = FLA * factoresITM[tipoArranque];
  const ITM_comerciales = [6,10,16,20,25,32,40,50,63,80,100,125,160,200,250];
  const ITM_elegido = ITM_comerciales.find(v => v >= I_proteccion) || 250;
  
  // Paso 4: Contactor
  const contactor = [9, 12, 18, 25, 32, 40, 50, 65, 85, 115, 150, 180, 210, 260, 320, 400];
  const contactorElegido = contactor.find(v => v >= FLA) || 400;
  
  const nota = `FLA: ${FLA}A | Cable: ${seccionCable.mm2}mm² (Iz=${Iz.toFixed(1)}A) | ITM: ${ITM_elegido}A | Contactor: ${contactorElegido}A`;
  
  return {
    valor: FLA,
    unidad: 'A',
    formula: 'FLA lookup tabla',
    nota
  };
}

/**
 * Selecciona el conduit mínimo necesario
 * @param conductores Array de {seccion, cantidad}
 * @returns Conduit recomendado con % ocupación
 * @norma NC 800 / NEC Art. 358
 */
export function seleccionarConduit(params: CalculoConduitParams): ResultadoCalculo {
  const { conductores } = params;
  
  // Paso 1: Calcular área total
  let areaTotal = 0;
  for (const c of conductores) {
    const area = AREAS_CONDUCTORES_MM2[c.seccion];
    if (!area) throw new Error(`Sección ${c.seccion}mm² no disponible`);
    areaTotal += area * c.cantidad;
  }
  
  // Paso 2: Factor de llenado
  const numTotal = conductores.reduce((sum, c) => sum + c.cantidad, 0);
  let factorLlenado: number;
  if (numTotal === 1) factorLlenado = 0.53;
  else if (numTotal === 2) factorLlenado = 0.31;
  else factorLlenado = 0.40;
  
  // Paso 3: Buscar conduit
  const conduit = TABLA_TUBERIAS.find(t => t.area_total_mm2 * factorLlenado >= areaTotal);
  if (!conduit) throw new Error('Conductores exceden conduit 2". Dividir en varios tubos.');
  
  // Paso 4: % ocupación real
  const ocupacionReal = (areaTotal / conduit.area_total_mm2) * 100;
  
  return {
    valor: Math.round(ocupacionReal * 10) / 10,
    unidad: '%',
    formula: 'Ocupación = (Área conductores / Área conduit) × 100',
    nota: `Área total: ${areaTotal.toFixed(1)}mm² | Factor: ${(factorLlenado*100).toFixed(0)}% | Conduit: ${conduit.nombre} (${conduit.area_total_mm2}mm²)`
  };
}
