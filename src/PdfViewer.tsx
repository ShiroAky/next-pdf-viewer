'use client';

import { useEffect, useState, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PdfCanvas } from './PdfCanvas';

// Configuración del worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface PdfViewerProps {
  url: string;
  scale?: number;
  className?: string;        // Estilos para el contenedor principal
  canvasClassName?: string;  // Estilos para cada página (canvas)
}

export function PdfViewer({ url, scale = 1.5, className = '', canvasClassName = '' }: PdfViewerProps) {
  const [totalPages, setTotalPages] = useState<number>(0);
  const pdfRef = useRef<pdfjs.PDFDocumentProxy | null>(null);

  useEffect(() => {
    pdfjs.getDocument({ url }).promise.then((loadedPdf) => {
      pdfRef.current = loadedPdf;
      setTotalPages(loadedPdf.numPages);
    });
  }, [url]);

  return (
    <div className={`pdf-viewer-wrapper ${className}`}>
      {Array.from({ length: totalPages }, (_, i) => (
        <PdfCanvas
          key={`page-${i + 1}`}
          pdfRef={pdfRef}
          pageNumber={i + 1}
          scale={scale}
          className={canvasClassName}
        />
      ))}
    </div>
  );
}