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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  BarChart3,
  FileText,
  RefreshCw,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Settings,
  Activity
} from 'lucide-react';
import { jobAPI, userAPI, applicationAPI } from '@/lib/api-service';
import { toast } from 'sonner';

interface ReportData {
  applicantSummary: {
    totalApplicants: number;
    newThisMonth: number;
    byEducation: Array<{ level: string; count: number }>;
    byExperience: Array<{ range: string; count: number }>;
    byLocation: Array<{ location: string; count: number }>;
  };
  jobSuccess: {
    totalJobs: number;
    activeJobs: number;
    applicationsPerJob: Array<{
      jobTitle: string;
      applications: number;
      successRate: number;
    }>;
    topPerformingJobs: Array<{
      jobTitle: string;
      company: string;
      applications: number;
    }>;
  };
  systemMetrics: {
    totalUsers: number;
    totalApplications: number;
    averageProcessingTime: number;
    systemUptime: number;
  };
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchReportsData();
  }, [selectedPeriod]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      // Fetch data from APIs
      const [jobsRes, applicantsRes, applicationsRes] = await Promise.all([
        jobAPI.getAdminJobs({ limit: 1000, page: 1 }),
        userAPI.getApplicants({ limit: 1000, page: 1 }),
        applicationAPI.getAdminApplications({ limit: 1000, page: 1 })
      ]);

      const jobs = jobsRes.jobs || [];
      const applicants = applicantsRes.users || applicantsRes || [];
      const applications =
        applicationsRes.applications || applicationsRes || [];

      // Process data for reports
      const reportData: ReportData = {
        applicantSummary: {
          totalApplicants: applicants.length,
          newThisMonth: applicants.filter((app: any) => {
            const createdAt = new Date(app.createdAt);
            const now = new Date();
            return (
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            );
          }).length,
          byEducation: processEducationData(applicants),
          byExperience: processExperienceData(applicants),
          byLocation: processLocationData(applicants)
        },
        jobSuccess: {
          totalJobs: jobs.length,
          activeJobs: jobs.filter((job: any) => job.status === 'active').length,
          applicationsPerJob: processJobApplications(jobs, applications),
          topPerformingJobs: processTopJobs(jobs, applications)
        },
        systemMetrics: {
          totalUsers: applicants.length,
          totalApplications: applications.length,
          averageProcessingTime: 2.5, // Mock data
          systemUptime: 99.9 // Mock data
        }
      };

      setData(reportData);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const processEducationData = (applicants: any[]) => {
    const educationMap = new Map();
    applicants.forEach(applicant => {
      if (applicant.education && applicant.education.length > 0) {
        applicant.education.forEach((edu: any) => {
          const level = edu.degree || 'Unknown';
          educationMap.set(level, (educationMap.get(level) || 0) + 1);
        });
      }
    });
    return Array.from(educationMap.entries()).map(([level, count]) => ({
      level,
      count
    }));
  };

  const processExperienceData = (applicants: any[]) => {
    const ranges = [
      { range: '0-1 years', min: 0, max: 1 },
      { range: '2-3 years', min: 2, max: 3 },
      { range: '4-5 years', min: 4, max: 5 },
      { range: '6-10 years', min: 6, max: 10 },
      { range: '10+ years', min: 10, max: Infinity }
    ];

    return ranges.map(range => ({
      range: range.range,
      count: applicants.filter(applicant => {
        const expCount = applicant.experience ? applicant.experience.length : 0;
        return expCount >= range.min && expCount <= range.max;
      }).length
    }));
  };

  const processLocationData = (applicants: any[]) => {
    const locationMap = new Map();
    applicants.forEach(applicant => {
      const location =
        applicant.address?.city || applicant.address?.province || 'Unknown';
      locationMap.set(location, (locationMap.get(location) || 0) + 1);
    });
    return Array.from(locationMap.entries()).map(([location, count]) => ({
      location,
      count
    }));
  };

  const processJobApplications = (jobs: any[], applications: any[]) => {
    return jobs.slice(0, 10).map(job => {
      const jobApplications = applications.filter(
        (app: any) => app.jobId?._id === job._id
      );
      const successfulApps = jobApplications.filter((app: any) =>
        ['hired', 'offered'].includes(app.status)
      );
      const successRate =
        jobApplications.length > 0
          ? Math.round((successfulApps.length / jobApplications.length) * 100)
          : 0;

      return {
        jobTitle: job.title,
        applications: jobApplications.length,
        successRate
      };
    });
  };

  const processTopJobs = (jobs: any[], applications: any[]) => {
    return jobs
      .map(job => {
        const jobApplications = applications.filter(
          (app: any) => app.jobId?._id === job._id
        );
        return {
          jobTitle: job.title,
          company: job.companyId?.name || 'Unknown',
          applications: jobApplications.length
        };
      })
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);
  };

  const generateReport = async (reportType: string) => {
    try {
      setGeneratingReport(reportType);

      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`${reportType} report generated successfully`);
    } catch (error) {
      toast.error(`Failed to generate ${reportType} report`);
    } finally {
      setGeneratingReport(null);
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting report as ${format.toUpperCase()}`);
    // Implementation would trigger actual file download
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
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-sm text-gray-600">
                Generate comprehensive reports and analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
              onClick={() => fetchReportsData()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Applicants
                </CardTitle>
                <Users className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data?.applicantSummary.totalApplicants || 0}
                </div>
                <p className="text-xs text-blue-600">
                  {data?.applicantSummary.newThisMonth || 0} new this month
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Active Jobs
                </CardTitle>
                <Briefcase className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data?.jobSuccess.activeJobs || 0}
                </div>
                <p className="text-xs text-green-600">
                  {data?.jobSuccess.totalJobs || 0} total jobs
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Applications
                </CardTitle>
                <FileText className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data?.systemMetrics.totalApplications || 0}
                </div>
                <p className="text-xs text-purple-600">All time applications</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  System Uptime
                </CardTitle>
                <Activity className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {data?.systemMetrics.systemUptime || 0}%
                </div>
                <p className="text-xs text-orange-600">System reliability</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="applicant-summary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-white/50">
              <TabsTrigger
                value="applicant-summary"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Applicant Summary
              </TabsTrigger>
              <TabsTrigger
                value="job-success"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Job Success Report
              </TabsTrigger>
              <TabsTrigger
                value="system-metrics"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                System Metrics
              </TabsTrigger>
            </TabsList>

            {/* Applicant Summary Report */}
            <TabsContent value="applicant-summary" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Applicant Summary Report
                    </CardTitle>
                    <CardDescription>
                      Comprehensive overview of applicant demographics and
                      qualifications
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport('applicant-summary')}
                      disabled={generatingReport === 'applicant-summary'}
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      {generatingReport === 'applicant-summary' ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Generate Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportReport('pdf')}
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Education Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Education Distribution
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data?.applicantSummary.byEducation.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {item.level}
                            </span>
                            <Badge className="bg-blue-100 text-blue-700">
                              {item.count}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Experience Distribution
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data?.applicantSummary.byExperience.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                {item.range}
                              </span>
                              <Badge className="bg-green-100 text-green-700">
                                {item.count}
                              </Badge>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Location Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Location Distribution
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data?.applicantSummary.byLocation
                        .slice(0, 9)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                {item.location}
                              </span>
                              <Badge className="bg-purple-100 text-purple-700">
                                {item.count}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Success Report */}
            <TabsContent value="job-success" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Job Success Report
                    </CardTitle>
                    <CardDescription>
                      Analysis of job posting performance and application
                      success rates
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport('job-success')}
                      disabled={generatingReport === 'job-success'}
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      {generatingReport === 'job-success' ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Generate Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportReport('excel')}
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Applications per Job */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Applications per Job
                    </h3>
                    <div className="space-y-3">
                      {data?.jobSuccess.applicationsPerJob.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">
                                {item.jobTitle}
                              </span>
                              <div className="flex gap-2">
                                <Badge className="bg-blue-100 text-blue-700">
                                  {item.applications} applications
                                </Badge>
                                <Badge className="bg-green-100 text-green-700">
                                  {item.successRate}% success
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Top Performing Jobs */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Top Performing Jobs
                    </h3>
                    <div className="space-y-3">
                      {data?.jobSuccess.topPerformingJobs.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900">
                                {item.jobTitle}
                              </span>
                              <p className="text-sm text-gray-600">
                                {item.company}
                              </p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-700">
                              {item.applications} applications
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Metrics */}
            <TabsContent value="system-metrics" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      System Metrics Report
                    </CardTitle>
                    <CardDescription>
                      System performance and operational metrics
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport('system-metrics')}
                      disabled={generatingReport === 'system-metrics'}
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      {generatingReport === 'system-metrics' ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Generate Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportReport('csv')}
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        Performance Metrics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">
                            Average Processing Time
                          </span>
                          <Badge className="bg-blue-100 text-blue-700">
                            {data?.systemMetrics.averageProcessingTime || 0}{' '}
                            days
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">System Uptime</span>
                          <Badge className="bg-green-100 text-green-700">
                            {data?.systemMetrics.systemUptime || 0}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Total Users</span>
                          <Badge className="bg-purple-100 text-purple-700">
                            {data?.systemMetrics.totalUsers || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        System Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">
                            Database Connection
                          </span>
                          <Badge className="bg-green-100 text-green-700 ml-auto">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">AI Services</span>
                          <Badge className="bg-green-100 text-green-700 ml-auto">
                            Operational
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">Email Service</span>
                          <Badge className="bg-green-100 text-green-700 ml-auto">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
