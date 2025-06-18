import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FixedSizeList as List } from 'react-window';
import styles from './PdfScrollViewer.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfScrollViewerProps {
  file: string;
  width?: number;
  maxWidth?: number;
}

interface PageItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    numPages: number;
    width: number;
    file: string;
  };
}

const PageItem = ({ index, style, data }: PageItemProps) => {
  const [loading, setLoading] = useState(true);
  const pageNumber = index + 1;

  return (
    <div style={style} className={styles.pageContainer}>
      {loading && (
        <div className={styles.skeleton}>
          <div className={styles.skeletonContent}>
            Loading page {pageNumber}...
          </div>
        </div>
      )}
      <Page
        pageNumber={pageNumber}
        file={data.file}
        width={data.width}
        onLoadSuccess={() => setLoading(false)}
        onLoadError={() => setLoading(false)}
        loading=""
        error=""
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
  );
};

export default function PdfScrollViewer({ 
  file, 
  width = 800, 
  maxWidth = 800 
}: PdfScrollViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(width);
  const [pageHeight, setPageHeight] = useState<number>(800);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'j' || event.key === 'ArrowDown') {
      event.preventDefault();
      setCurrentPage(prev => Math.min(prev + 1, numPages));
    } else if (event.key === 'k' || event.key === 'ArrowUp') {
      event.preventDefault();
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
  }, [numPages]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const calculatedWidth = Math.min(viewportWidth * 0.9, maxWidth);
      setContainerWidth(calculatedWidth);
      setPageHeight(calculatedWidth * 1.4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxWidth]);

  useEffect(() => {
    if (currentPage > 0) {
      const element = document.getElementById(`page-${currentPage}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage]);

  if (!file) {
    return (
      <div className={styles.error}>
        <p>PDF file not specified</p>
        <a href={file} download>Download PDF</a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <span>Page {currentPage} of {numPages}</span>
        <div className={styles.shortcuts}>
          <span>Use J/K or ↓/↑ to navigate</span>
        </div>
      </div>
      
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('PDF load error:', error)}
        loading={
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading PDF...</p>
          </div>
        }
        error={
          <div className={styles.error}>
            <p>Failed to load PDF</p>
            <a href={file} download>Download PDF</a>
          </div>
        }
      >
        {numPages > 0 && (
          <List
            height={window.innerHeight - 100}
            itemCount={numPages}
            itemSize={pageHeight + 20}
            itemData={{
              numPages,
              width: containerWidth,
              file,
            }}
            overscanCount={1}
          >
            {PageItem}
          </List>
        )}
      </Document>
    </div>
  );
}