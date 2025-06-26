import { useParams, Link } from 'react-router-dom';
import PdfScrollViewer from '../components/PdfScrollViewer';
import Footer from '../components/Footer';
import XShareButton from '../components/XShareButton';
import { talks } from '../data/talks';
import styles from './TalkDetail.module.css';

export default function TalkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const talk = talks.find(t => t.slug === slug);

  if (!talk) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Talk not found</h1>
          <p>The requested talk could not be found.</p>
          <Link to="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.fixedHeader}>
        <Link to="/" className={styles.backLink}>
          ←
        </Link>
        <div className={styles.headerRight}>
          <div className={styles.pageNumber} id="page-indicator">
            {/* Page number will be updated by PdfScrollViewer */}
          </div>
          <XShareButton 
            text={`${talk.title}\n`}
            url={`https://yoshiko-pg.github.io/talks/${talk.slug}/`}
          />
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.talkInfo}>
          <div className={styles.talkMeta}>
            <span className={styles.event}>{talk.event}</span>
            <span className={styles.date}>
              {new Date(talk.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\//g, '/')}
            </span>
          </div>
          <h1 className={styles.title}>{talk.title}</h1>
          <p className={styles.description}>{talk.description}</p>
        </div>

        <main className={styles.main}>
          <div className={styles.viewerContainer}>
            <PdfScrollViewer file={talk.pdfPath} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}