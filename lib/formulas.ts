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
