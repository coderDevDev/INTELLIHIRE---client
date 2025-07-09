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
import { authAPI } from '@/lib/api-service';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 12,
    totalApplicants: 245,
    documentsProcessed: 189,
    successfulMatches: 78,
    successRate: 32
  });

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
    // TODO: Fetch real admin statistics
    setLoading(false);
  }, []);

  const recentJobs = [
    {
      id: 1,
      title: 'Software Developer',
      company: 'Tech Solutions Inc.',
      posted: '2 days ago',
      applicants: 18,
      status: 'active',
      location: 'Sto. Tomas'
    },
    {
      id: 2,
      title: 'Web Designer',
      company: 'Creative Agency',
      posted: '3 days ago',
      applicants: 12,
      status: 'active',
      location: 'Sto. Tomas'
    },
    {
      id: 3,
      title: 'Project Manager',
      company: 'Construction Corp',
      posted: '5 days ago',
      applicants: 24,
      status: 'active',
      location: 'Sto. Tomas'
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      company: 'Digital Marketing Co.',
      posted: '1 week ago',
      applicants: 9,
      status: 'closed',
      location: 'Sto. Tomas'
    }
  ];

  const recentApplicants = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Software Developer',
      status: 'screening',
      applied: '2 hours ago',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Web Designer',
      status: 'interview',
      applied: '1 day ago',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      position: 'Project Manager',
      status: 'offered',
      applied: '2 days ago',
      avatar: 'RJ'
    },
    {
      id: 4,
      name: 'Emily Williams',
      position: 'Marketing Specialist',
      status: 'hired',
      applied: '3 days ago',
      avatar: 'EW'
    }
  ];

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
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Welcome back, {user?.firstName || 'Admin'}! Here's your system
              overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link
                href="/dashboard/admin/jobs"
                className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Manage Jobs
              </Link>
            </Button>
            <Button size="sm" asChild>
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

      <main className="flex-1 overflow-auto">
        <div className="container px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">
                  Active Job Postings
                </CardTitle>
                <Briefcase className="h-5 w-5 text-blue-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeJobs}</div>
                <div className="flex items-center gap-1 text-xs text-blue-200">
                  <TrendingUp className="h-3 w-3" />
                  +2 from last month
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">
                  Total Applicants
                </CardTitle>
                <Users className="h-5 w-5 text-green-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.totalApplicants}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-200">
                  <TrendingUp className="h-3 w-3" />
                  +18% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">
                  Documents Processed
                </CardTitle>
                <FileUp className="h-5 w-5 text-purple-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.documentsProcessed}
                </div>
                <p className="text-xs text-purple-200">PDS and Resumes</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-100">
                  Success Rate
                </CardTitle>
                <BarChart className="h-5 w-5 text-orange-200 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.successRate}%</div>
                <p className="text-xs text-orange-200">
                  {stats.successfulMatches} successful matches
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-brand-blue" />
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
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-brand-blue" />
                    Recent Job Postings
                  </CardTitle>
                  <CardDescription>
                    Latest job postings added to the system
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="/dashboard/admin/jobs"
                    className="flex items-center gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJobs.map(job => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
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
                ))}
              </CardContent>
            </Card>

            {/* Recent Applicants */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-brand-blue" />
                    Recent Applicants
                  </CardTitle>
                  <CardDescription>
                    Latest applicants in the system
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="/dashboard/admin/applicants"
                    className="flex items-center gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplicants.map(applicant => (
                  <div
                    key={applicant.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-medium">
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
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
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
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  asChild>
                  <Link href="/dashboard/admin/jobs">
                    <Briefcase className="h-6 w-6" />
                    <span>Manage Jobs</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  asChild>
                  <Link href="/dashboard/admin/applicants">
                    <Users className="h-6 w-6" />
                    <span>View Applicants</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  asChild>
                  <Link href="/dashboard/admin/companies">
                    <Building className="h-6 w-6" />
                    <span>Manage Companies</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  asChild>
                  <Link href="/dashboard/admin/settings">
                    <Settings className="h-6 w-6" />
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
