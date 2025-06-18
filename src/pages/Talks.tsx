import { Link } from 'react-router-dom';
import { talks } from '../data/talks';
import styles from './Talks.module.css';

export default function Talks() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>Conference Talks</h1>
          <p className={styles.subtitle}>
            Technical presentations and slide decks from various conferences and meetups
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.talksList}>
          {talks.map((talk) => (
            <Link 
              key={talk.slug}
              to={`/talks/${talk.slug}`}
              className={styles.talkCard}
            >
              <div className={styles.talkContent}>
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
                <h2 className={styles.talkTitle}>{talk.title}</h2>
                <p className={styles.talkDescription}>{talk.description}</p>
                <div className={styles.viewSlides}>
                  View Slides →
                </div>
              </div>
              {talk.thumbnail && (
                <div className={styles.thumbnail}>
                  <img src={talk.thumbnail} alt={`${talk.title} thumbnail`} />
                </div>
              )}
            </Link>
          ))}
        </div>

        {talks.length === 0 && (
          <div className={styles.empty}>
            <h2>No talks available yet</h2>
            <p>Check back later for conference presentations and slide decks.</p>
          </div>
        )}
      </main>
    </div>
  );
}