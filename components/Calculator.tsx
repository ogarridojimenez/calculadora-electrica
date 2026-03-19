"use client";

import { useState } from "react";
import {
  Zap,
  Gauge,
  CircleDot,
  Cable,
  Layers,
  Shield,
  Anchor,
  Percent,
  ChevronLeft,
  Menu,
  Info,
  BookOpen,
  Sun,
  Moon,
  Clock,
} from "lucide-react";
import { CalculoOhm } from "./calculations/CalculoOhm";
import { CalculoPotenciaMonofasica } from "./calculations/CalculoPotenciaMonofasica";
import { CalculoPotenciaTrifasica } from "./calculations/CalculoPotenciaTrifasica";
import { CalculoCadaTension } from "./calculations/CalculoCadaTension";
import { CalculoSeccionConductor } from "./calculations/CalculoSeccionConductor";
import { CalculoProteccion } from "./calculations/CalculoProteccion";
import { CalculoPuestaTierra } from "./calculations/CalculoPuestaTierra";
import { CalculoFactorPotencia } from "./calculations/CalculoFactorPotencia";
import { useTheme } from "./ThemeProvider";
import { useHistory } from "./HistoryProvider";

type TipoCalculo =
  | "ohm"
  | "potencia-monofasica"
  | "potencia-trifasica"
  | "cada-tension"
  | "seccion-conductor"
  | "proteccion"
  | "puesta-tierra"
  | "factor-potencia";

interface OpcionMenu {
  id: TipoCalculo;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  norma: string;
  categoria: "basico" | "distribucion" | "proteccion";
}

const menuItems: OpcionMenu[] = [
  {
    id: "ohm",
    titulo: "Ley de Ohm",
    descripcion: "V, I, R",
    icono: <CircleDot size={20} strokeWidth={1.5} />,
    norma: "",
    categoria: "basico",
  },
  {
    id: "potencia-monofasica",
    titulo: "Potencia Monofásica",
    descripcion: "P = V × I × cos(φ)",
    icono: <Gauge size={20} strokeWidth={1.5} />,
    norma: "NC 800",
    categoria: "basico",
  },
  {
    id: "potencia-trifasica",
    titulo: "Potencia Trifásica",
    descripcion: "P = √3 × V_L × I × cos(φ)",
    icono: <Zap size={20} strokeWidth={1.5} />,
    norma: "NC 800",
    categoria: "basico",
  },
  {
    id: "cada-tension",
    titulo: "Caída de Tensión",
    descripcion: "Verificación 3% / 5%",
    icono: <Cable size={20} strokeWidth={1.5} />,
    norma: "NC 800",
    categoria: "distribucion",
  },
  {
    id: "seccion-conductor",
    titulo: "Sección Conductor",
    descripcion: "Dimensionamiento",
    icono: <Layers size={20} strokeWidth={1.5} />,
    norma: "NC 800",
    categoria: "distribucion",
  },
  {
    id: "proteccion",
    titulo: "Protección",
    descripcion: "Interruptor magnetotérmico",
    icono: <Shield size={20} strokeWidth={1.5} />,
    norma: "NC 801",
    categoria: "proteccion",
  },
  {
    id: "puesta-tierra",
    titulo: "Puesta a Tierra",
    descripcion: "R ≤ 25 Ω",
    icono: <Anchor size={20} strokeWidth={1.5} />,
    norma: "NC 802",
    categoria: "proteccion",
  },
  {
    id: "factor-potencia",
    titulo: "Factor de Potencia",
    descripcion: "Banco de capacitores",
    icono: <Percent size={20} strokeWidth={1.5} />,
    norma: "",
    categoria: "basico",
  },
];

const categorias = [
  { key: "basico", label: "Cálculos Básicos" },
  { key: "distribucion", label: "Distribución" },
  { key: "proteccion", label: "Protección" },
] as const;

