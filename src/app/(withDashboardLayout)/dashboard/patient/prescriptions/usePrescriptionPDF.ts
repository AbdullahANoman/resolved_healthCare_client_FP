// hooks/usePrescriptionPdf.ts
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface UsePrescriptionPdfProps {
  patientName: string;
  doctorName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const usePrescriptionPdf = ({
  patientName,
  doctorName,
  onSuccess,
  onError
}: UsePrescriptionPdfProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPrescriptionPdf = async () => {
    if (!contentRef.current) {
      console.error('No content reference found for PDF generation');
      return;
    }

    setIsGenerating(true);

    try {
      // Create a clone of the content for PDF generation
      const originalContent = contentRef.current;
      const clone = originalContent.cloneNode(true) as HTMLDivElement;
      
      // Apply PDF-specific styles
      clone.style.width = '210mm'; // A4 width
      clone.style.padding = '20mm';
      clone.style.backgroundColor = 'white';
      clone.style.color = 'black';
      clone.style.fontSize = '12pt';
      clone.style.lineHeight = '1.4';
      
      // Hide interactive elements for PDF
      const buttons = clone.querySelectorAll('button');
      buttons.forEach(button => button.style.display = 'none');
      
      const links = clone.querySelectorAll('a');
      links.forEach(link => link.style.display = 'none');

      // Temporarily add to document for rendering
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3, // High quality for print
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });

      // Clean up
      document.body.removeChild(clone);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Add footer with prescription details
      const getPageCount = (doc: any): number => {
        if (typeof doc.getNumberOfPages === 'function') {
          return doc.getNumberOfPages();
        }
        if (doc.internal && Array.isArray((doc.internal as any).pages)) {
          return (doc.internal as any).pages.length;
        }
        if (doc.internal && (doc.internal as any).pages) {
          return Object.keys((doc.internal as any).pages).length;
        }
        return 1;
      };

      const pageCount = getPageCount(pdf);

      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(
          `Prescription for ${patientName} - Dr. ${doctorName} - Page ${i} of ${pageCount}`,
          pdfWidth / 2,
          pdfHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          `Generated on ${new Date().toLocaleDateString()}`,
          pdfWidth / 2,
          pdfHeight - 5,
          { align: 'center' }
        );
      }

      const fileName = `prescription-${patientName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      onSuccess?.();
    } catch (error) {
      console.error('Error generating prescription PDF:', error);
      onError?.(error as Error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    contentRef,
    downloadPrescriptionPdf,
    isGenerating,
  };
};