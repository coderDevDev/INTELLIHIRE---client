'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  jobAPI,
  userAPI,
  applicationAPI,
  categoryAPI
} from '@/lib/api-service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AdminDashboardCharts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicantData, setApplicantData] = useState<any[]>([]);
  const [jobCategoryData, setJobCategoryData] = useState<any[]>([]);
  const [matchingData, setMatchingData] = useState<any[]>([]);
  const [applicationsPerJob, setApplicationsPerJob] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch applicants (for monthly registration trend)
        const applicantsRes = await userAPI.getApplicants({ limit: 1000 });
        const applicants = applicantsRes.users || [];
        // Group by month
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ];
        const applicantCounts: Record<string, number> = {};
        months.forEach(m => (applicantCounts[m] = 0));
        applicants.forEach((a: any) => {
          if (a.createdAt) {
            const d = new Date(a.createdAt);
            const m = months[d.getMonth()];
            applicantCounts[m] = (applicantCounts[m] || 0) + 1;
          }
        });
        setApplicantData(
          months.map(m => ({ month: m, count: applicantCounts[m] }))
        );

        // Fetch jobs (for job category distribution)
        const jobsRes = await jobAPI.getAdminJobs({ limit: 1000 });
        const jobs = jobsRes.jobs || [];
        // Fetch categories
        const categoriesRes = await categoryAPI.getCategories();
        const categories = categoriesRes.categories || categoriesRes;
        const catMap: Record<string, string> = {};
        categories.forEach((c: any) => (catMap[c._id] = c.name));
        const catCounts: Record<string, number> = {};
        jobs.forEach((job: any) => {
          const catName =
            catMap[job.categoryId?._id || job.categoryId] || 'Other';
          catCounts[catName] = (catCounts[catName] || 0) + 1;
        });
        const jobCatArr = Object.entries(catCounts).map(([name, value]) => ({
          name,
          value
        }));
        setJobCategoryData(jobCatArr);

        // Fetch applications (for matching analytics and per-job chart)
        const applicationsRes = await applicationAPI.getAdminApplications({
          limit: 1000
        });
        const applications = applicationsRes.applications || [];
        // Example: show status breakdown (hired, offered, interview, screening, applied)
        const statusList = [
          'hired',
          'offered',
          'interview',
          'screening',
          'applied'
        ];
        const statusCounts: Record<string, number> = {};
        statusList.forEach(s => (statusCounts[s] = 0));
        applications.forEach((app: any) => {
          statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        setMatchingData(
          statusList.map(s => ({
            name: s.charAt(0).toUpperCase() + s.slice(1),
            count: statusCounts[s]
          }))
        );

        // Applications per Job (bar chart)
        const jobAppCounts: Record<string, { title: string; count: number }> =
          {};
        applications.forEach((app: any) => {
          const jobId = app.jobId?._id || app.jobId;
          const jobTitle = app.jobId?.title || 'Unknown';
          if (!jobAppCounts[jobId])
            jobAppCounts[jobId] = { title: jobTitle, count: 0 };
          jobAppCounts[jobId].count += 1;
        });
        // Sort by count descending, show top 10
        const jobAppArr = Object.values(jobAppCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setApplicationsPerJob(jobAppArr);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading analytics...
      </div>
    );
  if (error)
    return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <Tabs defaultValue="applicants" className="space-y-4">
      <TabsList>
        <TabsTrigger value="applicants">Applicants</TabsTrigger>
        <TabsTrigger value="jobs">Job Categories</TabsTrigger>
        <TabsTrigger value="matching">Matching Analytics</TabsTrigger>
        <TabsTrigger value="perjob">Applications per Job</TabsTrigger>
      </TabsList>
      {/* Applicants Trend */}
      <TabsContent value="applicants" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Applicant Trends</CardTitle>
            <CardDescription>
              Monthly applicant registration over the past year
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-x-auto">
            <ChartContainer
              config={{
                count: {
                  label: 'Applicants',
                  color: 'hsl(var(--chart-1))'
                }
              }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicantData} margin={{ right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
      {/* Job Categories Pie */}
      <TabsContent value="jobs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Job Categories Distribution</CardTitle>
            <CardDescription>
              Distribution of job postings by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-x-auto">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {jobCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      {/* Matching Analytics Bar */}
      <TabsContent value="matching" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Matching Analytics</CardTitle>
            <CardDescription>Application status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-x-auto">
            <ChartContainer
              config={{
                count: {
                  label: 'Applications',
                  color: 'hsl(var(--chart-1))'
                }
              }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={matchingData} margin={{ right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
      {/* Applications per Job Bar */}
      <TabsContent value="perjob" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Applications per Job</CardTitle>
            <CardDescription>
              Top 10 jobs by number of applications
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-x-auto">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsPerJob} margin={{ right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="title"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
