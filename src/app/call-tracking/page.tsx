import { Title, Text, Group } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { getJobNotes } from '@/services/servicem8';
import dayjs from 'dayjs';

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
  const { totalCalls, trendData } = await getCallData();

  return (
    <div style={{ padding: '2rem' }}>
      <Title order={1} mb="xl">Call Tracking</Title>
      <Group mb="md">
        <Text fw={500}>Total Calls:</Text>
        <Text>{totalCalls}</Text>
      </Group>
      <Title order={2} mb="md">Call Trends</Title>
      <LineChart
        h={300}
        data={trendData}
        dataKey="date"
        series={[{ name: 'calls', color: 'blue.6' }]}
        curveType="linear"
      />
    </div>
  );
}