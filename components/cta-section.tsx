import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp
} from 'lucide-react';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent"></div>

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center text-white">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Join Our Community
            </div>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight">
              Ready to Find Your{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Dream Job?
              </span>
            </h2>

            <p className="max-w-[700px] text-lg md:text-xl text-blue-100 leading-relaxed">
              Join thousands of job seekers who have found their perfect career
              match through InteliHire's AI-powered platform. Start your journey
              today and unlock endless opportunities.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-200 mr-2" />
                <div className="text-3xl font-bold text-white">2,500+</div>
              </div>
              <div className="text-sm text-blue-200">Active Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Briefcase className="h-6 w-6 text-blue-200 mr-2" />
                <div className="text-3xl font-bold text-white">500+</div>
              </div>
              <div className="text-sm text-blue-200">Job Opportunities</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-200 mr-2" />
                <div className="text-3xl font-bold text-white">95%</div>
              </div>
              <div className="text-sm text-blue-200">Success Rate</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4"
              asChild>
              <Link href="/register">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold transition-all duration-300 px-8 py-4"
              asChild>
              <Link href="/jobs">
                <Briefcase className="mr-2 h-5 w-5" />
                Browse Jobs
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-blue-200 mb-4">
              Trusted by job seekers and employers across Sto. Tomas
            </p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-sm font-medium">✓ Free to Use</div>
              <div className="text-sm font-medium">✓ AI-Powered Matching</div>
              <div className="text-sm font-medium">✓ Secure & Private</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
