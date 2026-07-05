import { useState, useEffect } from 'react';
import { JobApplication } from '@/types';

export function useJobs(storageKey: string = 'job_applications') {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setJobs(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, [storageKey]);

  // Save changes wrapper
  const persistJobs = (newJobs: JobApplication[]) => {
    setJobs(newJobs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newJobs));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const addJob = (job: Partial<JobApplication>) => {
    const newJob: JobApplication = {
      ...job,
      id: crypto.randomUUID(),
    } as JobApplication;
    persistJobs([...jobs, newJob]);
  };

  const updateJob = (id: string, updatedData: Partial<JobApplication>) => {
    const newJobs = jobs.map((job) => 
      job.id === id ? { ...job, ...updatedData, id } : job
    );
    persistJobs(newJobs);
  };

  const deleteJob = (id: string) => {
    const newJobs = jobs.filter((job) => job.id !== id);
    persistJobs(newJobs);
  };

  return {
    jobs,
    loading,
    addJob,
    updateJob,
    deleteJob
  };
}
