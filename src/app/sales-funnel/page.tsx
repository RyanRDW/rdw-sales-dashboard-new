import { FunnelChart } from '@/components/funnel-chart'
import { getJobs } from '@/services/servicem8';
import { isAuthenticated } from '@/services/auth';
import { redirect } from 'next/navigation';

interface Job {
  status: string;
  // other fields
}

async function getFunnelData() {
  const jobs: Job[] = await getJobs({ $filter: "active eq 1" });

  const stages = [
    { name: 'Quotes', value: jobs.filter(j => j.status === 'Quote').length, color: '#3b82f6' },
    { name: 'Work Orders', value: jobs.filter(j => j.status === 'Work Order').length, color: '#eab308' },
    { name: 'In Progress', value: jobs.filter(j => j.status === 'In Progress').length, color: '#f97316' },
    { name: 'Completed', value: jobs.filter(j => j.status === 'Completed').length, color: '#22c55e' },
  ];

  return stages;
}

export default async function SalesFunnel() {
  if (!await isAuthenticated()) {
    redirect('/');
  }

  const data = await getFunnelData();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sales Funnel</h1>
      <FunnelChart data={data} />
    </div>
  );
}
