import { Title } from '@mantine/core';
import { FunnelChart } from '@mantine/charts';
import { getJobs } from '@/services/servicem8';

interface Job {
  status: string;
  // other fields
}

async function getFunnelData() {
  const jobs: Job[] = await getJobs({ $filter: "active eq 1" });

  const stages = [
    { name: 'Quotes', value: jobs.filter(j => j.status === 'Quote').length, color: 'blue.6' },
    { name: 'Work Orders', value: jobs.filter(j => j.status === 'Work Order').length, color: 'yellow.6' },
    { name: 'In Progress', value: jobs.filter(j => j.status === 'In Progress').length, color: 'orange.6' },
    { name: 'Completed', value: jobs.filter(j => j.status === 'Completed').length, color: 'green.6' },
  ];

  return stages;
}

export default async function SalesFunnel() {
  const data = await getFunnelData();

  return (
    <div style={{ padding: '2rem' }}>
      <Title order={1} mb="xl">Sales Funnel</Title>
      <FunnelChart
        data={data}
        style={{ height: 400 }}
      />
    </div>
  );
}