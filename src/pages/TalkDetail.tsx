import { useParams, Link } from 'react-router-dom';
import PdfScrollViewer from '../components/PdfScrollViewer';
import styles from './TalkDetail.module.css';

interface Talk {
  slug: string;
  title: string;
  event: string;
  date: string;
  description: string;
  pdfPath: string;
}

const talks: Talk[] = [
  {
    slug: 'sample-talk-1',
    title: 'Modern Frontend Development with React',
    event: 'Frontend Conference 2024',
    date: '2024-03-15',
    description: 'A comprehensive overview of modern React development practices, including hooks, context, and performance optimization.',
    pdfPath: '/slides/sample-talk-1.pdf'
  },
  {
    slug: 'sample-talk-2',
    title: 'TypeScript Best Practices',
    event: 'Tech Meetup Tokyo',
    date: '2024-01-20',
    description: 'Deep dive into TypeScript best practices for large-scale applications and team collaboration.',
    pdfPath: '/slides/sample-talk-2.pdf'
  }
];

export default function TalkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const talk = talks.find(t => t.slug === slug);

  if (!talk) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Talk not found</h1>
          <p>The requested talk could not be found.</p>
          <Link to="/talks" className={styles.backButton}>
            ← Back to Talks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/talks" className={styles.backLink}>
            ← Back to Talks
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