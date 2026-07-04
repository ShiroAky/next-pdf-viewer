'use client';

import { useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';

export interface PdfCanvasProps {
  pdfRef: React.RefObject<pdfjs.PDFDocumentProxy | null>;
  pageNumber: number;
  scale?: number;
  className?: string;
}

export function PdfCanvas({ pdfRef, pageNumber, scale = 1.5, className = '' }: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);

  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    const pdf = pdfRef.current;

    if (!pdf || !canvas) return;
    if (!canvas) return; // Validación necesaria para TypeScript

    const renderPage = async () => {
      // Cancelar tarea previa de forma inmediata
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page = await pdf.getPage(pageNumber);
      if (!active) return;

      const viewport = page.getViewport({ scale });
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Esperar al siguiente frame para asegurar estabilidad en el DOM
      requestAnimationFrame(() => {
        if (!active) return;
        
        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        });

        renderTaskRef.current.promise.catch((err) => {
          if (err.name !== 'RenderingCancelledException') {
            console.error(`Error en página ${pageNumber}:`, err);
          }
        });
      });
    };

    renderPage();

    return () => {
      active = false;
      if (renderTaskRef.current) renderTaskRef.current.cancel();
    };
  }, [pdfRef, pageNumber, scale]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ display: 'block' }} 
    />
  );
}