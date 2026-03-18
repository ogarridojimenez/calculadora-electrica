import {
  calcularOhm,
  calcularPotenciaMonofasica,
  calcularPotenciaTrifasica,
  calcularCadaTension,
  calcularSeccionConductor,
  calcularProteccionMagnetotermica,
  calcularCorreccionFactorPotencia,
  calcularResistividadSuelo,
} from "@/lib/formulas";

describe("Ley de Ohm", () => {
  test("calcula voltaje: V = I × R", () => {
    const result = calcularOhm({ i: 2, r: 10 });
    expect(result.valor).toBe(20);
    expect(result.unidad).toBe("V");
    expect(result.formula).toBe("V = I × R");
  });

  test("calcula corriente: I = V / R", () => {
    const result = calcularOhm({ v: 24, r: 8 });
    expect(result.valor).toBe(3);
    expect(result.unidad).toBe("A");
    expect(result.formula).toBe("I = V / R");
  });

  test("calcula resistencia: R = V / I", () => {
    const result = calcularOhm({ v: 12, i: 4 });
    expect(result.valor).toBe(3);
    expect(result.unidad).toBe("Ω");
    expect(result.formula).toBe("R = V / I");
  });

  test("lanza error si no hay exactamente 2 valores", () => {
    expect(() => calcularOhm({ v: 12 })).toThrow("Debes proporcionar exactamente 2 valores");
  });

  test("lanza error si la corriente es 0 al calcular voltaje", () => {
    expect(() => calcularOhm({ i: 0, r: 10 })).toThrow("La corriente no puede ser 0");
  });

  test("lanza error si la resistencia es 0 al calcular corriente", () => {
    expect(() => calcularOhm({ v: 12, r: 0 })).toThrow("La resistencia no puede ser 0");
  });
});

describe("Potencia Monofásica", () => {
  test("calcula potencia: P = V × I × cos(φ)", () => {
    const result = calcularPotenciaMonofasica({ voltaje: 220, corriente: 10, fp: 0.9 });
    expect(result.valor).toBeCloseTo(1980);
    expect(result.unidad).toBe("W");
  });

  test("calcula corriente: I = P / (V × cos(φ))", () => {
    const result = calcularPotenciaMonofasica({ voltaje: 220, potencia: 2200, fp: 1 });
    expect(result.valor).toBeCloseTo(10);
    expect(result.unidad).toBe("A");
  });

  test("calcula voltaje: V = P / (I × cos(φ))", () => {
    const result = calcularPotenciaMonofasica({ corriente: 10, potencia: 2200, fp: 1 });
    expect(result.valor).toBeCloseTo(220);
    expect(result.unidad).toBe("V");
  });

  test("lanza error si no hay exactamente 2 valores", () => {
    expect(() => calcularPotenciaMonofasica({ voltaje: 220 })).toThrow("Debes proporcionar exactamente 2 valores");
  });
});

describe("Potencia Trifásica", () => {
  test("calcula potencia con valores esperados", () => {
    const result = calcularPotenciaTrifasica({ voltajeLinea: 380, corriente: 30, fp: 0.9 });
    expect(result.valor).toBeGreaterThan(17000);
    expect(result.valor).toBeLessThan(18000);
    expect(result.unidad).toBe("W");
  });

  test("calcula corriente con valores esperados", () => {
    const result = calcularPotenciaTrifasica({ voltajeLinea: 380, potencia: 20000, fp: 1 });
    expect(result.valor).toBeGreaterThan(29);
    expect(result.valor).toBeLessThan(31);
    expect(result.unidad).toBe("A");
  });

  test("calcula voltaje con valores esperados", () => {
    const result = calcularPotenciaTrifasica({ corriente: 30, potencia: 20000, fp: 1 });
    expect(result.valor).toBeGreaterThan(380);
    expect(result.valor).toBeLessThan(390);
    expect(result.unidad).toBe("V");
  });

  test("lanza error si no hay exactamente 2 valores", () => {
    expect(() => calcularPotenciaTrifasica({ voltajeLinea: 380 })).toThrow("Debes proporcionar exactamente 2 valores");
  });
});

