import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { isAuthenticated } from '@/services/auth';
import { redirect } from 'next/navigation';
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
  if (!await isAuthenticated()) {
    redirect('/');
  }

  const data = await getStaffPerformance();

  const columns: ColumnDef<typeof data[0]>[] = [
    {
      accessorKey: "name",
      header: "Staff Name",
    },
    {
      accessorKey: "jobsCompleted",
      header: "Jobs Completed",
    },
    {
      accessorKey: "calls",
      header: "Calls Made",
    },
    {
      accessorKey: "revenue",
      header: "Revenue Generated",
      cell: ({ row }) => `$${row.original.revenue.toFixed(2)}`,
    },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Staff Performance</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
