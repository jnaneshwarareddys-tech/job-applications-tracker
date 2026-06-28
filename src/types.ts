export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  source: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Ghosted' | 'To Apply';
  spread: string;
  link: string;
}
