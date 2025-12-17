import { useState, useCallback, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styles from "./PresentationMode.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PresentationModeProps {
  file: string;
  onClose: () => void;
}

export default function PresentationMode({
  file,
  onClose,
}: PresentationModeProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [pageScale, setPageScale] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          event.preventDefault();
          setCurrentPage((prev) => Math.min(prev + 1, numPages));
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          setCurrentPage((prev) => Math.max(prev - 1, 1));
          break;
        case "Home":
          event.preventDefault();
          setCurrentPage(1);
          break;
        case "End":
          event.preventDefault();
          setCurrentPage(numPages);
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    },
    [numPages, onClose],
  );

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSlideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    if (isRotated) {
      // 横表示時：縦持ちで上半分/下半分でページめくり
      const clickY = event.clientY - rect.top;
      const centerY = rect.height / 2;

      if (clickY > centerY) {
        nextPage();
      } else {
        prevPage();
      }
    } else {
      // 通常表示時：左右でページめくり
      const clickX = event.clientX - rect.left;
      const centerX = rect.width / 2;

      if (clickX > centerX) {
        nextPage();
      } else {
        prevPage();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // Prevent body scroll when in presentation mode
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice);
      // モバイルデバイスの場合はdevicePixelRatioを制限してメモリ使用量を削減
      if (isTouchDevice) {
        setPageScale(Math.min(window.devicePixelRatio, 2));
      } else {
        setPageScale(window.devicePixelRatio || 1);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // メモリ節約のため、現在のページと前後数ページのみをレンダリング
  const pagesToRender = useMemo(() => {
    const preloadRange = isMobile ? 1 : 2; // モバイルでは前後1ページ、デスクトップでは前後2ページ
    const start = Math.max(1, currentPage - preloadRange);
    const end = Math.min(numPages, currentPage + preloadRange);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, numPages, isMobile]);

  // コンポーネントのアンマウント時にcanvasメモリを解放
  useEffect(() => {
    return () => {
      // Safariのメモリを強制的に解放
      // プレゼンテーションモード内のcanvasのみを対象にする
      const presentationContainer = document.querySelector(
        `.${styles.container}`,
      );
      if (presentationContainer) {
        presentationContainer.querySelectorAll("canvas").forEach((canvas) => {
          canvas.width = 0;
          canvas.height = 0;
        });
      }
    };
  }, []);

  return (
    <div
      className={`${styles.overlay} ${isRotated ? styles.rotated : ""}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={styles.container}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("PDF load error:", error)}
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
              {/* メモリ節約のため、表示範囲のページのみをレンダリング */}
              {pagesToRender.map((pageNum) => (
                <div
                  key={pageNum}
                  style={{
                    display: pageNum === currentPage ? "flex" : "none",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Page
                    pageNumber={pageNum}
                    scale={1}
                    devicePixelRatio={pageScale}
                    loading={
                      !loadedPages.has(pageNum) ? (
                        <div className={styles.skeleton}>
                          <div className={styles.loadingDot}></div>
                          <div className={styles.skeletonContent}>
                            Loading page {pageNum}...
                          </div>
                        </div>
                      ) : null
                    }
                    error=""
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderSuccess={() => {
                      setLoadedPages((prev) => new Set(prev).add(pageNum));
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Document>
      </div>

      <div
        className={`${styles.floatingBar} ${isMobile || showControls ? styles.visible : styles.hidden}`}
      >
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
        {isMobile && (
          <button
            className={styles.rotateButton}
            onClick={() => setIsRotated(!isRotated)}
            title={isRotated ? "縦向きに戻す" : "横向きで表示"}
          >
            ↻
          </button>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
