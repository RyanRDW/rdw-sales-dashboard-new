import { getJob, getJobNotes } from '@/services/servicem8';
import { isAuthenticated } from '@/services/auth';
import { redirect } from 'next/navigation';

interface Job {
  uuid: string;
  company_name: string;
  status: string;
  job_total: number;
  date_created: string;
  description: string;
  // Add more fields as needed
}

interface Note {
  entry_date: string;
  body: string;
  created_by: string;
}

export default async function JobDetail({ params }: { params: { uuid: string } }) {
  if (!await isAuthenticated()) {
    redirect('/');
  }

  const job: Job = await getJob(params.uuid);
  const notes: Note[] = await getJobNotes(params.uuid);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Job Details: {job.uuid}</h1>
      <div className="mb-4">
        <p><strong>Customer:</strong> {job.company_name}</p>
        <p><strong>Status:</strong> {job.status}</p>
        <p><strong>Total:</strong> ${job.job_total.toFixed(2)}</p>
        <p><strong>Created:</strong> {new Date(job.date_created).toLocaleDateString()}</p>
        <p><strong>Description:</strong> {job.description || 'No description'}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Notes</h2>
      {notes.length > 0 ? (
        <ul>
          {notes.map((note, index) => (
            <li key={index} className="mb-2">
              <p><strong>{new Date(note.entry_date).toLocaleString()} - {note.created_by}</strong></p>
              <p>{note.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available.</p>
      )}
    </div>
  );
}
