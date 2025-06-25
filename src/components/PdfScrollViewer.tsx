import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import styles from './PdfScrollViewer.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfScrollViewerProps {
  file: string;
}

export default function PdfScrollViewer({ file }: PdfScrollViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'j' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextPage = Math.min(currentPage + 1, numPages);
      setCurrentPage(nextPage);
      scrollToPage(nextPage);
    } else if (event.key === 'k' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevPage = Math.max(currentPage - 1, 1);
      setCurrentPage(prevPage);
      scrollToPage(prevPage);
    }
  }, [numPages, currentPage]);

  const scrollToPage = (pageNumber: number) => {
    const element = document.getElementById(`page-${pageNumber}`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      // talkInfoと同じ幅の計算ロジック
      const maxWidth = 1200;
      const padding = viewportWidth * 0.2; // 左右10%ずつ
      const calculatedWidth = Math.min(viewportWidth - padding, maxWidth * 0.8);
      setContainerWidth(calculatedWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // 少し余裕を持たせる
      
      for (let i = 1; i <= numPages; i++) {
        const element = document.getElementById(`page-${i}`);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setCurrentPage(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [numPages]);

  if (!file) {
    return (
      <div className={styles.error}>
        <p>PDF file not specified</p>
        <a href={file} download>Download PDF</a>
      </div>
    );
  }

  useEffect(() => {
    // Update page indicator in the fixed header
    const pageIndicator = document.getElementById('page-indicator');
    if (pageIndicator && numPages > 0) {
      pageIndicator.innerHTML = `${currentPage}<br>・<br>${numPages}`;
    }
  }, [currentPage, numPages]);

  return (
    <div className={styles.container}>
      
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
        <div className={styles.pagesContainer}>
          {Array.from(new Array(numPages), (_, index) => (
            <div 
              key={`page_${index + 1}`} 
              id={`page-${index + 1}`}
              className={styles.pageWrapper}
            >
              <Page
                pageNumber={index + 1}
                width={containerWidth}
                loading={
                  <div className={styles.skeleton}>
                    <div className={styles.skeletonContent}>
                      Loading page {index + 1}...
                    </div>
                  </div>
                }
                error=""
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
}