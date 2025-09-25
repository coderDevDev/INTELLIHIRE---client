import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Building,
  Clock,
  Landmark,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Calendar
} from 'lucide-react';

export type GovernmentJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  logo?: string;
};

type GovernmentJobsProps = {
  jobs: GovernmentJob[];
};

export function GovernmentJobs({ jobs }: GovernmentJobsProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent"></div>

      <div className="container relative px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center text-white mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Government Opportunities
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight">
              City Government{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Job Openings
              </span>
            </h2>
            <p className="max-w-[800px] text-lg md:text-xl text-blue-100 leading-relaxed">
              Serve the community of Sto. Tomas with these prestigious
              government positions and make a meaningful impact in public
              service
            </p>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <Card
              key={job.id}
              className="group relative overflow-hidden bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardContent className="relative z-10 p-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Landmark className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-lg leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {job.department}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
                    Government
                  </Badge>
                </div>

                {/* Job Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="font-medium">{job.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="font-medium">{job.type}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="font-medium">Posted {job.posted}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-bold text-green-600 text-lg">
                      {job.salary}
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    asChild>
                    <Link
                      href={`/jobs/government/${job.id}`}
                      className="flex items-center gap-2">
                      Apply Now
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </div>
              </CardContent>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold transition-all duration-300 px-8 py-4"
            asChild>
            <Link
              href="/jobs/government"
              className="inline-flex items-center gap-3">
              <Landmark className="h-5 w-5" />
              View All Government Jobs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Landmark className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {jobs.length}+
            </div>
            <div className="text-sm text-blue-200">Government Positions</div>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-blue-200">Public Service</div>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">Stable</div>
            <div className="text-sm text-blue-200">Career Growth</div>
          </div>
        </div>
      </div>
    </section>
  );
}
