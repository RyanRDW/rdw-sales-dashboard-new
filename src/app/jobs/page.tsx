import { Title } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { getJobs } from '@/services/servicem8';

interface Job {
  uuid: string;
  company_name: string;
  status: string;
  job_total: number;
  date_created: string;
  // other fields
}

async function getJobList() {
  const jobs: Job[] = await getJobs({ $filter: "active eq 1" });
  return jobs;
}

export default async function JobList() {
  const jobs = await getJobList();

  return (
    <div style={{ padding: '2rem' }}>
      <Title order={1} mb="xl">Job List</Title>
      <DataTable
        columns={[
          { accessor: 'uuid', title: 'Job ID' },
          { accessor: 'company_name', title: 'Customer' },
          { accessor: 'status', title: 'Status' },
          { accessor: 'job_total', title: 'Total', render: ({ job_total }) => `$${job_total.toFixed(2)}` },
          { accessor: 'date_created', title: 'Created', render: ({ date_created }) => new Date(date_created).toLocaleDateString() },
        ]}
        records={jobs}
        onRowClick={({ record }) => {
          // Implement drill-down, e.g., navigate to /jobs/[uuid]
          console.log('Drill down to job:', record.uuid);
        }}
      />
    </div>
  );
}