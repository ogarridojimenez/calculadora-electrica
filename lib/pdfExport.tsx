'use client';

export async function exportHistoryToPDF(
  history: Array<{
    fecha: string;
    hora: string;
    nombre: string;
    inputs: Record<string, string | number>;
    resultado: { valor: number; unidad: string; formula: string };
  }>,
  filename: string = 'calcelec-historial'
) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(8, 145, 178);
  doc.text('CalcEléc - Historial de Cálculos', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 14, 28);

  doc.setDrawColor(200);
  doc.line(14, 32, 196, 32);

  const formatInputs = (inputs: Record<string, string | number>) => {
    const labels: Record<string, string> = {
      v: 'Voltaje',
      i: 'Corriente',
      r: 'Resistencia',
      potencia: 'Potencia',
      fp: 'FP',
      longitud: 'Longitud',
      seccion: 'Sección',
      calibre: 'Calibre',
      intensidad: 'Intensidad',
    };
    return Object.entries(inputs)
      .filter(([key]) => key !== 'tipo')
      .map(([key, value]) => `${labels[key] || key}: ${value}`)
      .join(', ');
  };

  let yPos = 40;

  if (history.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('No hay cálculos guardados.', 14, yPos);
  } else {
    history.forEach((item, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(10);
      doc.setTextColor(8, 145, 178);
      doc.text(`${item.fecha} ${item.hora} - ${item.nombre}`, 14, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text(formatInputs(item.inputs), 14, yPos, { maxWidth: 180 });
      yPos += 6;

      doc.setTextColor(22, 163, 74);
      doc.text(`Resultado: ${item.resultado.valor.toFixed(4)} ${item.resultado.unidad}`, 14, yPos);
      yPos += 10;

      if (index < history.length - 1) {
        doc.setDrawColor(220);
        doc.line(14, yPos - 5, 196, yPos - 5);
      }
    });
  }

  const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(finalFilename);
}
