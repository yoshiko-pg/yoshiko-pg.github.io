import { useParams, Link } from 'react-router-dom';
import PdfScrollViewer from '../components/PdfScrollViewer';
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
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <div className={styles.talkInfo}>
            <div className={styles.talkMeta}>
              <span className={styles.event}>{talk.event}</span>
              <span className={styles.date}>
                {new Date(talk.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className={styles.title}>{talk.title}</h1>
            <p className={styles.description}>{talk.description}</p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.viewerContainer}>
          <PdfScrollViewer file={talk.pdfPath} />
        </div>
      </main>
    </div>
  );
}