import { JobPostingForm } from '@/components/job-posting-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ArrowLeft, Plus, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function CreateJobPage() {
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
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Job Posting
              </h1>
              <p className="text-sm text-gray-600">
                Add a new job posting to the system
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container py-8">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                New Job Posting
              </CardTitle>
              <CardDescription>
                Fill out the form below to create a new job posting. All fields
                marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobPostingForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
