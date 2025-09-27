'use client';
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
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingApp, setExistingApp] = useState<any>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authAPI.isAuthenticated()) {
      router.replace(`/login?redirect=/jobs/${jobId}/apply`);
      return;
    }
    // Fetch full user profile from backend
    async function fetchUser() {
      const localUser = authAPI.getCurrentUser();

      console.log({ localUser });
      if (localUser?.id) {
        const userProfile = await userAPI.getUserById(localUser.id);
        setUser(userProfile);
      }
    }
    fetchUser();
    // Fetch job info
    async function fetchJob() {
      setLoading(true);
      if (!jobId || typeof jobId !== 'string') return;
      const res = await jobAPI.getJobById(jobId);
      setJob(res);
      setLoading(false);
    }
    fetchJob();
    async function checkExistingApplication() {
      const localUser = authAPI.getCurrentUser();
      if (localUser?.id && jobId) {
        const res = await fetch(
          `${API_URL}/applications?jobId=${jobId}&applicantId=${localUser.id}`,
          {
            headers: { Authorization: `Bearer ${authAPI.getToken()}` }
          }
        );
        const data = await res.json();
        if (data.applications && data.applications.length > 0) {
          setExistingApp(data.applications[0]);
        } else {
          setExistingApp(null);
        }
      }
    }
    checkExistingApplication();
  }, [jobId, router]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setResumeId(null); // Reset resumeId so we know to upload on submit
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // 1. Upload resume if a file is selected and not already uploaded
      let resumeDocId = resumeId;
      if (resume && !resumeId) {
        const data = await documentAPI.uploadDocument(resume, 'resume');
        resumeDocId = data._id || data.document?._id;
        setResumeId(resumeDocId);
      }
      if (!resumeDocId) {
        setError('Please upload your resume.');
        setSubmitting(false);
        return;
      }
      // 2. Submit application
      const payload: any = {
        jobId,
        resumeId: resumeDocId
      };
      if (user && user.pdsFileId) payload.pdsId = user.pdsFileId;
      if (coverLetter) payload.coverLetter = coverLetter;
      await applicationAPI.submitApplication(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error submitting application');
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
                                <DollarSign className="h-4 w-4" />₱
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
                        {/* Uploaded PDS/Resume */}
                        <div className="border-t my-4" />
                        <div className="flex items-center gap-2 mb-2">
                          <Upload className="h-4 w-4 text-blue-400" />
                          <span className="font-semibold text-blue-900">
                            Uploaded Documents
                          </span>
                        </div>
                        <div className="text-xs text-gray-700 mb-2">
                          The PDS or resume you upload will be used in your
                          application.
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          {user.pdsFile && (
                            <div>
                              <span className="font-medium">PDS:</span>{' '}
                              <a
                                href={getPdsDownloadUrl(user.pdsFile)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline">
                                View Uploaded PDS
                              </a>
                            </div>
                          )}
                          {resume && (
                            <div>
                              <span className="font-medium">Resume:</span>{' '}
                              {resume.name}
                            </div>
                          )}
                          {!user.pdsFile && !resume && (
                            <div className="text-gray-400">
                              No PDS or resume uploaded yet.
                            </div>
                          )}
                        </div>
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
                        Upload your resume and add a cover letter
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-blue-600" />
                            Resume (PDF, DOCX)
                          </Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeChange}
                              ref={fileInputRef}
                              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            {resume && (
                              <Badge className="bg-green-100 text-green-700">
                                {resume.name}
                              </Badge>
                            )}
                          </div>
                        </div>
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
    </div>
  );
}
