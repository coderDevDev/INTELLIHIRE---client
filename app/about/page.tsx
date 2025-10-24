import { MainHeader } from '@/components/main-header';
import { ModernFooter } from '@/components/modern-footer';
import {
  Briefcase,
  Target,
  Users,
  Zap,
  Award,
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
  Building,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 md:py-32">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
            <div
              className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
              style={{ animationDelay: '2s' }}></div>
            <div
              className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
              style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="container relative px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                About InteliHire
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl mb-6">
                Revolutionizing Job Matching with{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  AI Technology
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                InteliHire is an AI-powered job matching platform designed to connect job seekers
                with their ideal opportunities in Sto. Tomas, Batangas. We're transforming the way
                people find jobs and companies find talent.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 text-sm font-medium text-blue-700">
                  <Target className="h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Empowering Job Seekers Through Technology
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our mission is to make job hunting smarter, faster, and more efficient by
                  leveraging artificial intelligence to match job seekers with opportunities that
                  align with their skills, experience, and career aspirations.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe that everyone deserves access to meaningful employment opportunities,
                  and we're committed to breaking down barriers in the job search process.
                </p>
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 text-sm font-medium text-purple-700">
                  <Sparkles className="h-4 w-4" />
                  Our Vision
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Building a Brighter Future for Sto. Tomas
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We envision a future where every job seeker in Sto. Tomas has access to
                  AI-powered tools that help them discover their perfect career path, and every
                  employer can efficiently find the right talent for their organization.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Through innovation and dedication, we aim to become the leading employment
                  platform in the region, driving economic growth and prosperity for our community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do at InteliHire
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <Zap className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate to provide cutting-edge AI technology that makes job
                  matching more accurate and efficient.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300">
                  <Heart className="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Empathy</h3>
                <p className="text-gray-600">
                  We understand the challenges of job hunting and design our platform with
                  compassion and user-centric thinking.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors duration-300">
                  <Award className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service, from technology to
                  customer support.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors duration-300">
                  <Shield className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We operate with transparency and honesty, building trust with both job seekers
                  and employers.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                  <Users className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-gray-600">
                  We're committed to serving the Sto. Tomas community and contributing to local
                  economic development.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-600 transition-colors duration-300">
                  <TrendingUp className="h-6 w-6 text-pink-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Growth</h3>
                <p className="text-gray-600">
                  We support continuous learning and career development for both our users and our
                  team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Building className="h-8 w-8" />
                    <h2 className="text-3xl font-bold">Partnership with PESO</h2>
                  </div>
                  <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                    InteliHire is proudly operated in partnership with the Public Employment Service
                    Office (PESO) under the City Government of Sto. Tomas, Batangas. This
                    collaboration ensures that our platform serves the best interests of our local
                    community.
                  </p>
                  <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Visit PESO Sto. Tomas</p>
                      <p className="text-sm text-blue-100">
                        City Hall, Sto. Tomas, Batangas, Philippines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Ready to Find Your Dream Job?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of job seekers who have found their perfect match with InteliHire's
                AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ModernFooter />
    </div>
  );
}