export default function Calculator() {
  const [calculoActivo, setCalculoActivo] = useState<TipoCalculo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { togglePanel, history } = useHistory();

  const opcionSeleccionada = menuItems.find((item) => item.id === calculoActivo);

  const renderCalculo = () => {
    switch (calculoActivo) {
      case "ohm":
        return <CalculoOhm />;
      case "potencia-monofasica":
        return <CalculoPotenciaMonofasica />;
      case "potencia-trifasica":
        return <CalculoPotenciaTrifasica />;
      case "cada-tension":
        return <CalculoCadaTension />;
      case "seccion-conductor":
        return <CalculoSeccionConductor />;
      case "proteccion":
        return <CalculoProteccion />;
      case "puesta-tierra":
        return <CalculoPuestaTierra />;
      case "factor-potencia":
        return <CalculoFactorPotencia />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface-base)]">
      {/* Mobile Header - siempre visible en móvil */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--surface-raised)] border-b border-[var(--border-default)] flex items-center px-4 z-40 justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-[var(--surface-base)] text-[var(--text-secondary)] -ml-2"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-7 h-7 rounded-md bg-[var(--electric-cyan)] flex items-center justify-center">
              <Zap size={14} color="white" strokeWidth={2} />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">CalcEléc</span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-[var(--surface-base)] text-[var(--text-secondary)]"
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - oculto en móvil, visible en desktop */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          sidebarOpen ? "block" : "hidden"
        } lg:block ${
          sidebarOpen ? "lg:w-64" : "lg:w-16"
        } fixed lg:relative inset-y-0 left-0 z-30 h-screen lg:h-full bg-[var(--surface-raised)] border-r border-[var(--border-default)] flex flex-col transition-all duration-200`}
      >
        {/* Header */}
        <div className="h-16 border-b border-[var(--border-default)] flex items-center px-4 justify-between">
          <div className="flex items-center">
            {sidebarOpen ? (
              <>
                <div className="w-8 h-8 rounded-md bg-[var(--electric-cyan)] flex items-center justify-center">
                  <Zap size={18} color="white" strokeWidth={2} />
                </div>
                <span className="font-semibold text-[var(--text-primary)] ml-3">CalcEléc</span>
              </>
            ) : (
              <div className="w-8 h-8 rounded-md bg-[var(--electric-cyan)] flex items-center justify-center">
                <Zap size={18} color="white" strokeWidth={2} />
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-[var(--surface-base)] text-[var(--text-secondary)] transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {categorias.map((categoria) => {
            const items = menuItems.filter((item) => item.categoria === categoria.key);
            return (
              <div key={categoria.key} className="mb-4">
                {sidebarOpen && (
                  <div className="px-4 mb-2">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                      {categoria.label}
                    </span>
                  </div>
                )}
                <ul className="space-y-1 px-2">
                  {items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setCalculoActivo(item.id);
                          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                          calculoActivo === item.id
                            ? "bg-[var(--electric-cyan-subtle)] text-[var(--electric-cyan)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <span
                          className={`${
                            calculoActivo === item.id
                              ? "text-[var(--electric-cyan)]"
                              : "text-[var(--text-tertiary)]"
                          }`}
                        >
                          {item.icono}
                        </span>
                        {sidebarOpen && (
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{item.titulo}</div>
                            <div className="text-xs text-[var(--text-muted)]">{item.descripcion}</div>
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="border-t border-[var(--border-default)] p-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[var(--text-tertiary)] hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${!sidebarOpen ? "rotate-180" : ""}`}
            />
            {sidebarOpen && <span className="text-sm">Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-0 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {calculoActivo ? (
            <div className="animate-fade-in">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-6 text-sm">
                <button
                  onClick={() => setCalculoActivo(null)}
                  className="text-[var(--text-tertiary)] hover:text-[var(--electric-cyan)] transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Menú
                </button>
                <span className="text-[var(--text-muted)]">/</span>
                <span className="text-[var(--text-primary)] font-medium">
                  {opcionSeleccionada?.titulo}
                </span>
                {opcionSeleccionada?.norma && (
                  <>
                    <span className="text-[var(--text-muted)]">/</span>
                    <span className="badge badge-electric">{opcionSeleccionada.norma}</span>
                  </>
                )}
              </div>

              {/* Card Principal */}
              <div className="card">
                {renderCalculo()}
              </div>

              {/* Info Adicional */}
              <div className="mt-6 info-box info-box-cyan flex items-start gap-3">
                <Info size={18} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Referencia Técnica</p>
                  <p className="text-sm opacity-80">
                    {calculoActivo === "ohm" && "La Ley de Ohm establece que V = I × R. Proporcione dos valores para calcular el tercero."}
                    {calculoActivo === "potencia-monofasica" && "Potencia activa en sistemas monofásicos. El factor de potencia cos(φ) considera el desfase entre tensión y corriente."}
                    {calculoActivo === "potencia-trifasica" && "Potencia en sistemas trifásicos con carga balanceada. √3 ≈ 1.732 para conexiones en estrella o triángulo."}
                    {calculoActivo === "cada-tension" && "La caída de tensión máxima permitida según NC 800: Iluminación 3%, Fuerza 5%, Motores 5%."}
                    {calculoActivo === "seccion-conductor" && "Sección mínima del conductor según capacidad de conducción. K=56 A/mm² para cobre, K=35 A/mm² para aluminio (30°C)."}
                    {calculoActivo === "proteccion" && "Interruptores magnetotérmicos según NC 801. Curva B: protección resistiva. Curva C: protección inductiva."}
                    {calculoActivo === "puesta-tierra" && "Resistencia de puesta a tierra según NC 802. Máximo 25 Ω para sistemas de baja tensión."}
                    {calculoActivo === "factor-potencia" && "Corrección del factor de potencia mediante bancos de capacitores. Objetivo mínimo: cos(φ) ≥ 0.90."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
                  Calculadora Eléctrica
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Herramientas profesionales para ingenieros eléctricos basadas en normas cubanas
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {[
                  { label: "Cálculos", value: "8", color: "var(--electric-cyan)" },
                  { label: "Normas", value: "5", color: "var(--ground-green)" },
                  { label: "Categorías", value: "3", color: "var(--warning-amber)" },
                  { label: "Validaciones", value: "✓", color: "var(--electric-cyan)" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Normas */}
              <div className="card mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={18} className="text-[var(--electric-cyan)]" />
                  <h2 className="font-semibold text-[var(--text-primary)]">Normas Cubanas Implementadas</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { norma: "NC 800", desc: "Instalaciones eléctricas en baja tensión" },
                    { norma: "NC 801", desc: "Protecciones en instalaciones eléctricas" },
                    { norma: "NC 802", desc: "Sistemas de puesta a tierra" },
                    { norma: "NC 803-804", desc: "Alumbrado y motores eléctricos" },
                  ].map((item) => (
                    <div key={item.norma} className="p-3 bg-[var(--surface-base)] rounded-md">
                      <div className="font-semibold text-[var(--electric-cyan)] text-sm">{item.norma}</div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mensaje de bienvenida */}
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--electric-cyan-subtle)] flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} className="text-[var(--electric-cyan)]" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Seleccione un cálculo
                </h2>
                <p className="text-[var(--text-tertiary)] max-w-md mx-auto">
                  Use el menú lateral para acceder a las diferentes herramientas de cálculo eléctrico
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Botón flotante de historial */}
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[var(--electric-cyan)] text-white shadow-lg hover:bg-[#0e7490] transition-all hover:scale-105 flex items-center justify-center"
        title="Ver historial"
      >
        <Clock size={24} />
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--alert-red)] text-white text-xs flex items-center justify-center font-bold">
            {history.length > 9 ? '9+' : history.length}
          </span>
        )}
      </button>
    </div>
  );
}
