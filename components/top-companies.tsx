import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  MapPin
} from 'lucide-react';

export type TopCompany = {
  id: string;
  name: string;
  logo?: string;
  jobs: number;
};

type TopCompaniesProps = {
  companies: TopCompany[];
};

export function TopCompanies({ companies }: TopCompaniesProps) {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-88 h-88 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 left-20 w-64 h-64 bg-purple-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2.5s' }}></div>
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-green-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}></div>
        <div
          className="absolute bottom-40 left-1/3 w-80 h-80 bg-pink-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3.5s' }}></div>
        <div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-yellow-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0.5s' }}></div>
        <div
          className="absolute top-1/4 right-1/4 w-56 h-56 bg-indigo-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4.5s' }}></div>
      </div>

      <div className="container relative px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="h-4 w-4" />
              Top Employers
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Featured Companies
            </h2>
            <p className="max-w-[800px] text-gray-600 md:text-xl leading-relaxed">
              Leading employers in Sto. Tomas looking for talented individuals
              to join their teams and grow their businesses
            </p>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"></div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link href="/companies">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <Building className="h-5 w-5" />
              View All Companies
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {companies.length}+
            </div>
            <div className="text-sm text-gray-600">Active Companies</div>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {companies.reduce((sum, company) => sum + (company.jobs || 0), 0)}+
            </div>
            <div className="text-sm text-gray-600">Total Job Openings</div>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">100%</div>
            <div className="text-sm text-gray-600">Local Opportunities</div>
          </div>
        </div>
      </div>
    </section>
  );
}
