'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobAPI, authAPI } from '@/lib/api-service';
import { MainHeader } from '@/components/main-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  Upload,
  User,
  Mail,
  CheckCircle
} from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authAPI.isAuthenticated()) {
      router.replace(`/login?redirect=/jobs/${jobId}/apply`);
      return;
    }
    // Get user info
    setUser(authAPI.getCurrentUser());
    // Fetch job info
    async function fetchJob() {
      setLoading(true);
      if (!jobId || typeof jobId !== 'string') return;
      const res = await jobAPI.getJobById(jobId);
      setJob(res);
      setLoading(false);
    }
    fetchJob();
  }, [jobId, router]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      alert('Please upload your resume.');
      return;
    }
    setSubmitting(true);
    // Simulate API call (replace with real API call to submit application)
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1500);
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
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col items-center">
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
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 mb-8">
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
            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <User className="h-4 w-4" /> Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full rounded-md border border-input bg-gray-100 px-4 py-2 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-md border border-input bg-gray-100 px-4 py-2 text-sm shadow-sm"
                />
              </div>
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
              <Button
                type="submit"
                className="w-full text-lg py-3"
                size="lg"
                disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </div>
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
