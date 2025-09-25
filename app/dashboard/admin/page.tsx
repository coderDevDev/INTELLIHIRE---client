'use client';

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
import {
  BarChart,
  Briefcase,
  FileUp,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  UserPlus,
  FileText,
  Settings,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { AdminDashboardCharts } from '@/components/admin-dashboard-charts';
import { useEffect, useState } from 'react';
import { authAPI, jobAPI, userAPI, applicationAPI } from '@/lib/api-service';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    documentsProcessed: 0,
    successfulMatches: 0,
    successRate: 0
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);

        // Fetch all data in parallel
        const [jobsRes, applicantsRes, applicationsRes] = await Promise.all([
          jobAPI.getAdminJobs({ limit: 10, page: 1 }),
          userAPI.getApplicants({ limit: 10, page: 1 }),
          applicationAPI.getAdminApplications({ limit: 100, page: 1 })
        ]);

        console.log('API Responses:', {
          jobsRes,
          applicantsRes,
          applicationsRes
        });

        // Process jobs data
        const jobs = jobsRes.jobs || [];
        setRecentJobs(
          jobs.slice(0, 4).map((job: any) => ({
            id: job._id,
            title: job.title,
            company: job.companyId?.name || 'Unknown Company',
            posted: job.postedDate
              ? new Date(job.postedDate).toLocaleDateString()
              : 'Unknown',
            applicants: 0, // Will be calculated from applications
            status: job.status,
            location: job.location
          }))
        );

        // Process applicants data
        const applicants = applicantsRes.users || applicantsRes || [];
        console.log('Applicants data:', applicants);

        if (!Array.isArray(applicants)) {
          console.error('Applicants is not an array:', applicants);
          setRecentApplicants([]);
        } else {
          setRecentApplicants(
            applicants.slice(0, 4).map((applicant: any) => ({
              id: applicant._id,
              name:
                `${applicant.firstName || ''} ${
                  applicant.lastName || ''
                }`.trim() || 'Unknown',
              position: 'Applicant',
              status: 'active',
              applied: applicant.createdAt
                ? new Date(applicant.createdAt).toLocaleDateString()
                : 'Unknown',
              avatar: applicant.firstName?.[0] || applicant.lastName?.[0] || 'U'
            }))
          );
        }

        // Calculate statistics
        const activeJobs = jobs.filter(
          (job: any) => job.status === 'active'
        ).length;
        const totalApplicants = applicants.length;
        const applications =
          applicationsRes.applications || applicationsRes || [];
        const successfulMatches = applications.filter((app: any) =>
          ['hired', 'offered'].includes(app.status)
        ).length;
        const successRate =
          applications.length > 0
            ? Math.round((successfulMatches / applications.length) * 100)
            : 0;

        setStats({
          activeJobs,
          totalApplicants,
          documentsProcessed: totalApplicants * 2, // Estimate: each applicant has PDS and resume
          successfulMatches,
          successRate
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      case 'screening':
        return 'bg-yellow-100 text-yellow-700';
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'offered':
        return 'bg-blue-100 text-blue-700';
      case 'hired':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'screening':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'interview':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'offered':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'hired':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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
            <p className="text-gray-600 font-medium">
              Loading admin dashboard...
            </p>
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
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90"
              asChild>
              <Link
                href="/dashboard/admin/jobs"
                className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Manage Jobs
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              asChild>
              <Link
                href="/dashboard/admin/applicants"
                className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                View Applicants
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Active Job Postings
                </CardTitle>
                <Briefcase className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.activeJobs}
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  Active positions
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Applicants
                </CardTitle>
                <Users className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.totalApplicants}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  Registered users
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Documents Processed
                </CardTitle>
                <FileUp className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.documentsProcessed}
                </div>
                <p className="text-xs text-purple-600">PDS and Resumes</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Success Rate
                </CardTitle>
                <BarChart className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.successRate}%
                </div>
                <p className="text-xs text-orange-600">
                  {stats.successfulMatches} successful matches
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                System Analytics
              </CardTitle>
              <CardDescription>
                Key metrics and trends for the job application system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminDashboardCharts />
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Job Postings */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Recent Job Postings
                  </CardTitle>
                  <CardDescription>
                    Latest job postings added to the system
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  asChild>
                  <Link
                    href="/dashboard/admin/jobs"
                    className="flex items-center gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJobs.length > 0 ? (
                  recentJobs.map(job => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {job.title}
                          </h4>
                          <Badge
                            className={`text-xs ${getStatusColor(job.status)}`}>
                            {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>Posted {job.posted}</span>
                          <span>•</span>
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/admin/jobs/${job.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No jobs posted yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applicants */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    Recent Applicants
                  </CardTitle>
                  <CardDescription>
                    Latest applicants in the system
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  asChild>
                  <Link
                    href="/dashboard/admin/applicants"
                    className="flex items-center gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplicants.length > 0 ? (
                  recentApplicants.map(applicant => (
                    <div
                      key={applicant.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                          {applicant.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {applicant.name}
                            </h4>
                            <Badge
                              className={`text-xs ${getStatusColor(
                                applicant.status
                              )}`}>
                              {getStatusIcon(applicant.status)}
                              {applicant.status.charAt(0).toUpperCase() +
                                applicant.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {applicant.position}
                          </p>
                          <p className="text-xs text-gray-500">
                            Applied {applicant.applied}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/admin/applicants/${applicant.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No applicants yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Quick Actions
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                  asChild>
                  <Link href="/dashboard/admin/applications">
                    <FileText className="h-6 w-6 text-purple-600" />
                    <span>View Applications</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                  asChild>
                  <Link href="/dashboard/admin/settings">
                    <Settings className="h-6 w-6 text-orange-600" />
                    <span>System Settings</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
