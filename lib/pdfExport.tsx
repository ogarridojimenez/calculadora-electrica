'use client';

export async function exportHistoryToPDF(history: Array<{
  fecha: string;
  hora: string;
  nombre: string;
  inputs: Record<string, string | number>;
  resultado: { valor: number; unidad: string; formula: string };
}>) {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(8, 145, 178);
  doc.text('CalcEléc - Historial de Cálculos', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 14, 30);

  if (history.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('No hay cálculos guardados.', 14, 45);
  } else {
    const formatInputs = (inputs: Record<string, string | number>) => {
      const labels: Record<string, string> = {
        v: 'Voltaje',
        i: 'Corriente',
        r: 'Resistencia',
        potencia: 'Potencia',
        fp: 'Factor de Potencia',
        longitud: 'Longitud',
        seccion: 'Sección',
        calibre: 'Calibre',
        intensidad: 'Intensidad',
      };
      return Object.entries(inputs)
        .filter(([key]) => key !== 'tipo')
        .map(([key, value]) => `${labels[key] || key}: ${value}`)
        .join(' | ');
    };

    const tableData = history.map((item) => [
      item.fecha,
      item.hora,
      item.nombre,
      formatInputs(item.inputs),
      `${item.resultado.valor.toFixed(4)} ${item.resultado.unidad}`,
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['Fecha', 'Hora', 'Cálculo', 'Datos', 'Resultado']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [8, 145, 178],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 35 },
        3: { cellWidth: 60 },
        4: { cellWidth: 35 },
      },
    });

    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${totalPages}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    }
  }

  doc.save('calcelec-historial.pdf');
}
