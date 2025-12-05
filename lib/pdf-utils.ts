import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export interface PDFHeaderConfig {
  title: string;
  subtitle?: string;
  reportType?: string;
  generatedBy?: string;
  dateRange?: string;
}

export interface PDFTableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

export interface PDFTableData {
  [key: string]: any;
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;
  private primaryColor: [number, number, number] = [37, 99, 235]; // Blue-600
  private secondaryColor: [number, number, number] = [100, 116, 139]; // Slate-500
  private accentColor: [number, number, number] = [16, 185, 129]; // Green-500

  constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
    this.doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  /**
   * Add professional header with logo and company info
   */
  addHeader(config: PDFHeaderConfig): void {
    const { title, subtitle, reportType, generatedBy, dateRange } = config;

    // Add decorative top bar - solid color, no transparency
    this.doc.setFillColor(37, 99, 235);
    this.doc.rect(0, 0, this.pageWidth, 8, 'F');

    this.currentY = 15;

    // Company Logo/Icon (text-based)
    this.doc.setFillColor(...this.primaryColor);
    this.doc.roundedRect(this.margin, this.currentY, 15, 15, 2, 2, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('IH', this.margin + 7.5, this.currentY + 10, { align: 'center' });

    // Company Name
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('INTELLIHIRE', this.margin + 18, this.currentY + 8);

    // Tagline
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Smart Recruitment Solutions', this.margin + 18, this.currentY + 12);

    // Report Info on the right
    const rightX = this.pageWidth - this.margin;
    this.doc.setFontSize(9);
    this.doc.setTextColor(...this.secondaryColor);
    
    if (reportType) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Report Type:', rightX - 50, this.currentY + 4);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(reportType, rightX, this.currentY + 4, { align: 'right' });
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Generated:', rightX - 50, this.currentY + 9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(currentDate, rightX, this.currentY + 9, { align: 'right' });

    if (generatedBy) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('By:', rightX - 50, this.currentY + 14);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(generatedBy, rightX, this.currentY + 14, { align: 'right' });
    }

    this.currentY += 22;

    // Separator line
    this.doc.setDrawColor(...this.primaryColor);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);

    this.currentY += 8;