describe("Caída de Tensión", () => {
  test("calcula caída de tensión en porcentaje para cobre", () => {
    const result = calcularCadaTension({
      voltaje: 220,
      corriente: 10,
      longitud: 50,
      seccion: 2.5,
      material: "cobre",
      fc: 1,
    });
    expect(result.unidad).toBe("%");
    expect(result.valor).toBeGreaterThan(0);
  });

  test("cumple con NC 800 para caída ≤ 3%", () => {
    const result = calcularCadaTension({
      voltaje: 220,
      corriente: 5,
      longitud: 30,
      seccion: 4,
      material: "cobre",
      fc: 1,
    });
    expect(result.valor).toBeLessThanOrEqual(3);
  });

  test("calcula para aluminio", () => {
    const result = calcularCadaTension({
      voltaje: 220,
      corriente: 10,
      longitud: 50,
      seccion: 2.5,
      material: "aluminio",
      fc: 1,
    });
    expect(result.unidad).toBe("%");
    expect(result.valor).toBeGreaterThan(0);
  });
});

describe("Sección de Conductor", () => {
  test("calcula sección para cobre 25A", () => {
    const result = calcularSeccionConductor({
      corriente: 25,
      tipoCircuito: "fuerza",
      metodoInstalacion: 1,
      material: "cobre",
      temperatura: 30,
    });
    expect(result.unidad).toBe("mm²");
    expect(result.valor).toBeGreaterThanOrEqual(0.5);
  });

  test("selecciona sección comercial adecuada", () => {
    const result = calcularSeccionConductor({
      corriente: 30,
      tipoCircuito: "fuerza",
      metodoInstalacion: 1,
      material: "cobre",
      temperatura: 30,
    });
    const seccionesComerciales = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
    expect(seccionesComerciales).toContain(result.valor);
  });
});

describe("Protección Magnetotérmica", () => {
  test("calcula protección para circuito general", () => {
    const result = calcularProteccionMagnetotermica({
      corriente: 16,
      tipoCarga: "general",
    });
    expect(result.unidad).toBe("A");
    expect(result.valor).toBeGreaterThanOrEqual(16);
  });

  test("calcula protección para motores con multiplicador mayor", () => {
    const general = calcularProteccionMagnetotermica({ corriente: 16, tipoCarga: "general" });
    const motores = calcularProteccionMagnetotermica({ corriente: 16, tipoCarga: "motores" });
    expect(motores.valor).toBeGreaterThan(general.valor);
  });

  test("selecciona protección comercial", () => {
    const proteccionesComerciales = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
    const result = calcularProteccionMagnetotermica({
      corriente: 25,
      tipoCarga: "general",
    });
    expect(proteccionesComerciales).toContain(result.valor);
  });
});

describe("Corrección del Factor de Potencia", () => {
  test("calcula banco de capacitores", () => {
    const result = calcularCorreccionFactorPotencia({
      potenciaActiva: 100,
      fpActual: 0.7,
      fpDeseado: 0.95,
      voltaje: 220,
    });
    expect(result.unidad).toBe("kVAR");
    expect(result.valor).toBeGreaterThan(0);
  });

  test("FP mejorado requiere menos compensación", () => {
    const fpBajo = calcularCorreccionFactorPotencia({
      potenciaActiva: 100,
      fpActual: 0.6,
      fpDeseado: 0.95,
      voltaje: 220,
    });
    const fpAlto = calcularCorreccionFactorPotencia({
      potenciaActiva: 100,
      fpActual: 0.8,
      fpDeseado: 0.95,
      voltaje: 220,
    });
    expect(fpBajo.valor).toBeGreaterThan(fpAlto.valor);
  });

  test("redondea a múltiplos de 5 kVAR", () => {
    const result = calcularCorreccionFactorPotencia({
      potenciaActiva: 100,
      fpActual: 0.7,
      fpDeseado: 0.95,
      voltaje: 220,
    });
    expect(result.valor % 5).toBe(0);
  });
});

describe("calcularResistividadSuelo", () => {
  test("retorna valores correctos según tipo de suelo", () => {
    expect(calcularResistividadSuelo("pantano")).toBe(200);
    expect(calcularResistividadSuelo("arcilla")).toBe(1000);
    expect(calcularResistividadSuelo("arena")).toBe(5000);
  });

  test("retorna valor por defecto para tipo desconocido", () => {
    expect(calcularResistividadSuelo("desconocido")).toBe(1000);
  });
});
