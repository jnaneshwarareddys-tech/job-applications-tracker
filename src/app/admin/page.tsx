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
  };

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
