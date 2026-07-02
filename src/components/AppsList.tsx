import { apps } from "../data/apps";
import styles from "./AppsList.module.css";

export default function AppsList() {
  return (
    <div className={styles.appsGrid}>
      {apps.map((app) => (
        <a
          key={app.slug}
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.appCard}
        >
          <div className={styles.thumbnail}>
            <img src={app.thumbnail} alt={`${app.title} screenshot`} />
          </div>
          <div className={styles.appContent}>
            <h3 className={styles.appTitle}>{app.title}</h3>
            <p className={styles.appDescription}>{app.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
