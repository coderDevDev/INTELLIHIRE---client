'use client';

import { Suspense } from 'react';
import { MainHeader } from '@/components/main-header';
import { ModernJobsPage } from '@/components/modern-jobs-page';

function JobsPageContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">
        <ModernJobsPage />
      </main>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <MainHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </main>
        </div>
      }>
      <JobsPageContent />
    </Suspense>
  );
}
