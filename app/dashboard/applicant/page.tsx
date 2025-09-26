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
  Briefcase,
  FileUp,
  Search,
  TrendingUp,
  Calendar,
  MapPin,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Plus,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { authAPI, userAPI, applicationAPI } from '@/lib/api-service';
import { useEffect, useState } from 'react';
import { AIJobRecommendations } from '@/components/ai-job-recommendations';

export default function ApplicantDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    documents: 0,
    matches: 0,
    profileCompletion: 0
  });

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    console.log({ currentUser });
    setUser(currentUser);
    fetchDashboardData(currentUser);
  }, []);

  const fetchDashboardData = async (user: any) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Fetch user profile and applications in parallel
      const [profileData, applicationsData] = await Promise.all([
        userAPI.getUserById(user.id),
        applicationAPI.getMyApplications()
      ]);

      setProfile(profileData);
      setApplications(applicationsData.applications || []);

      // Calculate statistics
      const documents = [profileData.resumeFile, profileData.pdsFile].filter(
        Boolean
      ).length;

      const profileCompletion = calculateProfileCompletion(profileData);

      setStats({
        applications: applicationsData.applications?.length || 0,
        documents,
        matches: 0, // This would come from job matching service
        profileCompletion
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profileData: any) => {
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.phoneNumber,
      profileData.address?.street,
      profileData.gender,
      profileData.dob,
      profileData.summary,
      profileData.experience?.length > 0,
      profileData.education?.length > 0,
      profileData.certification?.length > 0,
      profileData.pdsFile,
      profileData.resumeFile
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'screening':
        return <Search className="h-4 w-4 text-yellow-600" />;
      case 'interview':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'offered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'hired':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'withdrawn':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening':
        return 'bg-yellow-100 text-yellow-700';
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'offered':
        return 'bg-green-100 text-green-700';
      case 'hired':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'screening':
        return 'Screening';
      case 'interview':
        return 'Interview';
      case 'offered':
        return 'Offered';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Rejected';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProfileSectionStatus = (section: string) => {
    if (!profile) return { completed: false, label: 'Incomplete' };

    switch (section) {
      case 'personal':
        return {
          completed: !!(
            profile.firstName &&
            profile.lastName &&
            profile.phoneNumber &&
            profile.address?.street
          ),
          label: 'Complete'
        };
      case 'education':
        return {
          completed: profile.education && profile.education.length > 0,
          label:
            profile.education && profile.education.length > 0
              ? 'Complete'
              : 'Incomplete'
        };
      case 'experience':
        return {
          completed: profile.experience && profile.experience.length > 0,
          label:
            profile.experience && profile.experience.length > 0
              ? 'Complete'
              : 'Incomplete'
        };
      case 'documents':
        return {
          completed: !!(profile.pdsFile || profile.resumeFile),
          label:
            profile.pdsFile || profile.resumeFile ? 'Complete' : 'Incomplete'
        };
      default:
        return { completed: false, label: 'Incomplete' };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const recentApplications = applications.slice(0, 3);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
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
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.firstName || 'User'}! Here's what's
                happening with your applications.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300"
              asChild>
              <Link href="/jobs" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Find Jobs
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              asChild>
              <Link
                href="/dashboard/applicant/profile"
                className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Profile
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
                  Total Applications
                </CardTitle>
                <Briefcase className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.applications}
                </div>
                <p className="text-xs text-blue-600">Active applications</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Documents
                </CardTitle>
                <FileUp className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.documents}
                </div>
                <p className="text-xs text-green-600">PDS & Resume uploaded</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Job Matches
                </CardTitle>
                <Search className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.matches}
                </div>
                <p className="text-xs text-purple-600">Based on your profile</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Profile Completion
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.profileCompletion}%
                </div>
                <p className="text-xs text-orange-600">Complete your profile</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Job Recommendations */}

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Applications */}
            <Card className="lg:col-span-2 group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Recent Applications
                    </CardTitle>
                    <CardDescription>
                      Your latest job applications and their status
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/60 backdrop-blur-sm hover:bg-white/80"
                    asChild>
                    <Link
                      href="/dashboard/applicant/applications"
                      className="flex items-center gap-2">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No applications yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="mt-2">
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                ) : (
                  recentApplications.map(app => (
                    <div
                      key={app._id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          {app.jobId?.companyId?.logo ? (
                            <img
                              src={app.jobId.companyId.logo}
                              alt={app.jobId.companyId.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {app.jobId?.title}
                          </h4>
                          <Badge
                            className={`text-xs ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {getStatusLabel(app.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {app.jobId?.companyId?.name}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Applied {formatDate(app.createdAt)}</span>
                          {app.jobId?.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {app.jobId.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/applicant/applications/${app._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Profile Completion
                </CardTitle>
                <CardDescription>
                  Complete your profile to improve job matches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {stats.profileCompletion}% Complete
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(stats.profileCompletion / 25)}/4 sections
                    </span>
                  </div>
                  <Progress value={stats.profileCompletion} className="h-2" />
                </div>

                <div className="space-y-3">
                  {(() => {
                    const personalStatus = getProfileSectionStatus('personal');
                    return (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                          personalStatus.completed
                            ? 'bg-green-50/80 border-green-200/50 hover:bg-green-50'
                            : 'bg-white/40 border-white/50 hover:bg-white/60'
                        }`}>
                        {personalStatus.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              personalStatus.completed
                                ? 'text-green-900'
                                : 'text-gray-700'
                            }`}>
                            Personal Information
                          </p>
                          <p
                            className={`text-xs ${
                              personalStatus.completed
                                ? 'text-green-700'
                                : 'text-gray-500'
                            }`}>
                            {personalStatus.label}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {(() => {
                    const educationStatus =
                      getProfileSectionStatus('education');
                    return (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                          educationStatus.completed
                            ? 'bg-green-50/80 border-green-200/50 hover:bg-green-50'
                            : 'bg-white/40 border-white/50 hover:bg-white/60'
                        }`}>
                        {educationStatus.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              educationStatus.completed
                                ? 'text-green-900'
                                : 'text-gray-700'
                            }`}>
                            Education
                          </p>
                          <p
                            className={`text-xs ${
                              educationStatus.completed
                                ? 'text-green-700'
                                : 'text-gray-500'
                            }`}>
                            {educationStatus.label}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {(() => {
                    const experienceStatus =
                      getProfileSectionStatus('experience');
                    return (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                          experienceStatus.completed
                            ? 'bg-green-50/80 border-green-200/50 hover:bg-green-50'
                            : 'bg-white/40 border-white/50 hover:bg-white/60'
                        }`}>
                        {experienceStatus.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              experienceStatus.completed
                                ? 'text-green-900'
                                : 'text-gray-700'
                            }`}>
                            Work Experience
                          </p>
                          <p
                            className={`text-xs ${
                              experienceStatus.completed
                                ? 'text-green-700'
                                : 'text-gray-500'
                            }`}>
                            {experienceStatus.label}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {(() => {
                    const documentsStatus =
                      getProfileSectionStatus('documents');
                    return (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                          documentsStatus.completed
                            ? 'bg-green-50/80 border-green-200/50 hover:bg-green-50'
                            : 'bg-white/40 border-white/50 hover:bg-white/60'
                        }`}>
                        {documentsStatus.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              documentsStatus.completed
                                ? 'text-green-900'
                                : 'text-gray-700'
                            }`}>
                            Documents
                          </p>
                          <p
                            className={`text-xs ${
                              documentsStatus.completed
                                ? 'text-green-700'
                                : 'text-gray-500'
                            }`}>
                            {documentsStatus.label}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  asChild>
                  <Link href="/dashboard/applicant/profile">
                    Complete Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with these common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                  asChild>
                  <Link href="/jobs">
                    <Search className="h-6 w-6 text-blue-600" />
                    <span>Browse Jobs</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                  asChild>
                  <Link href="/dashboard/applicant/profile">
                    <FileUp className="h-6 w-6 text-green-600" />
                    <span>Upload Documents</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                  asChild>
                  <Link href="/dashboard/applicant/profile">
                    <Eye className="h-6 w-6 text-purple-600" />
                    <span>View Profile</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                  asChild>
                  <Link href="/dashboard/applicant/applications">
                    <Briefcase className="h-6 w-6 text-orange-600" />
                    <span>My Applications</span>
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
