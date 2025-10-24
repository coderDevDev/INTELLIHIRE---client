import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building, Clock, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

export type FeaturedJob = {
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

type FeaturedJobsProps = {
  jobs: FeaturedJob[];
};

const JOBS_PER_PAGE = 6;

export function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">
              Latest Opportunities
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Job Openings
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the latest job opportunities in Sto. Tomas
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          {currentJobs.map(job => (
            <Card key={job.id} className="job-card overflow-hidden">
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
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={`h-9 w-9 p-0 ${
                    currentPage === page 
                      ? 'bg-brand-blue hover:bg-brand-blue/90' 
                      : ''
                  }`}>
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <span className="ml-4 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
