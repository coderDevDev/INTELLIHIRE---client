import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Eye,
  Bookmark,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type JobCard = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  logo?: string;
  featured?: boolean;
  urgent?: boolean;
  remote?: boolean;
  views?: number;
  applications?: number;
};

interface JobCardGridProps {
  jobs: JobCard[];
  className?: string;
}

export function JobCardGrid({ jobs, className }: JobCardGridProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Jobs Found
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          We couldn't find any jobs matching your criteria. Try adjusting your
          filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: { job: JobCard }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center group-hover:scale-105 transition-transform">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.company}
                  className="object-contain h-8 w-8 rounded"
                />
              ) : (
                <Building className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 font-medium truncate">
                {job.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {job.featured && (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {job.urgent && (
              <Badge variant="destructive" className="text-xs">
                Urgent
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Location and Type */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{job.type}</span>
            </div>
          </div>

          {/* Salary */}
          {job.salary && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-700">{job.salary}</span>
            </div>
          )}

          {/* Posted Date */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Posted {job.posted}</span>
          </div>

          {/* Stats */}
          {(job.views || job.applications) && (
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
              {job.views && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{job.views} views</span>
                </div>
              )}
              {job.applications && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span>{job.applications} applications</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Button asChild className="flex-1">
              <Link href={`/jobs/${job.id}`}>View Job</Link>
            </Button>

            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
