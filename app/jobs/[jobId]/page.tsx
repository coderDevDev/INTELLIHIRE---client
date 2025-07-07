'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { jobAPI } from '@/lib/api-service';
import { MainHeader } from '@/components/main-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Building, Clock, Briefcase } from 'lucide-react';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      if (!jobId || typeof jobId !== 'string') return;
      const res = await jobAPI.getJobById(jobId);
      setJob(res);
      setLoading(false);
    }
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Job not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1 bg-gray-50 py-12 md:py-16">
        <div className="container max-w-3xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                <img
                  src={job.companyId?.logo || '/placeholder.svg'}
                  alt={job.companyId?.name}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                <div className="text-sm text-muted-foreground">
                  {job.companyId?.name}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Posted{' '}
                  {job.postedDate
                    ? new Date(job.postedDate).toLocaleDateString()
                    : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-brand-blue">
                <Briefcase className="h-4 w-4" />
                <span>
                  {job.salaryMax
                    ? `₱${job.salaryMin?.toLocaleString()} - ₱${job.salaryMax?.toLocaleString()}`
                    : job.salaryMin
                    ? `₱${job.salaryMin?.toLocaleString()}`
                    : '—'}
                </span>
              </div>
            </div>
            <Button className="w-full mb-6" size="lg">
              Apply Now
            </Button>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>
            {job.requirements && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Requirements</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}
            {job.benefits && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Benefits</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.benefits}
                </p>
              </div>
            )}
            {job.responsibilities && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/jobs" className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
