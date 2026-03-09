import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Phone, Trophy, DollarSign, Percent } from "lucide-react";
import { getJobs, apiRequest, getStaff, getCompanies } from '@/services/servicem8';
import { cookies } from 'next/headers';
import { FunnelChart } from '@/components/funnel-chart';
import { DataTable } from '@/components/data-table';

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
  try {
    const jobs: Job[] = await getJobs({ $filter: "active eq 1" });
    const notes = await apiRequest('note.json', 'GET', null, { $filter: "active eq 1" }); // Fetch all active notes
    const staff = await getStaff();
    const completedJobs = await getJobs({ $filter: "status eq 'Completed' and active eq 1" });
    const activeCompanies = await getCompanies({ $filter: "active eq 1" });
    const leads = activeCompanies.length;

    const quotes = jobs.filter(job => job.status === 'Quote').length;
    const wonJobs = jobs.filter(job => job.status === 'Completed').length;
    const conversion = quotes > 0 ? (wonJobs / quotes) * 100 : 0;
    const totalValue = jobs.reduce((sum, job) => sum + (job.status === 'Completed' ? job.job_total : 0), 0);
    const callsMade = notes.filter((note: Note) => /called|rang|voicemail|spoke to/i.test(note.note || '')).length;

    const funnelData = [
      { name: 'Leads', value: leads, color: '#8884d8' },
      { name: 'Quotes', value: quotes, color: '#82ca9d' },
      { name: 'Won', value: wonJobs, color: '#ffc658' },
    ];

    const staffData = staff.map((s: any) => {
      const staffJobs = completedJobs.filter((j: any) => j.assigned_to_uuid === s.uuid);
      const jobsCompleted = staffJobs.length;
      const revenue = staffJobs.reduce((sum: number, j: any) => sum + parseFloat(j.job_total || '0'), 0);
      return { name: s.name, jobsCompleted, revenue };
    });

    return { quotes, wonJobs, conversion, totalValue, callsMade, funnelData, staffData };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sm8_token')?.value;

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <h1 className="text-3xl font-bold mb-4">Welcome to RDW Roofing Dashboard</h1>
        <Button asChild size="lg">
          <a href="/api/oauth">Login with ServiceM8</a>
        </Button>
      </div>
    );
  }

  let data;
  try {
    data = await getDashboardData();
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    return <div>Error loading dashboard. Please try logging in again.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotes</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.quotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Jobs</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.wonJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion %</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversion.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.callsMade}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sales Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelChart data={data.funnelData || []} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={data.staffData || []} columns={[
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'jobsCompleted', header: 'Jobs Completed' },
            { accessorKey: 'revenue', header: 'Revenue' },
          ]} />
        </CardContent>
      </Card>
    </div>
  );
}
