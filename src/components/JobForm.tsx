'use client';

import { useState, useEffect } from 'react';
import { JobApplication } from '@/types';
import styles from './JobForm.module.css';

interface JobFormProps {
  initialData?: JobApplication | null;
  onSubmit: (data: Partial<JobApplication>) => void;
  onCancel: () => void;
}

export default function JobForm({ initialData, onSubmit, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    company: '',
    role: '',
    status: 'To Apply',
    dateApplied: new Date().toISOString().split('T')[0],
    source: '',
    spread: '',
    link: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {initialData ? 'Edit Application' : 'New Application'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="company">Company *</label>
            <input 
              required
              type="text" 
              id="company" 
              name="company" 
              className={styles.input} 
              value={formData.company} 
              onChange={handleChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="role">Role *</label>
            <input 
              required
              type="text" 
              id="role" 
              name="role" 
              className={styles.input} 
              value={formData.role} 
              onChange={handleChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="status">Status</label>
            <select 
              id="status" 
              name="status" 
              className={styles.select} 
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="To Apply">To Apply</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Ghosted">Ghosted</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="dateApplied">Date Applied</label>
            <input 
              type="date" 
              id="dateApplied" 
              name="dateApplied" 
              className={styles.input} 
              value={formData.dateApplied} 
              onChange={handleChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="source">Source (e.g. LinkedIn, Referral)</label>
            <input 
              type="text" 
              id="source" 
              name="source" 
              className={styles.input} 
              value={formData.source} 
              onChange={handleChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="link">Job URL</label>
            <input 
              type="url" 
              id="link" 
              name="link" 
              className={styles.input} 
              value={formData.link} 
              onChange={handleChange} 
            />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="spread">Notes / Spread (Salary, Requirements etc)</label>
            <textarea 
              id="spread" 
              name="spread" 
              className={styles.textarea} 
              value={formData.spread} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            {initialData ? 'Update Job' : 'Add Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
