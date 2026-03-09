import { Title } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { getStaff, getJobs, getJobNotes } from '@/services/servicem8';

interface Staff {
  uuid: string;
  name: string;
}

interface Job {
  uuid: string;
  status: string;
  assigned_staff_uuid: string;
  job_total: number;
}

interface Note {
  created_by: string;
  body: string;
}

async function getStaffPerformance() {
  const staff: Staff[] = await getStaff();
  const completedJobs: Job[] = await getJobs({ $filter: "status eq 'Completed'" });
  const notes: Note[] = await getJobNotes(''); // Fetch all notes; optimize if needed

  const performance = staff.map((s) => {
    const jobsCompleted = completedJobs.filter((j) => j.assigned_staff_uuid === s.uuid).length;
    const revenue = completedJobs.filter((j) => j.assigned_staff_uuid === s.uuid).reduce((sum, j) => sum + j.job_total, 0);
    const calls = notes.filter((n) => n.created_by === s.uuid && /called|rang|voicemail|spoke to/i.test(n.body)).length;

    return { name: s.name, jobsCompleted, calls, revenue };
  });

  return performance;
}

export default async function StaffPerformance() {
  const data = await getStaffPerformance();

  return (
    <div style={{ padding: '2rem' }}>
      <Title order={1} mb="xl">Staff Performance</Title>
      <DataTable
        columns={[
          { accessor: 'name', title: 'Staff Name' },
          { accessor: 'jobsCompleted', title: 'Jobs Completed' },
          { accessor: 'calls', title: 'Calls Made' },
          { accessor: 'revenue', title: 'Revenue Generated', render: ({ revenue }) => `$${revenue.toFixed(2)}` },
        ]}
        records={data}
      />
    </div>
  );
}