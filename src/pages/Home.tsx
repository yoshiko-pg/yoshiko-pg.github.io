import TalksList from '../components/TalksList';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <a href="https://x.com/yoshiko_pg" target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
          <img src="/yoshiko.png" alt="Yoshiko" className={styles.profileImage} />
        </a>
      </section>

      <section className={styles.talks}>
        <div className={styles.sectionContainer}>
          <TalksList />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="https://x.com/yoshiko_pg" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://github.com/yoshiko-pg" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://zenn.dev/yoshiko" target="_blank" rel="noopener noreferrer">Zenn</a>
        </div>
      </footer>
    </div>
  );
}