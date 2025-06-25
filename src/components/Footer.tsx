import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <a href="https://x.com/yoshiko_pg" target="_blank" rel="noopener noreferrer">X</a>
        <a href="https://github.com/yoshiko-pg" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://zenn.dev/yoshiko" target="_blank" rel="noopener noreferrer">Zenn</a>
      </div>
    </footer>
  );
}