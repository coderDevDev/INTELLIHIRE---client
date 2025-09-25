import { MainHeader } from '@/components/main-header';
import { ModernFooter } from '@/components/modern-footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Users,
  FileText,
  Plus,
  TrendingUp,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
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

        <div className="container relative mx-auto px-4 py-16 md:py-24 z-10">
          <div className="max-w-7xl mx-auto relative z-20">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-blue-200 mb-6">
                <Building2 className="h-4 w-4 text-blue-600" />
                Employer Dashboard
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome Back,
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Employer
                </span>
              </h1>

              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Manage your job postings, review applications, and find the
                perfect candidates for your team.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Jobs
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Applications
                  </CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">247</div>
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +15 this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Interviews Scheduled
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <p className="text-xs text-gray-500">This week</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Hired This Month
                  </CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +1 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Manage your job postings and applications efficiently
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/dashboard/employer/jobs/create">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  </Link>
                  <Link href="/dashboard/employer/applications">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Review Applications
                    </Button>
                  </Link>
                  <Link href="/dashboard/employer/jobs">
                    <Button className="w-full justify-start" variant="outline">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Manage Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest job posting and application updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        Senior Developer Position
                      </p>
                      <p className="text-xs text-gray-500">
                        5 new applications
                      </p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Marketing Manager</p>
                      <p className="text-xs text-gray-500">
                        Interview scheduled
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      Interview
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Data Analyst</p>
                      <p className="text-xs text-gray-500">Position filled</p>
                    </div>
                    <Badge variant="default" className="bg-purple-600">
                      Hired
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs */}
            <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Recent Job Postings
                </CardTitle>
                <CardDescription>
                  Your latest job postings and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Senior Frontend Developer
                      </h3>
                      <p className="text-sm text-gray-600">
                        Remote • Full-time • $80,000 - $120,000
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted 2 days ago
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">23</p>
                        <p className="text-xs text-gray-500">Applications</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        UX Designer
                      </h3>
                      <p className="text-sm text-gray-600">
                        San Francisco, CA • Full-time • $70,000 - $90,000
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted 1 week ago
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">45</p>
                        <p className="text-xs text-gray-500">Applications</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Backend Engineer
                      </h3>
                      <p className="text-sm text-gray-600">
                        New York, NY • Full-time • $90,000 - $130,000
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted 2 weeks ago
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">67</p>
                        <p className="text-xs text-gray-500">Applications</p>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        Hiring
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ModernFooter />
    </div>
  );
}
