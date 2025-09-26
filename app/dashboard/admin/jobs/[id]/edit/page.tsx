'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { jobAPI, authAPI } from '@/lib/api-service';
import { useToast } from '@/components/ui/use-toast';
import { JobPostingForm } from '@/components/job-posting-form';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const response = await jobAPI.getJobById(jobId);

        console.log({ response });
        setJob(response);
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

  const handleJobUpdate = async (jobData: any) => {
    try {
      await jobAPI.updateJob(jobId, jobData);
      toast({
        title: 'Success',
        description: 'Job updated successfully'
      });
      router.push(`/dashboard/admin/jobs/${jobId}`);
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job',
        variant: 'destructive'
      });
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
              <Link href={`/dashboard/admin/jobs/${jobId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <ArrowLeft className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit Job
              </h1>
              <p className="text-sm text-gray-600">{job.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container py-8">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Edit Job Posting</CardTitle>
              <CardDescription>
                Update the job posting details. All changes will be saved when
                you submit the form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobPostingForm
                initialData={job}
                onSubmit={handleJobUpdate}
                isEditing={true}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
