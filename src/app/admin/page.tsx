'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useJobs } from '@/hooks/useJobs';
import { JobApplication } from '@/types';
import Spreadsheet from '@/components/Spreadsheet';
import JobForm from '@/components/JobForm';
import styles from '../page.module.css';

export default function AdminDashboard() {
  const { jobs, loading, addJob, updateJob, deleteJob } = useJobs();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleCreateOrUpdate = (data: Partial<JobApplication>) => {
    if (editingJob) {
      updateJob(editingJob.id, data);
    } else {
      addJob(data);
    }
    setShowForm(false);
    setEditingJob(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    deleteJob(id);
  };

  const handleEdit = (job: JobApplication) => {
    setEditingJob(job);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className={styles.main} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.2)',
                color: 'white',
                outline: 'none'
              }}
            />
            {authError && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{authError}</p>}
            <button type="submit" className={styles.addBtn} style={{ marginBottom: 0, width: '100%' }}>
              Login
            </button>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem', textDecoration: 'underline' }}>
              Return to Dashboard
            </Link>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>Manage your applications below.</p>
        </div>
        <Link href="/" className={styles.navLink}>
          Back to Dashboard
        </Link>
      </header>

      {!showForm && (
        <button 
          className={styles.addBtn}
          onClick={() => {
            setEditingJob(null);
            setShowForm(true);
          }}
        >
          + New Application
        </button>
      )}

      {showForm && (
        <JobForm 
          initialData={editingJob} 
          onSubmit={handleCreateOrUpdate} 
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }} 
        />
      )}

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading jobs...</p>
      ) : (
        <Spreadsheet 
          jobs={jobs} 
          isAdmin={true} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </main>
  );
}
