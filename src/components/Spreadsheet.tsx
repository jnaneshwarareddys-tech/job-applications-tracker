import { JobApplication } from '@/types';
import styles from './Spreadsheet.module.css';

interface SpreadsheetProps {
  jobs: JobApplication[];
  isAdmin?: boolean;
  onEdit?: (job: JobApplication) => void;
  onDelete?: (id: string) => void;
}

const statusClassMap: Record<string, string> = {
  'Applied': 'status-applied',
  'Interviewing': 'status-interviewing',
  'Offer': 'status-offer',
  'Rejected': 'status-rejected',
  'Ghosted': 'status-ghosted',
  'To Apply': 'status-to-apply',
};

export default function Spreadsheet({ jobs, isAdmin, onEdit, onDelete }: SpreadsheetProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className={`${styles.container} ${styles.emptyState}`}>
        <p>No job applications found. {isAdmin && 'Add one below!'}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Company</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Date Applied</th>
            <th className={styles.th}>Source</th>
            <th className={styles.th}>Notes</th>
            {isAdmin && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className={styles.tr}>
              <td className={styles.td}>
                {job.link ? (
                  <a href={job.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </td>
              <td className={styles.td}>{job.role}</td>
              <td className={styles.td}>
                <span className={`status-badge ${statusClassMap[job.status] || ''}`}>
                  {job.status}
                </span>
              </td>
              <td className={styles.td}>{job.dateApplied || '-'}</td>
              <td className={styles.td}>{job.source || '-'}</td>
              <td className={styles.td}>{job.spread || '-'}</td>
              {isAdmin && (
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button 
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => onEdit?.(job)}
                    >
                      Edit
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => onDelete?.(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
