'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Required for static export
export async function generateStaticParams() {
  return [];
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Users,
  Eye,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { jobAPI, authAPI, applicationAPI } from '@/lib/api-service';
import { useToast } from '@/components/ui/use-toast';

interface Job {
  _id: string;
  title: string;
  companyId: {
    _id: string;
    name: string;
    logo?: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  location: string;
  employmentType: string;
  status: string;
  postedDate: string;
  expiryDate: string;
  applicationCount: number;
  viewCount: number;
  isFeatured: boolean;
  isUrgent: boolean;
  allowsRemote: boolean;
  department?: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  salaryPeriod: string;
  experienceLevel: string;
  experienceYearsMin: number;
  experienceYearsMax: number;
  educationLevel: string;
  skills: string[];
  eligibility: string[];
  positionCount: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [realApplicationCount, setRealApplicationCount] = useState<number>(0);

  const jobId = params.id as string;

  useEffect(() => {
    const checkAuth = () => {
      if (!authAPI.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const user = authAPI.getCurrentUser();
      if (user && user.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive'
        });
        router.push('/dashboard');
        return;
      }
    };

    checkAuth();
  }, [router, toast]);

  // Load real application count
  const loadApplicationCount = async () => {
    try {
      const response = await applicationAPI.getAdminApplications({ jobId });
      const applications = response.applications || [];
      setRealApplicationCount(applications.length);
    } catch (error) {
      console.error('Error loading application count:', error);
    }
  };

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const response = await jobAPI.getJobById(jobId);
        setJob(response);

        // Load real application count
        await loadApplicationCount();
      } catch (error) {
        console.error('Error loading job:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job details',
          variant: 'destructive'
        });
        router.push('/dashboard/admin/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadJob();
    }
  }, [jobId, router, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (
    min: number,
    max: number,
    currency: string,
    period: string
  ) => {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} per ${period}`;
  };

  // Handle export job applicants
  const handleExportJobApplicants = async () => {
    if (!job) return;

    try {
      const blob = await applicationAPI.exportJobApplicants(job._id, 'csv');

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `applicants-${job.title.replace(/[^a-zA-Z0-9]/g, '_')}-${
        new Date().toISOString().split('T')[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Job applicants exported successfully'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Error',
        description: 'Failed to export job applicants',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'paused':
        return 'outline';
      case 'closed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <p className="text-lg font-semibold mb-4 text-gray-900">
            Job not found
          </p>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            asChild>
            <Link href="/dashboard/admin/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/60 backdrop-blur-sm hover:bg-white/80"
              asChild>
              <Link href="/dashboard/admin/jobs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {job.title}
              </h1>
              <p className="text-sm text-gray-600">{job.companyId?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild>
              <Link href={`/dashboard/admin/jobs/${job._id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              asChild>
              <Link href={`/dashboard/admin/ranking?jobId=${job._id}`}>
                <Users className="mr-2 h-4 w-4" />
                View Applications ({realApplicationCount})
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleExportJobApplicants}
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
              <Download className="mr-2 h-4 w-4" />
              Export Applicants
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container py-8 space-y-8">
          {/* Job Overview */}
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription>
                    {job.companyId?.name} • {job.categoryId?.name}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                  {job.isFeatured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  {job.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{job.employmentType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Posted {formatDate(job.postedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{job.department || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/60 transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {realApplicationCount}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Applications
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Real-time count
                  </div>
                </div>
                <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/60 transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                    {job.viewCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Views</div>
                  <div className="text-xs text-gray-500 mt-1">Total views</div>
                </div>
                <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/60 transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                    {job.positionCount || 1}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Positions
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Available slots
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{job.benefits}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Salary Range
                      </label>
                      <p className="font-medium">
                        {formatSalary(
                          job.salaryMin,
                          job.salaryMax,
                          job.salaryCurrency,
                          job.salaryPeriod
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Experience Level
                      </label>
                      <p className="font-medium">{job.experienceLevel}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Experience Years
                      </label>
                      <p className="font-medium">
                        {job.experienceYearsMin} - {job.experienceYearsMax}{' '}
                        years
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Education Level
                      </label>
                      <p className="font-medium">{job.educationLevel}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Remote Work
                      </label>
                      <p className="font-medium">
                        {job.allowsRemote ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Expiry Date
                      </label>
                      <p className="font-medium">
                        {formatDate(job.expiryDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-white/60 backdrop-blur-sm border-white/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {job.eligibility.length > 0 && (
                <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>Eligibility Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {job.eligibility.map((requirement, index) => (
                        <li key={index} className="text-sm">
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
