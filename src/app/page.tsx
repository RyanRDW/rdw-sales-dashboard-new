import { Title, Grid, Card, Text, Group, Button } from '@mantine/core';
import { IconChartBar, IconPhone, IconTrophy, IconCurrencyDollar, IconPercentage } from '@tabler/icons-react';
import { isAuthenticated, getAccessToken } from '@/services/auth';
import { getJobs, getJobNotes } from '@/services/servicem8';
import { redirect } from 'next/navigation';

interface Job {
  uuid: string;
  status: string;
  job_total: number;
  // other fields
}

interface Note {
  note: string;
  // other fields
}

async function getDashboardData() {
  const jobs: Job[] = await getJobs({ $filter: "active eq 1" });
  const notes: Note[] = await getJobNotes(''); // Fetch all notes, might need optimization

  const quotes = jobs.filter(job => job.status === 'Quote').length;
  const wonJobs = jobs.filter(job => job.status === 'Completed').length;
  const conversion = quotes > 0 ? (wonJobs / quotes) * 100 : 0;
  const totalValue = jobs.reduce((sum, job) => sum + (job.status === 'Completed' ? job.job_total : 0), 0);
  const callsMade = notes.filter(note => /called|rang|voicemail|spoke to/i.test(note.note)).length;

  return { quotes, wonJobs, conversion, totalValue, callsMade };
}

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Title order={1} mb="md">Welcome to RDW Roofing Dashboard</Title>
        <Button component="a" href="/api/oauth" size="lg">Login with ServiceM8</Button>
      </div>
    );
  }

  const data = await getDashboardData();

  return (
    <div style={{ padding: '2rem' }}>
      <Title order={1} mb="xl">Dashboard</Title>
      <Grid gutter="md">
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Quotes</Text>
              <IconChartBar size={24} />
            </Group>
            <Text size="xl" fw={700}>{data.quotes}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Won Jobs</Text>
              <IconTrophy size={24} />
            </Group>
            <Text size="xl" fw={700}>{data.wonJobs}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Conversion %</Text>
              <IconPercentage size={24} />
            </Group>
            <Text size="xl" fw={700}>{data.conversion.toFixed(2)}%</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Total Value</Text>
              <IconCurrencyDollar size={24} />
            </Group>
            <Text size="xl" fw={700}>${data.totalValue.toFixed(2)}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Calls Made</Text>
              <IconPhone size={24} />
            </Group>
            <Text size="xl" fw={700}>{data.callsMade}</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}