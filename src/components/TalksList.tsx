import { Link } from 'react-router-dom';
import { talks } from '../data/talks';
import styles from './TalksList.module.css';

export default function TalksList() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Conference Talks</h2>
      <p className={styles.subtitle}>
        Technical presentations and slide decks from various conferences and meetups
      </p>
      
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
              <h3 className={styles.talkTitle}>{talk.title}</h3>
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
          <h3>No talks available yet</h3>
          <p>Check back later for conference presentations and slide decks.</p>
        </div>
      )}
    </div>
  );
}