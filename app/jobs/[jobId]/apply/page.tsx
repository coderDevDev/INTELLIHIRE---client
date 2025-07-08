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
  Building
} from 'lucide-react';
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
    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-200 shadow-lg mb-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="h-7 w-7 text-green-600" />
        <div>
          <h3 className="font-bold text-xl text-green-800">
            Application Status
          </h3>
          <div className="text-xs text-gray-500">
            Track your application progress below
          </div>
        </div>
      </div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-8">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <StatusBadge status={application.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>
            Submitted: {new Date(application.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
          <FileText className="h-4 w-4 text-blue-400" />
          <span className="font-semibold">Resume:</span>
          {application.resumeId?.fileUrl && (
            <a
              href={`/${application.resumeId.fileUrl.replace(/\\/g, '/')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline ml-1">
              View
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
          <File className="h-4 w-4 text-blue-400" />
          <span className="font-semibold">PDS:</span>
          {application.pdsId?.fileUrl ? (
            <a
              href={getPdsDownloadUrl(application.pdsId.fileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline ml-1">
              View
            </a>
          ) : user?.pdsFile ? (
            <a
              href={getPdsDownloadUrl(user.pdsFile)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline ml-1">
              View
            </a>
          ) : (
            <span className="text-gray-400 ml-1">No PDS uploaded</span>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-semibold">Job:</span>
          <span className="ml-1">{application.jobId?.title}</span>
        </div>
        {application.jobId?.companyId && (
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">Company:</span>
            <span className="ml-1">{application.jobId.companyId.name}</span>
          </div>
        )}
      </div>
      <Stepper status={application.status} />
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
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-center">
              Application Submitted!
            </h2>
            <p className="text-center mb-6">
              Thank you for applying for{' '}
              <span className="font-semibold">{job.title}</span> at{' '}
              <span className="font-semibold">{job.companyId?.name}</span>.
              <br />
              We will review your application and contact you soon.
            </p>
            <Button asChild className="w-full mb-2">
              <Link href="/jobs">Back to Jobs</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/applicant">Go to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 bg-gray-50 py-8 md:py-12">
        <div className="container max-w-xl mx-auto px-4 md:px-6">
          {existingApp ? (
            <ApplicationStatusCard application={existingApp} user={user} />
          ) : (
            <>
              {/* Job Info */}
              <div className="mb-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-brand-blue mb-1">
                  <Briefcase className="h-5 w-5" />
                  <span className="font-semibold">{job.title}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {job.companyId?.name}
                </div>
              </div>
              {/* Applicant Info Review */}
              {user && (
                <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    {user.profilePicture && (
                      <img
                        src={`/${user.profilePicture.replace(/\\/g, '/')}`}
                        alt="Profile"
                        className="h-12 w-12 rounded-full border object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-brand-blue">
                        Applicant Information
                      </h3>
                      <div className="text-xs text-gray-500">
                        Review your details before submitting your application.
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>{' '}
                      {user.firstName} {user.lastName}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>{' '}
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
                        {user.address.street || ''} {user.address.city || ''}{' '}
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
                            {exp.location && <span>, {exp.location}</span>}{' '}
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
                            {e.yearGraduated ? `(${e.yearGraduated})` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Certifications */}
                  {user.certification && user.certification.length > 0 && (
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
                            {c.name || ''} {c.issuer ? `- ${c.issuer}` : ''}{' '}
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
                    <Link href="/dashboard/applicant/profile">
                      <Button
                        variant="outline"
                        className="text-brand-blue border-brand-blue hover:bg-brand-blue/10">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              {/* Application Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <Upload className="h-4 w-4" /> Resume (PDF, DOCX)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      ref={fileInputRef}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-blue-700"
                    />
                    {resume && (
                      <span className="text-xs text-green-700">
                        {resume.name}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Cover Letter (optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    rows={5}
                    placeholder="Write a brief cover letter..."
                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm"
                  />
                </div>
                {error && (
                  <div className="text-red-600 text-sm mb-2">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full text-lg py-3"
                  size="lg"
                  disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </>
          )}
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link
                href={`/jobs/${job._id}`}
                className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Back to Job Details
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
