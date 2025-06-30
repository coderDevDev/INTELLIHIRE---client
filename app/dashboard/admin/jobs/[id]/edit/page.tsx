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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Job not found</p>
          <Button asChild>
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
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/admin/jobs/${jobId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Job</h1>
              <p className="text-muted-foreground">{job.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Card>
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
