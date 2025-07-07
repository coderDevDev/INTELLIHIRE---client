import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building, Clock } from 'lucide-react';

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
};

type JobCardGridProps = {
  jobs: JobCard[];
};

export function JobCardGrid({ jobs }: JobCardGridProps) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map(job => (
        <Card
          key={job.id}
          className="job-card overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg">
          {job.featured && (
            <div className="absolute right-0 top-0">
              <Badge className="rounded-bl-md rounded-tr-md rounded-br-none rounded-tl-none bg-brand-blue">
                Featured
              </Badge>
            </div>
          )}
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={job.logo || '/placeholder.svg'}
                    alt={job.company}
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold truncate">{job.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {job.company}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Posted {job.posted}</span>
              </div>
              <div className="pt-1 font-medium text-brand-blue">
                {job.salary}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button asChild>
                <Link href={`/jobs/${job.id}`}>Apply Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
