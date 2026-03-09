import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { isAuthenticated } from '@/services/auth';
import { redirect } from 'next/navigation';
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
  if (!await isAuthenticated()) {
    redirect('/');
  }

  const jobs = await getJobList();

  const columns: ColumnDef<typeof jobs[0]>[] = [
    {
      accessorKey: "uuid",
      header: "Job ID",
    },
    {
      accessorKey: "company_name",
      header: "Customer",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "job_total",
      header: "Total",
      cell: ({ row }) => `$${row.original.job_total.toFixed(2)}`,
    },
    {
      accessorKey: "date_created",
      header: "Created",
      cell: ({ row }) => new Date(row.original.date_created).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link href={`/jobs/${row.original.uuid}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>
      <DataTable columns={columns} data={jobs} />
    </div>
  );
}
