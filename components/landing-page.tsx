import { MainHeader } from "@/components/main-header"
import { HeroSection } from "@/components/hero-section"
import { JobCategories } from "@/components/job-categories"
import { FeaturedJobs } from "@/components/featured-jobs"
import { TopCompanies } from "@/components/top-companies"
import { GovernmentJobs } from "@/components/government-jobs"
import { FeaturesSection } from "@/components/features-section"
import { CtaSection } from "@/components/cta-section"
import { ModernFooter } from "@/components/modern-footer"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">
        <HeroSection />
        <JobCategories />
        <FeaturedJobs />
        <TopCompanies />
        <GovernmentJobs />
        <FeaturesSection />
        <CtaSection />
      </main>
      <ModernFooter />
    </div>
  )
}
