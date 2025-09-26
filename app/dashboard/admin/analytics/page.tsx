'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  FileText,
  Calendar,
  MapPin,
  Building,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Eye,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { jobAPI, userAPI, applicationAPI } from '@/lib/api-service';

interface AnalyticsData {
  overview: {
    totalJobs: number;
    totalApplicants: number;
    totalApplications: number;
    totalCompanies: number;
    activeJobs: number;
    inactiveJobs: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
  };
  jobStats: {
    byCategory: Array<{ category: string; count: number; percentage: number }>;
    byLocation: Array<{ location: string; count: number; percentage: number }>;
    byEmploymentType: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    bySalaryRange: Array<{ range: string; count: number; percentage: number }>;
  };
  applicationStats: {
    byStatus: Array<{ status: string; count: number; percentage: number }>;
    byMonth: Array<{ month: string; count: number }>;
    byJob: Array<{ jobTitle: string; count: number; company: string }>;
  };
  trends: {
    jobPostings: Array<{ month: string; count: number }>;
    applications: Array<{ month: string; count: number }>;
    userRegistrations: Array<{ month: string; count: number }>;
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Simulate API calls - in real implementation, these would be actual API calls
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data - replace with actual API calls
      const mockData: AnalyticsData = {
        overview: {
          totalJobs: 156,
          totalApplicants: 1247,
          totalApplications: 3421,
          totalCompanies: 89,
          activeJobs: 98,
          inactiveJobs: 58,
          pendingApplications: 1234,
          approvedApplications: 1876,
          rejectedApplications: 311
        },
        jobStats: {
          byCategory: [
            { category: 'Information Technology', count: 45, percentage: 28.8 },
            { category: 'Healthcare', count: 32, percentage: 20.5 },
            { category: 'Education', count: 28, percentage: 17.9 },
            { category: 'Finance', count: 24, percentage: 15.4 },
            { category: 'Government', count: 27, percentage: 17.3 }
          ],
          byLocation: [
            { location: 'Manila', count: 67, percentage: 42.9 },
            { location: 'Cebu', count: 34, percentage: 21.8 },
            { location: 'Davao', count: 28, percentage: 17.9 },
            { location: 'Iloilo', count: 19, percentage: 12.2 },
            { location: 'Others', count: 8, percentage: 5.1 }
          ],
          byEmploymentType: [
            { type: 'Full-time', count: 89, percentage: 57.1 },
            { type: 'Part-time', count: 34, percentage: 21.8 },
            { type: 'Contract', count: 23, percentage: 14.7 },
            { type: 'Internship', count: 10, percentage: 6.4 }
          ],
          bySalaryRange: [
            { range: '₱15,000 - ₱25,000', count: 45, percentage: 28.8 },
            { range: '₱25,000 - ₱40,000', count: 38, percentage: 24.4 },
            { range: '₱40,000 - ₱60,000', count: 32, percentage: 20.5 },
            { range: '₱60,000+', count: 25, percentage: 16.0 },
            { range: 'Not specified', count: 16, percentage: 10.3 }
          ]
        },
        applicationStats: {
          byStatus: [
            { status: 'Pending', count: 1234, percentage: 36.1 },
            { status: 'Approved', count: 1876, percentage: 54.8 },
            { status: 'Rejected', count: 311, percentage: 9.1 }
          ],
          byMonth: [
            { month: 'Jan', count: 234 },
            { month: 'Feb', count: 287 },
            { month: 'Mar', count: 312 },
            { month: 'Apr', count: 298 },
            { month: 'May', count: 345 },
            { month: 'Jun', count: 378 }
          ],
          byJob: [
            {
              jobTitle: 'Software Developer',
              count: 156,
              company: 'Tech Corp'
            },
            { jobTitle: 'Nurse', count: 134, company: 'City Hospital' },
            { jobTitle: 'Teacher', count: 98, company: 'Public School' },
            { jobTitle: 'Accountant', count: 87, company: 'Finance Inc' },
            { jobTitle: 'Engineer', count: 76, company: 'Construction Co' }
          ]
        },
        trends: {
          jobPostings: [
            { month: 'Jan', count: 12 },
            { month: 'Feb', count: 18 },
            { month: 'Mar', count: 22 },
            { month: 'Apr', count: 19 },
            { month: 'May', count: 25 },
            { month: 'Jun', count: 28 }
          ],
          applications: [
            { month: 'Jan', count: 234 },
            { month: 'Feb', count: 287 },
            { month: 'Mar', count: 312 },
            { month: 'Apr', count: 298 },
            { month: 'May', count: 345 },
            { month: 'Jun', count: 378 }
          ],
          userRegistrations: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 52 },
            { month: 'Mar', count: 67 },
            { month: 'Apr', count: 58 },
            { month: 'May', count: 73 },
            { month: 'Jun', count: 81 }
          ]
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color = 'blue'
  }: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease';
    icon: any;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600'
    };

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            {title}
          </CardTitle>
          <Icon
            className={`h-5 w-5 ${colorClasses[color]} group-hover:scale-110 transition-transform`}
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {change && (
            <div className="flex items-center gap-1 text-xs mt-1">
              {changeType === 'increase' ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <span
                className={
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }>
                {change}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const ChartCard = ({
    title,
    description,
    children
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const SimpleBarChart = ({
    data,
    maxValue
  }: {
    data: Array<{ label: string; value: number }>;
    maxValue: number;
  }) => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{item.label}</span>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const SimpleLineChart = ({
    data
  }: {
    data: Array<{ month: string; count: number }>;
  }) => {
    const maxValue = Math.max(...data.map(d => d.count));

    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${(item.count / maxValue) * 100}px` }}
              />
              <span className="text-xs text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{maxValue}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <BarChart3 className="h-8 w-8 animate-pulse text-blue-600" />
            <p className="text-gray-600 font-medium">
              Loading analytics data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No data available
          </h3>
          <p className="text-gray-600">Unable to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
        <div
          className="absolute bottom-40 right-1/3 w-64 h-64 bg-green-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-yellow-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Comprehensive insights and performance metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="bg-white/60 backdrop-blur-sm border-white/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300"
              onClick={fetchAnalyticsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Overview Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Jobs"
              value={data.overview.totalJobs}
              change="+12%"
              changeType="increase"
              icon={Briefcase}
              color="blue"
            />
            <StatCard
              title="Total Applicants"
              value={data.overview.totalApplicants}
              change="+8%"
              changeType="increase"
              icon={Users}
              color="green"
            />
            <StatCard
              title="Total Applications"
              value={data.overview.totalApplications}
              change="+15%"
              changeType="increase"
              icon={FileText}
              color="purple"
            />
            <StatCard
              title="Active Companies"
              value={data.overview.totalCompanies}
              change="+5%"
              changeType="increase"
              icon={Building}
              color="orange"
            />
          </div>

          {/* Analytics Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-6">
            <TabsList className="bg-white/60 backdrop-blur-sm border-white/50">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Job Analytics
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Applications
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Application Status Distribution"
                  description="Current status of all applications">
                  <div className="space-y-4">
                    {data.applicationStats.byStatus.map((status, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              status.status === 'Approved'
                                ? 'bg-green-500'
                                : status.status === 'Pending'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {status.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {status.count}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({status.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                <ChartCard
                  title="Job Status Overview"
                  description="Active vs inactive job postings">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Active Jobs
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {data.overview.activeJobs}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Inactive Jobs
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {data.overview.inactiveJobs}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Active: {data.overview.activeJobs}</span>
                        <span>Inactive: {data.overview.inactiveJobs}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (data.overview.activeJobs /
                                (data.overview.activeJobs +
                                  data.overview.inactiveJobs)) *
                              100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Jobs by Category"
                  description="Distribution of job postings by category">
                  <SimpleBarChart
                    data={data.jobStats.byCategory.map(cat => ({
                      label: cat.category,
                      value: cat.count
                    }))}
                    maxValue={Math.max(
                      ...data.jobStats.byCategory.map(cat => cat.count)
                    )}
                  />
                </ChartCard>

                <ChartCard
                  title="Jobs by Location"
                  description="Geographic distribution of job postings">
                  <SimpleBarChart
                    data={data.jobStats.byLocation.map(loc => ({
                      label: loc.location,
                      value: loc.count
                    }))}
                    maxValue={Math.max(
                      ...data.jobStats.byLocation.map(loc => loc.count)
                    )}
                  />
                </ChartCard>

                <ChartCard
                  title="Employment Types"
                  description="Distribution by employment type">
                  <SimpleBarChart
                    data={data.jobStats.byEmploymentType.map(type => ({
                      label: type.type,
                      value: type.count
                    }))}
                    maxValue={Math.max(
                      ...data.jobStats.byEmploymentType.map(type => type.count)
                    )}
                  />
                </ChartCard>

                <ChartCard
                  title="Salary Ranges"
                  description="Distribution by salary range">
                  <SimpleBarChart
                    data={data.jobStats.bySalaryRange.map(range => ({
                      label: range.range,
                      value: range.count
                    }))}
                    maxValue={Math.max(
                      ...data.jobStats.bySalaryRange.map(range => range.count)
                    )}
                  />
                </ChartCard>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Applications Over Time"
                  description="Monthly application trends">
                  <SimpleLineChart data={data.applicationStats.byMonth} />
                </ChartCard>

                <ChartCard
                  title="Top Jobs by Applications"
                  description="Most popular job postings">
                  <div className="space-y-3">
                    {data.applicationStats.byJob
                      .slice(0, 5)
                      .map((job, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50">
                          <div>
                            <p className="font-medium text-gray-900">
                              {job.jobTitle}
                            </p>
                            <p className="text-sm text-gray-600">
                              {job.company}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700">
                            {job.count} applications
                          </Badge>
                        </div>
                      ))}
                  </div>
                </ChartCard>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <ChartCard
                  title="Job Postings Trend"
                  description="Monthly job posting activity">
                  <SimpleLineChart data={data.trends.jobPostings} />
                </ChartCard>

                <ChartCard
                  title="Application Trends"
                  description="Monthly application volume">
                  <SimpleLineChart data={data.trends.applications} />
                </ChartCard>

                <ChartCard
                  title="User Registration Trends"
                  description="New user registrations">
                  <SimpleLineChart data={data.trends.userRegistrations} />
                </ChartCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
