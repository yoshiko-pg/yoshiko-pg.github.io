import { Link } from 'react-router-dom';
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
          <div className={styles.actions}>
            <Link to="/talks" className={styles.primaryButton}>
              View Talks
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.projects}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <div className={styles.projectGrid}>
            <div className={styles.projectCard}>
              <h3>Portfolio Site</h3>
              <p>Personal portfolio with PDF slide viewer built with React and TypeScript</p>
              <div className={styles.tech}>
                <span>React</span>
                <span>TypeScript</span>
                <span>Vite</span>
              </div>
            </div>
            
            <div className={styles.projectCard}>
              <h3>Conference Talks</h3>
              <p>Collection of technical presentations and slides from various conferences</p>
              <div className={styles.tech}>
                <span>Speaking</span>
                <span>Technical</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.container}>
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