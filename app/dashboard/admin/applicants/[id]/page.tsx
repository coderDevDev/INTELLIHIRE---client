'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { userAPI, applicationAPI } from '@/lib/api-service';

// Required for static export
export async function generateStaticParams() {
  // Return empty array for static export - pages will be generated on demand
  return [];
}
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Briefcase,
  Building,
  Clock,
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  GraduationCap,
  Shield,
  ArrowLeft,
  Star,
  Globe,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

const DEFAULT_AVATAR = '/avatar-placeholder.png';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'hired':
      return 'bg-green-100 text-green-700';
    case 'offered':
      return 'bg-blue-100 text-blue-700';
    case 'interview':
      return 'bg-purple-100 text-purple-700';
    case 'screening':
      return 'bg-yellow-100 text-yellow-700';
    case 'applied':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'hired':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'offered':
      return <Star className="h-4 w-4 text-blue-600" />;
    case 'interview':
      return <Calendar className="h-4 w-4 text-purple-600" />;
    case 'screening':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

export default function AdminApplicantDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicant, setApplicant] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [userRes, appsRes] = await Promise.all([
          userAPI.getUserById(id as string),
          applicationAPI.getApplicationsByApplicant(id as string, {
            limit: 100
          })
        ]);
        setApplicant(userRes);
        setApplications(appsRes.applications || appsRes || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load applicant data.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="text-gray-600">Loading applicant details...</p>
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  if (!applicant)
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Applicant not found.</p>
          </div>
        </div>
      </div>
    );

  const age = applicant.dob
    ? Math.max(
        0,
        new Date().getFullYear() - new Date(applicant.dob).getFullYear()
      )
    : '-';

  // Calculate application statistics
  const totalApplications = applications.length;
  const hiredCount = applications.filter(app => app.status === 'hired').length;
  const offeredCount = applications.filter(
    app => app.status === 'offered'
  ).length;
  const interviewCount = applications.filter(
    app => app.status === 'interview'
  ).length;
  const successRate =
    totalApplications > 0
      ? Math.round(((hiredCount + offeredCount) / totalApplications) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/applicants">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applicants
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Applicant Profile
              </h1>
              <p className="text-sm text-gray-600">
                Viewing details for {applicant.firstName} {applicant.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <PhoneCall className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container px-6 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Sidebar - Applicant Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                        <img
                          src={applicant.profilePicture || DEFAULT_AVATAR}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {applicant.firstName} {applicant.lastName}
                    </h2>

                    {/* Role */}
                    <Badge variant="secondary" className="mb-4">
                      {applicant.role || 'Applicant'}
                    </Badge>

                    {/* Application Stats */}
                    <div className="w-full mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Success Rate
                        </span>
                        <span className="text-sm text-gray-500">
                          {successRate}%
                        </span>
                      </div>
                      <Progress value={successRate} className="h-2" />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {applicant.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {applicant.phoneNumber || (
                          <span className="text-gray-400">—</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {applicant.address?.street || (
                          <span className="text-gray-400">—</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Gender:{' '}
                        <span className="ml-2">
                          {applicant.gender || (
                            <span className="text-gray-400">—</span>
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        DOB:{' '}
                        <span className="ml-2">
                          {applicant.dob ? (
                            new Date(applicant.dob).toLocaleDateString()
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                          {applicant.dob && (
                            <span className="ml-2 text-xs text-gray-400">
                              ({age} years old)
                            </span>
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Joined:{' '}
                        <span className="ml-2">
                          {applicant.createdAt
                            ? new Date(applicant.createdAt).toLocaleDateString()
                            : '—'}
                        </span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Statistics */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Application Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {totalApplications}
                      </div>
                      <div className="text-xs text-blue-600">Total Applied</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {hiredCount}
                      </div>
                      <div className="text-xs text-green-600">Hired</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {offeredCount}
                      </div>
                      <div className="text-xs text-purple-600">Offered</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {interviewCount}
                      </div>
                      <div className="text-xs text-yellow-600">Interviews</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Card */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Resume */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-brand-blue" />
                      <div>
                        <p className="font-medium text-sm">Resume</p>
                        <p className="text-xs text-gray-500">
                          {applicant.resume ? 'Available' : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    {applicant.resume && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={applicant.resume} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* PDS */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">PDS</p>
                        <p className="text-xs text-gray-500">
                          {applicant.pdsFile ? 'Uploaded' : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    {applicant.pdsFile && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={applicant.pdsFile} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Summary */}
              {applicant.summary && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="h-5 w-5 text-brand-blue" />
                      Professional Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {applicant.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              {applicant.experience && applicant.experience.length > 0 && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-brand-blue" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applicant.experience.map((exp: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 border border-gray-200 rounded-lg">
                          <h3 className="font-semibold text-gray-900">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{exp.company}</span>
                            <span>•</span>
                            <MapPin className="h-4 w-4" />
                            <span>{exp.location}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {exp.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {exp.start} - {exp.end}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {applicant.education && applicant.education.length > 0 && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-brand-blue" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applicant.education.map((edu: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 border border-gray-200 rounded-lg">
                          <h3 className="font-semibold text-gray-900">
                            {edu.degree}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{edu.school}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {edu.start} - {edu.end}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Applications List */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-brand-blue" />
                    Applications ({applications.length})
                  </CardTitle>
                  <CardDescription>
                    All jobs applied to by this applicant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No applications found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app: any) => (
                        <div
                          key={app._id}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {app.jobId?.title || 'Unknown Job'}
                                </h3>
                                <Badge
                                  className={`text-xs ${getStatusColor(
                                    app.status
                                  )}`}>
                                  {getStatusIcon(app.status)}
                                  {app.status.charAt(0).toUpperCase() +
                                    app.status.slice(1)}
                                </Badge>
                              </div>

                              {/* Company Info */}
                              <div className="flex items-center gap-3 mb-2">
                                {app.jobId?.companyId?.logo && (
                                  <img
                                    src={app.jobId.companyId.logo}
                                    alt={app.jobId.companyId.name}
                                    className="w-6 h-6 rounded object-contain"
                                  />
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Building className="h-4 w-4" />
                                  <span className="font-medium">
                                    {app.jobId?.companyId?.name ||
                                      'Unknown Company'}
                                  </span>
                                  {app.jobId?.companyId?.industry && (
                                    <>
                                      <span>•</span>
                                      <span className="text-xs text-gray-500">
                                        {app.jobId.companyId.industry}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Job Details */}
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{app.jobId?.location || '—'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  <span>
                                    {app.jobId?.employmentType || '—'}
                                  </span>
                                </div>
                                {app.jobId?.salaryMin && (
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>
                                      ₱{app.jobId.salaryMin?.toLocaleString()}
                                      {app.jobId.salaryMax &&
                                        ` - ₱${app.jobId.salaryMax.toLocaleString()}`}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Application Date */}
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Applied:{' '}
                                  {app.createdAt
                                    ? new Date(
                                        app.createdAt
                                      ).toLocaleDateString()
                                    : '—'}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
