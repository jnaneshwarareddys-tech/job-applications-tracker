'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const isFreelance = pathname.includes('/freelance');

  return (
    <nav className={styles.nav}>
      <Link 
        href="/" 
        className={`${styles.link} ${!isFreelance ? styles.active : ''}`}
      >
        Job Tracker
      </Link>
      <Link 
        href="/freelance" 
        className={`${styles.link} ${isFreelance ? styles.active : ''}`}
      >
        Freelance Tracker
      </Link>
    </nav>
  );
}
