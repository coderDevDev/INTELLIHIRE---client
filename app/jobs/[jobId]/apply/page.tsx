'use client';

// Force dynamic rendering - skip static generation
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  jobAPI,
  authAPI,
  userAPI,
  documentAPI,
  applicationAPI
} from '@/lib/api-service';
import { MainHeader } from '@/components/main-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  Upload,
  User,
  Mail,
  CheckCircle,
  GraduationCap,
  Calendar,
  Clock,
  BadgeCheck,
  XCircle,
  ArrowRight,
  File,
  Search,
  Building,
  MapPin,
  DollarSign,
  Star,
  ArrowLeft,
  Loader2,
  Eye,
  Download,
  AlertCircle,
  Info,
  FileSpreadsheet,
  PhilippinePeso
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ResumeModal } from '@/components/resume-modal';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// A. The application's pdsId (linked Document, preferred if present)
// B. The user's profile pdsFile (raw file path, fallback if no pdsId)
const getPdsDownloadUrl = (pdsFile: string) => {
  if (!pdsFile) return '#';
  // Remove any leading slashes
  const filePath = pdsFile.replace(/^\/+/, '');
  // Remove 'api' from API_URL if present, to get the base URL
  const baseUrl = API_URL.replace(/\/api$/, '');
  return `${baseUrl}/${filePath.replace(/\\/g, '/')}`;
};

const getFileDownloadUrl = (filePath: string) => {
  if (!filePath) return '#';
  const cleanPath = filePath.replace(/^\/+/, '');
  const baseUrl = API_URL.replace(/\/api$/, '');
  return `${baseUrl}/${cleanPath.replace(/\\/g, '/')}`;
};

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; color: string; icon: any }> =
    {
      applied: {
        label: 'Applied',
        color: 'bg-blue-100 text-blue-700',
        icon: <FileText className="h-4 w-4" />
      },
      screening: {
        label: 'Screening',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Search className="h-4 w-4" />
      },
      interview: {
        label: 'Interview',
        color: 'bg-purple-100 text-purple-700',
        icon: <Calendar className="h-4 w-4" />
      },
      offered: {
        label: 'Offered',
        color: 'bg-green-100 text-green-700',
        icon: <BadgeCheck className="h-4 w-4" />
      },
      hired: {
        label: 'Hired',
        color: 'bg-green-200 text-green-800',
        icon: <CheckCircle className="h-4 w-4" />
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle className="h-4 w-4" />
      },
      withdrawn: {
        label: 'Withdrawn',
        color: 'bg-gray-100 text-gray-500',
        icon: <ArrowRight className="h-4 w-4" />
      }
    };
  const s = statusMap[status] || statusMap['applied'];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${s.color}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

