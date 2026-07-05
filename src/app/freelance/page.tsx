'use client';

import Link from 'next/link';
import { useJobs } from '@/hooks/useJobs';
import Spreadsheet from '@/components/Spreadsheet';
import styles from '../page.module.css';

export default function FreelanceHome() {
  const { jobs, loading } = useJobs('freelance_applications');

  const totalApplications = jobs.length;
  const activeApplications = jobs.filter(j => ['Applied', 'Interviewing'].includes(j.status)).length;
  const interviews = jobs.filter(j => j.status === 'Interviewing').length;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Freelance Tracker</h1>
          <p className={styles.subtitle}>Track your thumbnail editing gigs and freelance jobs.</p>
        </div>
        <Link href="/admin/freelance" className={styles.navLink}>
          Admin Dashboard
        </Link>
      </header>

      <div className={styles.summaryCards}>
        <div className={`${styles.card} glass`}>
          <div className={styles.cardValue}>{totalApplications}</div>
          <div className={styles.cardLabel}>Total Gigs</div>
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
        <p style={{ color: 'var(--text-secondary)' }}>Loading gigs...</p>
      ) : (
        <Spreadsheet jobs={jobs} isAdmin={false} />
      )}
    </main>
  );
}
