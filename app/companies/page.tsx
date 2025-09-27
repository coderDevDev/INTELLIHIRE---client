'use client';

import { MainHeader } from '@/components/main-header';
import { ModernCompaniesPage } from '@/components/modern-companies-page';

export default function CompaniesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">
        <ModernCompaniesPage />
      </main>
    </div>
  );
}
