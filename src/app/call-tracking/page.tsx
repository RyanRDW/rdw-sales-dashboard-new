import { LineChart } from '@/components/line-chart'
import { getJobNotes } from '@/services/servicem8';
import dayjs from 'dayjs';
import { isAuthenticated } from '@/services/auth';
import { redirect } from 'next/navigation';

interface Note {
  entry_date: string;
  body: string;
}

async function getCallData() {
  const notes: Note[] = await getJobNotes(''); // Fetch all notes; optimize if needed

  const callNotes = notes.filter(note => /called|rang|voicemail|spoke to/i.test(note.body));

  const totalCalls = callNotes.length;

  // Group by date for trends
  const callsByDate = callNotes.reduce((acc, note) => {
    const date = dayjs(note.entry_date).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(callsByDate)
    .map(([date, count]) => ({ date, calls: count }))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

  return { totalCalls, trendData };
}

export default async function CallTracking() {
  if (!await isAuthenticated()) {
    redirect('/');
  }

  const { totalCalls, trendData } = await getCallData();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Call Tracking</h1>
      <div className="mb-4">
        <span className="font-medium">Total Calls: </span>
        <span>{totalCalls}</span>
      </div>
      <h2 className="text-xl font-semibold mb-2">Call Trends</h2>
      <LineChart data={trendData} />
    </div>
  );
}
