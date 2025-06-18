import TalksList from '../components/TalksList';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Yoshiko's Portfolio
          </h1>
          <p className={styles.subtitle}>
            Frontend Developer & Conference Speaker
          </p>
        </div>
      </section>

      <section className={styles.talks}>
        <div className={styles.sectionContainer}>
          <TalksList />
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>About</h2>
          <div className={styles.aboutContent}>
            <p>
              I'm a frontend developer passionate about creating great user experiences
              and sharing knowledge through conference talks and technical presentations.
            </p>
            <p>
              This portfolio showcases my work and provides easy access to my conference
              slide decks with a custom vertical PDF viewer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}