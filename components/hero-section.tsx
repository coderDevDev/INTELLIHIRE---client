import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Building,
  Sparkles,
  TrendingUp,
  Users,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export type Category = {
  _id: string;
  name: string;
};

type HeroSectionProps = {
  categories: Category[];
};

export function HeroSection({ categories }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent"></div>

      <div className="container relative px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8 text-white">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                AI-Powered Job Matching
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl leading-tight">
                Find Your Dream Job in{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Sto. Tomas
                </span>
              </h1>

              <p className="max-w-[600px] text-lg md:text-xl text-blue-100 leading-relaxed">
                InteliHire revolutionizes job hunting with AI-powered matching
                that connects you with perfect opportunities tailored to your
                skills, experience, and career aspirations.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-blue-200">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2K+</div>
                <div className="text-sm text-blue-200">Job Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-blue-200">Success Rate</div>
              </div>
            </div>

            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button
                size="lg"
                className="w-full bg-white text-blue-700 hover:bg-gray-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                asChild>
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold transition-all duration-300">
                For Employers
              </Button>
            </div>
          </div>

          {/* Right Content - Search Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quick Job Search
                </h2>
                <p className="text-gray-600">
                  Find the perfect job in seconds with our intelligent search
                </p>
              </div>

              <div className="space-y-5">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Location"
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    defaultValue="Sto. Tomas, Batangas"
                  />
                </div>

                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select className="w-full h-12 pl-12 pr-4 rounded-md border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  size="lg">
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
