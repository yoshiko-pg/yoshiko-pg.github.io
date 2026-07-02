import { useState } from "react";
import AppsList from "../components/AppsList";
import TalksList from "../components/TalksList";
import Footer from "../components/Footer";
import styles from "./Home.module.css";

function SectionTitle({ children }: { children: string }) {
  const [swinging, setSwinging] = useState(false);
  return (
    <h2
      className={`${styles.sectionTitle} ${swinging ? styles.swinging : ""}`}
      onMouseEnter={() => setSwinging(true)}
      onAnimationEnd={() => setSwinging(false)}
    >
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <a
          href="https://x.com/yoshiko_pg"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.profileLink}
        >
          <img
            src="/yoshiko.png"
            alt="Yoshiko"
            className={styles.profileImage}
          />
        </a>
      </section>

      <section className={styles.apps}>
        <div className={styles.sectionContainer}>
          <SectionTitle>Apps</SectionTitle>
          <AppsList />
        </div>
      </section>

      <section className={styles.talks}>
        <div className={styles.sectionContainer}>
          <SectionTitle>Slides</SectionTitle>
          <TalksList />
        </div>
      </section>

      <Footer />
    </div>
  );
}
