import { Link } from "react-router-dom";
import { apps } from "../data/apps";
import styles from "./AppsList.module.css";

export default function AppsList() {
  return (
    <div className={styles.appsGrid}>
      {apps.map((app) => {
        const content = (
          <>
            <div className={styles.thumbnail}>
              <img src={app.thumbnail} alt={`${app.title} screenshot`} />
            </div>
            <div className={styles.appContent}>
              <h3 className={styles.appTitle}>{app.title}</h3>
              <p className={styles.appDescription}>{app.description}</p>
            </div>
          </>
        );

        return app.external ? (
          <a
            key={app.slug}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.appCard}
          >
            {content}
          </a>
        ) : (
          <Link key={app.slug} to={app.url} className={styles.appCard}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
