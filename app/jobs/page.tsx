import { MainHeader } from '@/components/main-header';
import { JobsSection } from '@/components/jobs-section';

export default function JobsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">
        <JobsSection showFilters={true} limit={12} />
      </main>
    </div>
  );
}
