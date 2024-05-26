import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor() {}
  // Metodo para generar reportes en PDF
  reports(
    encabezado: string[], // El encabezado de la tabla
    cuerpo: Array<any>, // Los datos que se mostrarán en la tabla
    titulo: string, // El título del reporte
    guardar?: boolean // Un parámetro opcional que indica si se debe guardar el PDF generado
  ) {
    const doc = new jsPDF({
      orientation: 'portrait', // Orientación del documento
      unit: 'px', // Unidad de medida del documento (píxeles)
      format: 'letter', // Formato del documento (carta)
    });

    // Agregar el logo
    const logo = new Image();
    logo.src = 'assets/hotel.png';
    logo.onload = () => {
      const logoWidth = 100;
      const logoHeight = 100;
      const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
      doc.addImage(logo, 'PNG', logoX, 20, logoWidth, logoHeight); // Centrar el logo en la parte superior
      // Ajustar la posición vertical del título
      const titleMarginTop = 130; // Ajustar el margen superior del título
      doc.text(titulo, doc.internal.pageSize.width / 2, titleMarginTop, {
        align: 'center',
      });
      this.generatePdf(doc, encabezado, cuerpo, guardar); // Llamar a el metodo para generar el PDF
    };
  }
  // Metodo para generar PDF
  private generatePdf(
    doc: jsPDF,
    encabezado: string[],
    cuerpo: Array<any>,
    guardar?: boolean
  ) {
    // Ajustar la posición vertical de la tabla
    const marginTop = 160; // Ajustar el margen superior de la tabla
    autoTable(doc, {
      head: [encabezado],
      body: cuerpo,
      startY: marginTop,
      didDrawCell: (data) => {
        // Añadir estilos personalizados a las celdas
        data.cell.styles.cellPadding = 5;
        data.cell.styles.fontSize = 10;
        data.cell.styles.textColor = [0, 0, 0]; // Color de texto
      },
      theme: 'grid', // estilo de cuadrícula
      styles: {
        lineColor: [0, 0, 0], // Color de las líneas
        lineWidth: 0.5, // Ancho de las líneas
      },
    });
    // Filtro para guardar o no el PDF
    if (guardar) {
      const hoy = new Date();
      doc.save(
        hoy.getDate() +
          hoy.getMonth() +
          hoy.getFullYear() +
          hoy.getTime() +
          '.pdf'
      );
    }
  }
}
