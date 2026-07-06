import { useState, useEffect } from 'react';
import { JobApplication } from '@/types';

export function useJobs(storageKey: string = 'job_applications') {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const loadData = async () => {
    try {
      // 1. Try to load from Cloud API
      const res = await fetch(`/api/db?key=${storageKey}`, { cache: 'no-store' });
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && cloudData.length > 0) {
          setJobs(cloudData);
          // Sync cloud data to local storage for offline use
          localStorage.setItem(storageKey, JSON.stringify(cloudData));
          return;
        }
      }
      
      // 2. Fallback to localStorage if API fails or is empty
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const localData = JSON.parse(stored);
        setJobs(localData);
        // If we found local data but cloud was empty, let's upload it to sync
        if (res.ok && localData.length > 0) {
          await fetch(`/api/db?key=${storageKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: localData })
          });
        }
      }
    } catch (e) {
      console.error('Failed to load data', e);
      // Ultimate fallback
      const stored = localStorage.getItem(storageKey);
      if (stored) setJobs(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [storageKey]);

  // Save changes wrapper
  const persistJobs = async (newJobs: JobApplication[]) => {
    // Optimistic UI update
    setJobs(newJobs);
    
    // Save locally immediately
    try {
      localStorage.setItem(storageKey, JSON.stringify(newJobs));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    // Sync to cloud
    try {
      await fetch(`/api/db?key=${storageKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newJobs })
      });
    } catch (e) {
      console.error('Failed to sync to cloud', e);
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