    // Report Title
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.pageWidth / 2, this.currentY, { align: 'center' });

    this.currentY += 6;

    // Subtitle
    if (subtitle) {
      this.doc.setTextColor(...this.secondaryColor);
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, this.pageWidth / 2, this.currentY, { align: 'center' });
      this.currentY += 5;
    }

    // Date Range
    if (dateRange) {
      this.doc.setTextColor(...this.secondaryColor);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(dateRange, this.pageWidth / 2, this.currentY, { align: 'center' });
      this.currentY += 5;
    }

    this.currentY += 5;
  }

  /**
   * Add section header
   */
  addSectionHeader(title: string, icon?: string): void {
    // Remove emojis and special characters from title
    const cleanTitle = title.replace(/[^\x00-\x7F]/g, '').trim();
    
    // Background box
    this.doc.setFillColor(245, 247, 250);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 10, 1, 1, 'F');

    // Section title
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(13);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(cleanTitle, this.margin + 3, this.currentY + 6.5);

    this.currentY += 13;
  }

  /**
   * Add key-value pairs in a styled box
   */
  addInfoBox(data: { label: string; value: string | number }[], columns: number = 2): void {
    const boxWidth = (this.pageWidth - (2 * this.margin)) / columns;
    const boxHeight = 15;
    let x = this.margin;
    let y = this.currentY;

    data.forEach((item, index) => {
      if (index > 0 && index % columns === 0) {
        y += boxHeight + 3;
        x = this.margin;
      }

      // Box background
      this.doc.setFillColor(249, 250, 251);
      this.doc.setDrawColor(229, 231, 235);
      this.doc.setLineWidth(0.2);
      this.doc.roundedRect(x, y, boxWidth - 2, boxHeight, 1, 1, 'FD');

      // Label
      this.doc.setTextColor(...this.secondaryColor);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.label, x + 3, y + 5);

      // Value
      this.doc.setTextColor(31, 41, 55);
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      const valueStr = typeof item.value === 'number' ? item.value.toLocaleString() : item.value;
      this.doc.text(valueStr, x + 3, y + 11);

      x += boxWidth;
    });

    this.currentY = y + boxHeight + 8;
  }

  /**
   * Add a professional table
   */
  addTable(columns: PDFTableColumn[], data: PDFTableData[], title?: string): void {
    if (title) {
      this.addSectionHeader(title);
    }

    autoTable(this.doc, {
      startY: this.currentY,
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.dataKey] || '-')),
      theme: 'grid',
      headStyles: {
        fillColor: this.primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 4
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [55, 65, 81]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: this.margin, right: this.margin },
      columnStyles: columns.reduce((acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width };
        }
        return acc;
      }, {} as any),
      didDrawPage: (data) => {
        // Add page number at bottom
        this.addPageNumber();
      }
    });

    // @ts-ignore - autoTable adds finalY to doc
    this.currentY = this.doc.lastAutoTable.finalY + 8;
  }

  /**
   * Add a chart/visualization placeholder
   */
  addChartPlaceholder(title: string, height: number = 60): void {
    this.doc.setFillColor(249, 250, 251);
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.2);
    this.doc.roundedRect(
      this.margin,
      this.currentY,
      this.pageWidth - (2 * this.margin),
      height,
      1,
      1,
      'FD'
    );

    // Title
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.pageWidth / 2, this.currentY + height / 2, { align: 'center' });

    this.currentY += height + 8;
  }

  /**
   * Add text paragraph
   */
  addParagraph(text: string, fontSize: number = 10): void {
    this.doc.setTextColor(55, 65, 81);
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'normal');

    const lines = this.doc.splitTextToSize(text, this.pageWidth - (2 * this.margin));
    this.doc.text(lines, this.margin, this.currentY);

    this.currentY += (lines.length * fontSize * 0.35) + 5;
  }

  /**
   * Add statistics cards
   */
  addStatCards(stats: { label: string; value: string | number; color?: [number, number, number] }[]): void {
    const cardWidth = (this.pageWidth - (2 * this.margin) - (stats.length - 1) * 3) / stats.length;
    const cardHeight = 25;
    let x = this.margin;

    stats.forEach((stat, index) => {
      const color = stat.color || this.primaryColor;

      // Card background - solid color, no transparency
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.roundedRect(x, this.currentY, cardWidth, cardHeight, 2, 2, 'F');

      // Label
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(stat.label, x + cardWidth / 2, this.currentY + 8, { align: 'center' });

      // Value
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      const valueStr = typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value;
      this.doc.text(valueStr, x + cardWidth / 2, this.currentY + 18, { align: 'center' });

      x += cardWidth + 3;
    });

    this.currentY += cardHeight + 10;
  }

  /**
   * Add footer with page number
   */
  addPageNumber(): void {
    const pageCount = this.doc.getNumberOfPages();
    const currentPage = this.doc.getCurrentPageInfo().pageNumber;

    // Footer line
    this.doc.setDrawColor(229, 231, 235);
    this.doc.setLineWidth(0.2);
    this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);

    // Page number
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(
      `Page ${currentPage} of ${pageCount}`,
      this.pageWidth / 2,
      this.pageHeight - 10,
      { align: 'center' }
    );

    // Footer text
    this.doc.text(
      'Generated by IntelliHire - Smart Recruitment Solutions',
      this.pageWidth / 2,
      this.pageHeight - 7,
      { align: 'center' }
    );
  }

  /**
   * Add a new page
   */
  addPage(): void {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  /**
   * Check if we need a new page
   */
  checkPageBreak(requiredSpace: number = 30): void {
    if (this.currentY + requiredSpace > this.pageHeight - 20) {
      this.addPage();
    }
  }

  /**
   * Save the PDF
   */
  save(filename: string): void {
    // Add page numbers to all pages
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.addPageNumber();
    }

    this.doc.save(filename);
  }

  /**
   * Get the PDF as blob for preview
   */
  getBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Open PDF in new window
   */
  preview(): void {
    const blob = this.getBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  /**
   * Print the PDF
   */
  print(): void {
    this.doc.autoPrint();
    const blob = this.getBlob();
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  }

  /**
   * Get current Y position
   */
  getCurrentY(): number {
    return this.currentY;
  }

  /**
   * Set current Y position
   */
  setCurrentY(y: number): void {
    this.currentY = y;
  }

  /**
   * Get the jsPDF instance for advanced customization
   */
  getDoc(): jsPDF {
    return this.doc;
  }
}

// Export helper function for quick PDF generation
export const generateQuickPDF = (
  title: string,
  data: any,
  filename: string
): void => {
  const pdf = new PDFReportGenerator();
  pdf.addHeader({
    title,
    reportType: 'Quick Report',
    generatedBy: 'System'
  });
  pdf.addParagraph(JSON.stringify(data, null, 2));
  pdf.save(filename);
};
