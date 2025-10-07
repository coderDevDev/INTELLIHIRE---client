'use client';

import { useEffect, useState } from 'react';
import { MainHeader } from '@/components/main-header';
import {
  HeroSection,
  Category as HeroCategory
} from '@/components/hero-section';
import {
  JobCategories,
  Category as JobCategory
} from '@/components/job-categories';
import { FeaturedJobs, FeaturedJob } from '@/components/featured-jobs';
import { TopCompanies, TopCompany } from '@/components/top-companies';
import { GovernmentJobs, GovernmentJob } from '@/components/government-jobs';
import { FeaturesSection } from '@/components/features-section';
import { CtaSection } from '@/components/cta-section';
import { ModernFooter } from '@/components/modern-footer';
import { jobAPI, companyAPI, categoryAPI } from '@/lib/api-service';
import { JobsSection } from '@/components/jobs-section';
import { Button } from '@/components/ui/button';
import { BannerDisplay } from '@/components/banner-display';
import Link from 'next/link';

import { MapPin, Building, Clock, Briefcase } from 'lucide-react';
export function LandingPage() {
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [categories, setCategories] = useState<HeroCategory[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [governmentJobs, setGovernmentJobs] = useState<GovernmentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [fj, cat, tc, gj] = await Promise.all([
        jobAPI.getFeaturedJobs().then(res => res.jobs || res),
        categoryAPI.getCategories().then(res => res.categories || res),
        companyAPI.getCompanies().then(res => res.companies || res),
        jobAPI.getGovernmentJobs().then(res => res.jobs || res)
      ]);
      setFeaturedJobs(fj);
      setCategories(cat);
      setTopCompanies(tc);
      setGovernmentJobs(gj);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">
        <HeroSection categories={categories} />
        <JobCategories categories={categories} />
        {/* <FeaturedJobs jobs={featuredJobs} /> */}
        <hr />

        {/* Middle Banner Section */}
        <div className="py-8">
          <BannerDisplay position="middle" className="max-w-6xl mx-auto" />
        </div>

        <div>
          <JobsSection showFilters={false} limit={6} />
          <div className="mt-2 flex justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/jobs" className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                View All Jobs
              </Link>
            </Button>
          </div>
        </div>
        <hr className="mt-10" />
        <TopCompanies companies={topCompanies} />

        {/* Sidebar Banner Section */}
        <div className="py-8">
          <BannerDisplay position="sidebar" className="max-w-4xl mx-auto" />
        </div>

        <GovernmentJobs jobs={governmentJobs} />
        <FeaturesSection />

        {/* Bottom Banner Section */}
        <div className="py-8">
          <BannerDisplay position="bottom" className="max-w-6xl mx-auto" />
        </div>

        <CtaSection />
      </main>
      <ModernFooter />
    </div>
  );
}
