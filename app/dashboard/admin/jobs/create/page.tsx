import { JobPostingForm } from '@/components/job-posting-form';

export default function CreateJobPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <h1 className="text-2xl font-bold">Create Job Postingss</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <JobPostingForm />
        </div>
      </main>
    </div>
  );
}