function Stepper({ status }: { status: string }) {
  const steps = [
    {
      key: 'applied',
      label: 'Applied',
      icon: <FileText className="h-4 w-4" />
    },
    {
      key: 'screening',
      label: 'Screening',
      icon: <Search className="h-4 w-4" />
    },
    {
      key: 'interview',
      label: 'Interview',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      key: 'offered',
      label: 'Offered',
      icon: <BadgeCheck className="h-4 w-4" />
    },
    { key: 'hired', label: 'Hired', icon: <CheckCircle className="h-4 w-4" /> },
    {
      key: 'rejected',
      label: 'Rejected',
      icon: <XCircle className="h-4 w-4" />
    },
    {
      key: 'withdrawn',
      label: 'Withdrawn',
      icon: <ArrowRight className="h-4 w-4" />
    }
  ];
  const currentStep = steps.findIndex(s => s.key === status);
  return (
    <div className="flex flex-col gap-2 mt-4">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={`rounded-full p-1 ${
              i <= currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
            {step.icon}
          </div>
          <span
            className={`text-sm font-medium ${
              i <= currentStep ? 'text-green-700' : 'text-gray-400'
            }`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px bg-gray-200 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}

function ApplicationStatusCard({
  application,
  user
}: {
  application: any;
  user: any;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container relative z-10 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Application Submitted
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Your application has been successfully submitted and is being
              reviewed.
            </p>
          </div>

          {/* Status Card */}
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6" />
                <div>
                  <CardTitle className="text-xl">Application Status</CardTitle>
                  <p className="text-blue-100 text-sm">
                    Track your application progress below
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Status Badge and Date */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <StatusBadge status={application.status} />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Submitted:{' '}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Job Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Job Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Position:</span>
                    <span>{application.jobId?.title}</span>
                  </div>
                  {application.jobId?.companyId && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Company:</span>
                      <span>{application.jobId.companyId.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Submitted Documents
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Resume</span>
                    </div>
                    {application.resumeId?.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-white/60 backdrop-blur-sm border-white/50">
                        <a
                          href={`/${application.resumeId.fileUrl.replace(
                            /\\/g,
                            '/'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">PDS</span>
                    </div>
                    {application.pdsId?.fileUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-white/60 backdrop-blur-sm border-white/50">
                        <a
                          href={getPdsDownloadUrl(application.pdsId.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </a>
                      </Button>
                    ) : user?.pdsFile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-white/60 backdrop-blur-sm border-white/50">
                        <a
                          href={getPdsDownloadUrl(user.pdsFile)}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </a>
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No PDS uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Application Progress
                </h3>
                <Stepper status={application.status} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Link href="/jobs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Jobs
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 bg-white/60 backdrop-blur-sm border-white/50">
                  <Link href="/dashboard/applicant">
                    <User className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function JobApplyPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingApp, setExistingApp] = useState<any>(null);
  const [resumeModal, setResumeModal] = useState<{
    open: boolean;
    data: any | null;
    metadata: any | null;
  }>({
    open: false,
    data: null,
    metadata: null
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!authAPI.isAuthenticated()) {
      router.replace(`/login?redirect=/jobs/${jobId}/apply`);
      return;
    }

    async function loadData() {
      const localUser = authAPI.getCurrentUser();

      if (!localUser?.id || !jobId || typeof jobId !== 'string') return;

      setLoading(true);

      try {
        // Fetch user, job, documents, and check existing application in parallel
        const [userProfile, jobData, documentsData, applicationsRes] =
          await Promise.all([
            userAPI.getUserById(localUser.id),
            jobAPI.getJobById(jobId),
            documentAPI.getMyDocuments(),
            fetch(
              `${API_URL}/applications?jobId=${jobId}&applicantId=${localUser.id}`,
              {
                headers: { Authorization: `Bearer ${authAPI.getToken()}` }
              }
            ).then(res => res.json())
          ]);

        setUser(userProfile);
        setJob(jobData);
        setDocuments(documentsData || []);

        if (
          applicationsRes.applications &&
          applicationsRes.applications.length > 0
        ) {
          setExistingApp(applicationsRes.applications[0]);
        } else {
          setExistingApp(null);
        }
      } catch (error) {
        console.error('Error loading application data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [jobId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const isGovernmentJob = job.companyId?.isGovernment || false;

      // Find uploaded documents
      const pdsDoc = documents.find(doc => doc.type === 'pds');
      const resumeDoc = documents.find(doc => doc.type === 'resume');

      // Validate required documents based on job type
      if (isGovernmentJob && !pdsDoc) {
        toast.error(
          'Government jobs require a PDS. Please upload your PDS first.'
        );
        setError('Government jobs require a PDS (Personal Data Sheet).');
        setSubmitting(false);
        return;
      }

      if (!isGovernmentJob && !resumeDoc) {
        toast.error(
          'This job requires a Resume/CV. Please upload your resume first.',
          {
            action: {
              label: 'Upload Resume',
              onClick: () => router.push('/dashboard/applicant/documents')
            },
            duration: 6000
          }
        );
        setError('Please upload your Resume/CV in the Documents page.');
        setSubmitting(false);
        return;
      }

      // Submit application with appropriate document
      const payload: any = {
        jobId
      };

      if (isGovernmentJob) {
        // For government jobs, use PDS (required) and resume if available
        payload.pdsId = pdsDoc._id;

        // Include resume if available, but it's not required for government jobs
        if (resumeDoc) {
          payload.resumeId = resumeDoc._id;
        }
      } else {
        // For non-government jobs, use resume (required) and PDS if available
        payload.resumeId = resumeDoc._id;

        // Include PDS if available, but it's not required for non-government jobs
        if (pdsDoc) {
          payload.pdsId = pdsDoc._id;
        }
      }

      if (coverLetter) payload.coverLetter = coverLetter;

      await applicationAPI.submitApplication(payload);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error submitting application';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading application form...</p>
          </div>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 max-w-lg w-full flex flex-col items-center">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Application Submitted!
            </h2>
            <p className="text-center mb-8 text-gray-600 leading-relaxed">
              Thank you for applying for{' '}
              <span className="font-semibold text-gray-900">{job.title}</span>{' '}
              at{' '}
              <span className="font-semibold text-gray-900">
                {job.companyId?.name}
              </span>
              .
              <br />
              We will review your application and contact you soon.
            </p>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Link href="/jobs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full bg-white/60 backdrop-blur-sm border-white/50">
                <Link href="/dashboard/applicant">
                  <User className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Check if user has required documents
  const isGovernmentJob = job?.companyId?.isGovernment || false;
  const hasPDS = documents.some(doc => doc.type === 'pds');
  const hasResume = documents.some(doc => doc.type === 'resume');
  const hasRequiredDocument = isGovernmentJob ? hasPDS : hasResume;
  const missingDocument = isGovernmentJob
    ? 'PDS (Personal Data Sheet)'
    : 'Resume/CV';

  // If missing required documents, show document required screen
  if (!hasRequiredDocument && !loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex-1 relative bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-float"></div>
            <div
              className="absolute top-40 right-20 w-72 h-72 bg-red-300/15 rounded-full blur-3xl animate-float"
              style={{ animationDelay: '2s' }}></div>
            <div
              className="absolute bottom-20 left-1/4 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-float"
              style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="container relative z-10 py-8 md:py-12">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                {/* Alert Card */}
                <Card className="bg-white/80 backdrop-blur-xl border border-orange-200 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          Document Required
                        </CardTitle>
                        <p className="text-orange-100">
                          Please upload required documents to apply for this
                          position
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {/* Job Info */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Job Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Position</p>
                            <p className="font-semibold text-gray-900">
                              {job?.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Company</p>
                            <p className="font-semibold text-gray-900">
                              {job?.companyId?.name}
                            </p>
                          </div>
                        </div>
                        {isGovernmentJob && (
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="bg-blue-100 text-blue-700 border-0">
                              <Building className="h-3 w-3 mr-1" />
                              Government Position
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Required Document Info */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Info className="h-6 w-6 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-orange-900 mb-2">
                            Missing Required Document
                          </h3>
                          <p className="text-sm text-orange-800 mb-4">
                            {isGovernmentJob ? (
                              <>
                                This is a{' '}
                                <strong>government job position</strong> and
                                requires a{' '}
                                <strong>PDS (Personal Data Sheet)</strong> to
                                apply. The PDS is an official Civil Service
                                Commission form that contains your complete
                                personal, educational, and professional
                                information.
                              </>
                            ) : (
                              <>
                                This position requires a{' '}
                                <strong>Resume/CV</strong> to apply. Please
                                upload your professional resume to proceed with
                                your application.
                              </>
                            )}
                          </p>

                          {/* What you need */}
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <p className="text-sm font-semibold text-gray-900 mb-3">
                              What you need to do:
                            </p>
                            <div className="space-y-2">
                              {isGovernmentJob ? (
                                <>
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                                      1
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      Download the PDS template (PDF or Excel
                                      format)
                                    </p>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                                      2
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      Complete all sections of the PDS form
                                    </p>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                                      3
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      Save/export as PDF and upload to
                                      InteliHire
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                                      1
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      Prepare your Resume/CV (PDF, DOC, or DOCX
                                      format)
                                    </p>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                                      2
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      Upload your resume to the Documents page
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              asChild
                              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg">
                              <Link href="/dashboard/applicant/documents">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload {missingDocument}
                              </Link>
                            </Button>
                            {isGovernmentJob && (
                              <Button
                                asChild
                                variant="outline"
                                className="flex-1 bg-white/60 backdrop-blur-sm border-orange-300">
                                <Link href="/dashboard/applicant/pds-template">
                                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                                  Get PDS Template
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Your Documents
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText
                              className={`h-5 w-5 ${
                                hasPDS ? 'text-green-600' : 'text-gray-400'
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                PDS
                              </p>
                              <p
                                className={`text-xs ${
                                  hasPDS ? 'text-green-700' : 'text-gray-500'
                                }`}>
                                {hasPDS ? 'Uploaded' : 'Not uploaded'}
                              </p>
                            </div>
                          </div>
                          {hasPDS ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText
                              className={`h-5 w-5 ${
                                hasResume ? 'text-green-600' : 'text-gray-400'
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Resume/CV
                              </p>
                              <p
                                className={`text-xs ${
                                  hasResume ? 'text-green-700' : 'text-gray-500'
                                }`}>
                                {hasResume ? 'Uploaded' : 'Not uploaded'}
                              </p>
                            </div>
                          </div>
                          {hasResume ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Back Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="outline"
                        asChild
                        className="bg-white/60 backdrop-blur-sm border-white/50">
                        <Link href={`/jobs/${job._id}`}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Job Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 relative bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container relative z-10 py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            {existingApp ? (
              <ApplicationStatusCard application={existingApp} user={user} />
            ) : (
              <>
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Apply for Position
                    </h1>
                  </div>
                  <p className="text-gray-600 text-lg">
                    Complete your application for this exciting opportunity
                  </p>
                </motion.div>

                {/* Job Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-8">
                  <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                          {job.companyId?.logo ? (
                            <img
                              src={job.companyId.logo}
                              alt={job.companyId.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {job.title}
                          </CardTitle>
                          <p className="text-blue-100 text-lg mb-3">
                            {job.companyId?.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.employmentType}
                            </div>
                            {job.salaryMin && job.salaryMax && (
                              <div className="flex items-center gap-1">
                                <PhilippinePeso className="h-4 w-4" />₱
                                {job.salaryMin.toLocaleString()} - ₱
                                {job.salaryMax.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
                {/* Applicant Info Review */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8">
                    <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                        <div className="flex items-center gap-3">
                          {user.profilePicture && (
                            <img
                              src={`/${user.profilePicture.replace(
                                /\\/g,
                                '/'
                              )}`}
                              alt="Profile"
                              className="h-12 w-12 rounded-full border object-cover"
                            />
                          )}
                          <div>
                            <CardTitle className="text-lg text-gray-900">
                              Applicant Information
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                              Review your details before submitting your
                              application
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
                          <div>
                            <span className="font-medium text-gray-700">
                              Name:
                            </span>{' '}
                            {user.firstName} {user.lastName}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Email:
                            </span>{' '}
                            {user.email}
                          </div>
                          {user.phoneNumber && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Phone:
                              </span>{' '}
                              {user.phoneNumber}
                            </div>
                          )}
                          {user.gender && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Gender:
                              </span>{' '}
                              {user.gender}
                            </div>
                          )}
                          {user.dob && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Date of Birth:
                              </span>{' '}
                              {new Date(user.dob).toLocaleDateString()}
                            </div>
                          )}
                          {user.address && (
                            <div className="col-span-1 md:col-span-2">
                              <span className="font-medium text-gray-700">
                                Address:
                              </span>{' '}
                              {user.address.street || ''}{' '}
                              {user.address.city || ''}{' '}
                              {user.address.province || ''}
                            </div>
                          )}
                        </div>
                        <div className="border-t my-4" />
                        {/* Experience */}
                        {user.experience && user.experience.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Briefcase className="h-4 w-4 text-blue-400" />
                              <span className="font-semibold text-blue-900">
                                Experience
                              </span>
                            </div>
                            <ul className="pl-2 list-disc text-xs text-gray-700">
                              {user.experience.map((exp: any, i: number) => (
                                <li key={exp._id || i} className="mb-1">
                                  <span className="font-medium">
                                    {exp.title || exp.position || ''}
                                  </span>{' '}
                                  at <span>{exp.company || ''}</span>
                                  {exp.location && (
                                    <span>, {exp.location}</span>
                                  )}{' '}
                                  {exp.type && <span>({exp.type})</span>}{' '}
                                  {exp.start && <span>— {exp.start}</span>}
                                  {exp.end && <span> to {exp.end}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Education */}
                        {user.education && user.education.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <GraduationCap className="h-4 w-4 text-blue-400" />
                              <span className="font-semibold text-blue-900">
                                Education
                              </span>
                            </div>
                            <ul className="pl-2 list-disc text-xs text-gray-700">
                              {user.education.map((e: any, i: number) => (
                                <li key={e._id || i} className="mb-1">
                                  {e.degree || e.course || e.field || ''} at{' '}
                                  {e.school || e.institution || ''}{' '}
                                  {e.yearGraduated
                                    ? `(${e.yearGraduated})`
                                    : ''}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Certifications */}
                        {user.certification &&
                          user.certification.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-4 w-4 text-blue-400" />
                                <span className="font-semibold text-blue-900">
                                  Certifications
                                </span>
                              </div>
                              <ul className="pl-2 list-disc text-xs text-gray-700">
                                {user.certification.map((c: any, i: number) => (
                                  <li key={c._id || i} className="mb-1">
                                    {c.name || ''}{' '}
                                    {c.issuer ? `- ${c.issuer}` : ''}{' '}
                                    {c.year ? `(${c.year})` : ''}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {/* Document Being Used */}
                        <div className="border-t my-4" />
                        <div className="flex items-center gap-2 mb-3">
                          <Upload className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">
                            Document for Application
                          </span>
                        </div>

                        {(() => {
                          const isGovernmentJob =
                            job?.companyId?.isGovernment || false;
                          const pdsDoc = documents.find(
                            doc => doc.type === 'pds'
                          );
                          const resumeDoc = documents.find(
                            doc => doc.type === 'resume'
                          );
                          const docToUse = isGovernmentJob ? pdsDoc : resumeDoc;
                          const docType = isGovernmentJob ? 'PDS' : 'Resume/CV';

                          if (!docToUse) {
                            return (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                                  <div className="text-xs">
                                    <p className="font-semibold text-orange-900 mb-1">
                                      {docType} Required
                                    </p>
                                    <p className="text-orange-700">
                                      This {isGovernmentJob ? 'government' : ''}{' '}
                                      position requires a {docType}.{' '}
                                      <Link
                                        href="/dashboard/applicant/documents"
                                        className="text-orange-900 underline font-medium">
                                        Upload your {docType} →
                                      </Link>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-3">
                              {/* Info Banner */}
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                                  <div className="text-xs">
                                    <p className="font-semibold text-blue-900 mb-1">
                                      {isGovernmentJob
                                        ? '🏛️ Government Position'
                                        : '💼 Private Sector Position'}
                                    </p>
                                    <p className="text-blue-700">
                                      Your <strong>{docType}</strong> will be
                                      submitted with this application.
                                      {isGovernmentJob
                                        ? ' Government jobs require PDS (Personal Data Sheet).'
                                        : ' You can also upload your PDS as optional supporting document.'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Document Card */}
                              <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        isGovernmentJob
                                          ? 'bg-blue-100'
                                          : 'bg-green-100'
                                      }`}>
                                      {isGovernmentJob ? (
                                        <FileText className="h-5 w-5 text-blue-600" />
                                      ) : (
                                        <Briefcase className="h-5 w-5 text-green-600" />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900">
                                        {docType}
                                      </h4>
                                      <p className="text-xs text-gray-500">
                                        {docToUse.title ||
                                          `${docType} Document`}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    className={`${
                                      isGovernmentJob
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-green-100 text-green-700 border-green-200'
                                    }`}>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Will be used
                                  </Badge>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                      window.open(
                                        getFileDownloadUrl(docToUse.fileUrl),
                                        '_blank'
                                      );
                                    }}>
                                    <Download className="h-3 w-3 mr-1" />
                                    Download Raw
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                      window.open(
                                        getFileDownloadUrl(docToUse.fileUrl),
                                        '_blank'
                                      );
                                    }}>
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Raw PDF
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    onClick={async () => {
                                      try {
                                        toast.info(
                                          'Loading ATS-compliant resume...'
                                        );
                                        const savedResume =
                                          await documentAPI.getSavedResume(
                                            docToUse._id
                                          );
                                        setResumeModal({
                                          open: true,
                                          data: savedResume.resume,
                                          metadata: savedResume.metadata
                                        });
                                        toast.success(
                                          'Resume loaded successfully!'
                                        );
                                      } catch (error: any) {
                                        if (error.response?.status === 404) {
                                          toast.info(
                                            'Resume is still being processed by AI. Please wait a moment and try again.',
                                            { duration: 5000 }
                                          );
                                        } else {
                                          toast.error(
                                            `Failed to load ATS-compliant resume: ${
                                              error.response?.data?.message ||
                                              error.message
                                            }`
                                          );
                                        }
                                      }
                                    }}>
                                    <Star className="h-3 w-3 mr-1" />
                                    View ATS Resume
                                  </Button>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500">
                                    <strong>Uploaded:</strong>{' '}
                                    {new Date(
                                      docToUse.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {/* Optional: Show other document if available */}
                              {!isGovernmentJob && pdsDoc && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                    <div className="text-xs text-gray-600">
                                      <p className="font-medium">
                                        Optional: PDS Available
                                      </p>
                                      <p className="mt-1">
                                        You also have a PDS on file which can be
                                        included as supporting documentation.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {isGovernmentJob && resumeDoc && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                    <div className="text-xs text-gray-600">
                                      <p className="font-medium">
                                        Optional: Resume/CV Available
                                      </p>
                                      <p className="mt-1">
                                        You also have a Resume/CV on file which
                                        can be included as supporting
                                        documentation.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        <div className="mt-6 flex justify-end">
                          <Button
                            variant="outline"
                            asChild
                            className="bg-white/60 backdrop-blur-sm border-white/50">
                            <Link href="/dashboard/applicant/profile">
                              Edit Profile
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                {/* Application Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}>
                  <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                      <CardTitle className="text-lg text-gray-900">
                        Application Form
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Add a cover letter to strengthen your application
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            Cover Letter (optional)
                          </Label>
                          <Textarea
                            value={coverLetter}
                            onChange={e => setCoverLetter(e.target.value)}
                            rows={5}
                            placeholder="Write a brief cover letter explaining why you're interested in this position..."
                            className="w-full rounded-lg border border-gray-200 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        {error && (
                          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                          </div>
                        )}
                        <Button
                          type="submit"
                          className="w-full text-lg py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                          size="lg"
                          disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center mt-8">
              <Button
                variant="outline"
                asChild
                className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                <Link
                  href={`/jobs/${job._id}`}
                  className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Job Details
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeModal.open}
        onClose={() =>
          setResumeModal({ open: false, data: null, metadata: null })
        }
        resumeData={resumeModal.data}
        metadata={resumeModal.metadata}
      />
    </div>
  );
}
