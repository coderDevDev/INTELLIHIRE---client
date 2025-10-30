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
  const [refreshing, setRefreshing] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
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
      if (!loading) {
        toast.success('Reports data refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReportsData();
  };

  const handleExportAll = async () => {
    if (!data) {
      toast.error('No data available to export');
      return;
    }

    try {
      setExportingAll(true);
      toast.info('Generating comprehensive CSV report...');

      // Generate CSV sections
      const csvSections = [];

      // Header
      csvSections.push('INTELLIHIRE COMPREHENSIVE REPORT');
      csvSections.push(`Generated,${new Date().toLocaleString()}`);
      csvSections.push(`Period,${selectedPeriod}`);
      csvSections.push('');

      // Applicant Summary
      csvSections.push('APPLICANT SUMMARY');
      csvSections.push('Metric,Value');
      csvSections.push(
        `Total Applicants,${data.applicantSummary.totalApplicants}`
      );
      csvSections.push(`New This Month,${data.applicantSummary.newThisMonth}`);
      csvSections.push('');

      csvSections.push('EDUCATION DISTRIBUTION');
      csvSections.push('Education Level,Count');
      data.applicantSummary.byEducation.forEach(item => {
        csvSections.push(`"${item.level}",${item.count}`);
      });
      csvSections.push('');

      csvSections.push('EXPERIENCE DISTRIBUTION');
      csvSections.push('Experience Range,Count');
      data.applicantSummary.byExperience.forEach(item => {
        csvSections.push(`"${item.range}",${item.count}`);
      });
      csvSections.push('');

      csvSections.push('LOCATION DISTRIBUTION');
      csvSections.push('Location,Count');
      data.applicantSummary.byLocation.forEach(item => {
        csvSections.push(`"${item.location}",${item.count}`);
      });
      csvSections.push('');

      // Job Success Report
      csvSections.push('JOB SUCCESS REPORT');
      csvSections.push('Metric,Value');
      csvSections.push(`Total Jobs,${data.jobSuccess.totalJobs}`);
      csvSections.push(`Active Jobs,${data.jobSuccess.activeJobs}`);
      csvSections.push('');

      csvSections.push('APPLICATIONS PER JOB');
      csvSections.push('Job Title,Applications,Success Rate (%)');
      data.jobSuccess.applicationsPerJob.forEach(item => {
        csvSections.push(
          `"${item.jobTitle}",${item.applications},${item.successRate}`
        );
      });
      csvSections.push('');

      csvSections.push('TOP PERFORMING JOBS');
      csvSections.push('Job Title,Company,Applications');
      data.jobSuccess.topPerformingJobs.forEach(item => {
        csvSections.push(
          `"${item.jobTitle}","${item.company}",${item.applications}`
        );
      });
      csvSections.push('');

      // System Metrics
      csvSections.push('SYSTEM METRICS');
      csvSections.push('Metric,Value');
      csvSections.push(`Total Users,${data.systemMetrics.totalUsers}`);
      csvSections.push(
        `Total Applications,${data.systemMetrics.totalApplications}`
      );
      csvSections.push(
        `Average Processing Time (days),${data.systemMetrics.averageProcessingTime}`
      );
      csvSections.push(`System Uptime (%),${data.systemMetrics.systemUptime}`);
      csvSections.push('');

      const csvContent = csvSections.join('\n');

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `intellihire-comprehensive-report-${
        new Date().toISOString().split('T')[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Comprehensive report exported successfully');
    } catch (error) {
      console.error('Error exporting comprehensive report:', error);
      toast.error('Failed to export comprehensive report');
    } finally {
      setExportingAll(false);
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
    if (!data) {
      toast.error('No data available to generate report');
      return;
    }

    try {
      setGeneratingReport(reportType);
      toast.info(`Generating ${reportType} report...`);

      let reportContent = '';

      if (reportType === 'applicant-summary') {
        reportContent = `
APPLICANT SUMMARY REPORT
Generated: ${new Date().toLocaleString()}
Period: ${selectedPeriod}
============================================

OVERVIEW
-------------------------------------------
Total Applicants: ${data.applicantSummary.totalApplicants}
New This Month: ${data.applicantSummary.newThisMonth}

EDUCATION DISTRIBUTION
-------------------------------------------
${data.applicantSummary.byEducation
  .map(item => `${item.level}: ${item.count}`)
  .join('\n')}

EXPERIENCE DISTRIBUTION
-------------------------------------------
${data.applicantSummary.byExperience
  .map(item => `${item.range}: ${item.count}`)
  .join('\n')}

LOCATION DISTRIBUTION (Top 10)
-------------------------------------------
${data.applicantSummary.byLocation
  .slice(0, 10)
  .map(item => `${item.location}: ${item.count}`)
  .join('\n')}

============================================
        `.trim();
      } else if (reportType === 'job-success') {
        reportContent = `
JOB SUCCESS REPORT
Generated: ${new Date().toLocaleString()}
Period: ${selectedPeriod}
============================================

OVERVIEW
-------------------------------------------
Total Jobs: ${data.jobSuccess.totalJobs}
Active Jobs: ${data.jobSuccess.activeJobs}

APPLICATIONS PER JOB (Top 10)
-------------------------------------------
${data.jobSuccess.applicationsPerJob
  .map(
    (item, i) =>
      `${i + 1}. ${item.jobTitle}
   Applications: ${item.applications}
   Success Rate: ${item.successRate}%`
  )
  .join('\n\n')}

TOP PERFORMING JOBS
-------------------------------------------
${data.jobSuccess.topPerformingJobs
  .map(
    (item, i) =>
      `${i + 1}. ${item.jobTitle} (${item.company})
   Applications: ${item.applications}`
  )
  .join('\n\n')}

============================================
        `.trim();
      } else if (reportType === 'system-metrics') {
        reportContent = `
SYSTEM METRICS REPORT
Generated: ${new Date().toLocaleString()}
Period: ${selectedPeriod}
============================================

SYSTEM PERFORMANCE
-------------------------------------------
Total Users: ${data.systemMetrics.totalUsers}
Total Applications: ${data.systemMetrics.totalApplications}
Average Processing Time: ${data.systemMetrics.averageProcessingTime} days
System Uptime: ${data.systemMetrics.systemUptime}%

SYSTEM STATUS
-------------------------------------------
Database Connection: Active
AI Services: Operational
Email Service: Active

============================================
        `.trim();
      }

      // Download the report
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-${
        new Date().toISOString().split('T')[0]
      }.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `${reportType} report generated and downloaded successfully`
      );
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(`Failed to generate ${reportType} report`);
    } finally {
      setGeneratingReport(null);
    }
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!data) {
      toast.error('No data available to export');
      return;
    }

    try {
      toast.info(`Preparing ${format.toUpperCase()} export...`);

      // Generate comprehensive report
      const report = `
INTELLIHIRE COMPREHENSIVE REPORT
Generated: ${new Date().toLocaleString()}
Period: ${selectedPeriod}
Export Format: ${format.toUpperCase()}
============================================

APPLICANT SUMMARY
-------------------------------------------
Total Applicants: ${data.applicantSummary.totalApplicants}
New This Month: ${data.applicantSummary.newThisMonth}

Education Distribution:
${data.applicantSummary.byEducation
  .map(item => `  ${item.level}: ${item.count}`)
  .join('\n')}

Experience Distribution:
${data.applicantSummary.byExperience
  .map(item => `  ${item.range}: ${item.count}`)
  .join('\n')}

Top Locations:
${data.applicantSummary.byLocation
  .slice(0, 5)
  .map(item => `  ${item.location}: ${item.count}`)
  .join('\n')}

JOB SUCCESS METRICS
-------------------------------------------
Total Jobs: ${data.jobSuccess.totalJobs}
Active Jobs: ${data.jobSuccess.activeJobs}

Top Performing Jobs:
${data.jobSuccess.topPerformingJobs
  .map(
    (item, i) =>
      `  ${i + 1}. ${item.jobTitle} (${item.company}) - ${
        item.applications
      } applications`
  )
  .join('\n')}

SYSTEM METRICS
-------------------------------------------
Total Users: ${data.systemMetrics.totalUsers}
Total Applications: ${data.systemMetrics.totalApplications}
Average Processing Time: ${data.systemMetrics.averageProcessingTime} days
System Uptime: ${data.systemMetrics.systemUptime}%

============================================
End of Report
      `.trim();

      // Create and download file
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `intellihire-report-${format}-${
        new Date().toISOString().split('T')[0]
      }.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Report exported as ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error(`Failed to export report as ${format.toUpperCase()}`);
    }
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
      </div>

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
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
              {refreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleExportAll}
              disabled={exportingAll || loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              {exportingAll ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export All Reports
                </>
              )}
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
              {/* <TabsTrigger
                value="system-metrics"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                System Metrics
              </TabsTrigger>  */}
            </TabsList>

            {/* Applicant Summary Report */}
            <TabsContent value="applicant-summary" className="space-y-6">
              {/* Stats Overview Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Total Applicants
                        </p>
                        <h3 className="text-3xl font-bold mt-2">
                          {data?.applicantSummary.totalApplicants || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">
                          New This Month
                        </p>
                        <h3 className="text-3xl font-bold mt-2">
                          {data?.applicantSummary.newThisMonth || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">
                          Education Levels
                        </p>
                        <h3 className="text-3xl font-bold mt-2">
                          {data?.applicantSummary.byEducation.length || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">
                          Locations
                        </p>
                        <h3 className="text-3xl font-bold mt-2">
                          {data?.applicantSummary.byLocation.length || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Applicant Demographics & Qualifications
                    </CardTitle>
                    <CardDescription>
                      Detailed breakdown of applicant profiles and
                      qualifications
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport('applicant-summary')}
                      disabled={generatingReport === 'applicant-summary'}
                      className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
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
                      className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Education Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Education Distribution
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data?.applicantSummary.byEducation
                        .sort((a, b) => b.count - a.count)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-white/50 bg-gradient-to-br from-white/60 to-blue-50/30 backdrop-blur-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></div>
                                <span className="font-medium text-gray-900">
                                  {item.level}
                                </span>
                              </div>
                              <Badge className="bg-blue-500 text-white">
                                {item.count}
                              </Badge>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    (item.count /
                                      (data?.applicantSummary.totalApplicants ||
                                        1)) *
                                      100,
                                    100
                                  )}%`
                                }}></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Experience Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-green-600" />
                      Experience Distribution
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data?.applicantSummary.byExperience.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-white/50 bg-gradient-to-br from-white/60 to-green-50/30 backdrop-blur-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform"></div>
                                <span className="font-medium text-gray-900">
                                  {item.range}
                                </span>
                              </div>
                              <Badge className="bg-green-500 text-white">
                                {item.count}
                              </Badge>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    (item.count /
                                      (data?.applicantSummary.totalApplicants ||
                                        1)) *
                                      100,
                                    100
                                  )}%`
                                }}></div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Location Distribution */}
                  {/* <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Top Locations
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data?.applicantSummary.byLocation
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 9)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-white/50 bg-gradient-to-br from-white/60 to-purple-50/30 backdrop-blur-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-purple-500 group-hover:scale-125 transition-transform"></div>
                                <span className="font-medium text-gray-900">
                                  {item.location}
                                </span>
                              </div>
                              <Badge className="bg-purple-500 text-white">
                                {item.count}
                              </Badge>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${Math.min((item.count / (data?.applicantSummary.totalApplicants || 1)) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div> */}
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
