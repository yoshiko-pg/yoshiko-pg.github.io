import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import styles from './PresentationMode.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PresentationModeProps {
  file: string;
  onClose: () => void;
}

export default function PresentationMode({ file, onClose }: PresentationModeProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        event.preventDefault();
        setCurrentPage(prev => Math.min(prev + 1, numPages));
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        setCurrentPage(prev => Math.max(prev - 1, 1));
        break;
      case 'Home':
        event.preventDefault();
        setCurrentPage(1);
        break;
      case 'End':
        event.preventDefault();
        setCurrentPage(numPages);
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
    }
  }, [numPages, onClose]);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleSlideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const centerX = rect.width / 2;

    if (clickX > centerX) {
      nextPage();
    } else {
      prevPage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // Prevent body scroll when in presentation mode
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div 
      className={styles.overlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >

      <div className={styles.container}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('PDF load error:', error)}
          loading={
            <div className={styles.loading}>
              <div className={styles.loadingDot}></div>
              <p>Loading PDF...</p>
            </div>
          }
          error={
            <div className={styles.error}>
              <div className={styles.errorIcon}>✕</div>
              <p>Failed to load PDF</p>
            </div>
          }
        >
          {numPages > 0 && (
            <div className={styles.pageContainer} onClick={handleSlideClick}>
              <Page
                pageNumber={currentPage}
                scale={1}
                loading={
                  <div className={styles.skeleton}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.skeletonContent}>
                      Loading page {currentPage}...
                    </div>
                  </div>
                }
                error=""
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          )}
        </Document>
      </div>

      <div className={`${styles.floatingBar} ${isMobile || showControls ? styles.visible : styles.hidden}`}>
        <div className={styles.navigationGroup}>
          <button 
            className={styles.navButton} 
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className={styles.pageInfo}>
            {currentPage} / {numPages}
          </span>
          <button 
            className={styles.navButton}
            onClick={nextPage}
            disabled={currentPage === numPages}
          >
            →
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}