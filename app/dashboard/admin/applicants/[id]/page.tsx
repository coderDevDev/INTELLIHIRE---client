'use client';

// Force dynamic rendering - skip static generation
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { userAPI, applicationAPI } from '@/lib/api-service';

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
  MessageSquare,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface Applicant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
  };
  dateOfBirth?: string;
  gender?: string;
  role: string;
  profilePicture?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    companyId: {
      _id: string;
      name: string;
    };
    location: string;
    employmentType: string;
    salaryMin: number;
    salaryMax: number;
    postedDate: string;
  };
  status: string;
  appliedAt: string;
  coverLetter?: string;
  resumeUrl?: string;
  notes?: string;
  adminNotes?: string;
  interviewDate?: string;
  interviewLocation?: string;
  interviewType?: string;
  rejectionReason?: string;
}

export default function ApplicantDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const applicantId = params.id as string;

  useEffect(() => {
    if (applicantId) {
      fetchApplicantData();
    }
  }, [applicantId]);

  const fetchApplicantData = async () => {
    try {
      setLoading(true);
      const [applicantData, applicationsData] = await Promise.all([
        userAPI.getUserById(applicantId),
        applicationAPI.getApplicationsByApplicant(applicantId, { limit: 50 })
      ]);

      setApplicant(applicantData);
      setApplications(applicationsData.applications || []);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applicant data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplicantData();
    setRefreshing(false);
    toast({
      title: 'Success',
      description: 'Data refreshed successfully'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approved':
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <Eye className="h-4 w-4" />;
      case 'interview':
        return <Calendar className="h-4 w-4" />;
      case 'approved':
      case 'hired':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Applicant Details
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Applicant Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The applicant you're looking for doesn't exist or has been
              removed.
            </p>
            <Link href="/dashboard/admin/applicants">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applicants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${applicant.firstName} ${applicant.lastName}`;
  const initials =
    `${applicant.firstName[0]}${applicant.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/admin/applicants">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Applicants
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {fullName}
                  </h1>
                  <p className="text-sm text-gray-600">Applicant Profile</p>
                </div>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm">
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={applicant.profilePicture} />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{fullName}</CardTitle>
                  <CardDescription className="text-base">
                    {applicant.email}
                  </CardDescription>
                  <div className="flex justify-center mt-3">
                    <Badge
                      variant={applicant.isActive ? 'default' : 'secondary'}
                      className={
                        applicant.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }>
                      {applicant.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {applicant.email}
                    </span>
                  </div>
                  {applicant.phoneNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {applicant.phoneNumber}
                      </span>
                    </div>
                  )}
                  {applicant.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {[
                          applicant.address.street,
                          applicant.address.city,
                          applicant.address.province,
                          applicant.address.zipCode
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Member since:</span>
                      <span className="font-medium">
                        {formatDate(applicant.createdAt)}
                      </span>
                    </div>
                    {applicant.dateOfBirth && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-medium">
                          {formatDate(applicant.dateOfBirth)}
                        </span>
                      </div>
                    )}
                    {applicant.gender && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium capitalize">
                          {applicant.gender}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Job Applications ({applications.length})
                  </CardTitle>
                  <CardDescription>
                    All job applications submitted by this applicant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Applications
                      </h3>
                      <p className="text-gray-600">
                        This applicant hasn't submitted any job applications
                        yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map(application => (
                        <div
                          key={application._id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {application.jobId.title}
                              </h4>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Building className="h-4 w-4 mr-1" />
                                {application.jobId.companyId.name}
                                <span className="mx-2">•</span>
                                <MapPin className="h-4 w-4 mr-1" />
                                {application.jobId.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                Applied on {formatDate(application.appliedAt)}
                                <span className="mx-2">•</span>
                                <Clock className="h-4 w-4 mr-1" />
                                {application.jobId.employmentType}
                              </div>
                            </div>
                            <Badge
                              className={`${getStatusColor(
                                application.status
                              )} flex items-center space-x-1`}>
                              {getStatusIcon(application.status)}
                              <span className="capitalize">
                                {application.status}
                              </span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">
                                Salary Range:
                              </span>
                              <div className="font-medium">
                                {formatCurrency(application.jobId.salaryMin)} -{' '}
                                {formatCurrency(application.jobId.salaryMax)}
                              </div>
                            </div>
                            {application.interviewDate && (
                              <div>
                                <span className="text-gray-600">
                                  Interview Date:
                                </span>
                                <div className="font-medium">
                                  {formatDate(application.interviewDate)}
                                </div>
                              </div>
                            )}
                            {application.interviewLocation && (
                              <div>
                                <span className="text-gray-600">
                                  Interview Location:
                                </span>
                                <div className="font-medium">
                                  {application.interviewLocation}
                                </div>
                              </div>
                            )}
                          </div>

                          {application.notes && (
                            <div className="mt-3">
                              <span className="text-sm text-gray-600">
                                Notes:
                              </span>
                              <p className="text-sm text-gray-800 mt-1">
                                {application.notes}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/dashboard/admin/jobs/${application.jobId._id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Job
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/admin/applications`}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Manage Application
                              </Link>
                            </Button>
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
      </div>
    </div>
  );
}
