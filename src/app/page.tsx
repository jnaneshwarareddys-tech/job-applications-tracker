'use client';

import Link from 'next/link';
import { useJobs } from '@/hooks/useJobs';
import Spreadsheet from '@/components/Spreadsheet';
import styles from './page.module.css';

export default function Home() {
  const { jobs, loading } = useJobs();

  const totalApplications = jobs.length;
  const activeApplications = jobs.filter(j => ['Applied', 'Interviewing'].includes(j.status)).length;
  const interviews = jobs.filter(j => j.status === 'Interviewing').length;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Application Tracker</h1>
          <p className={styles.subtitle}>Track and manage your job search in one place.</p>
        </div>
        <Link href="/admin" className={styles.navLink}>
          Admin Dashboard
        </Link>
      </header>

      <div className={styles.summaryCards}>
        <div className={`${styles.card} glass`}>
          <div className={styles.cardValue}>{totalApplications}</div>
          <div className={styles.cardLabel}>Total Applications</div>
        </div>
        <div className={`${styles.card} glass`}>
          <div className={styles.cardValue}>{activeApplications}</div>
          <div className={styles.cardLabel}>Active</div>
        </div>
        <div className={`${styles.card} glass`}>
          <div className={styles.cardValue}>{interviews}</div>
          <div className={styles.cardLabel}>Interviews</div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading jobs...</p>
      ) : (
        <Spreadsheet jobs={jobs} isAdmin={false} />
      )}
    </main>
  );
}
