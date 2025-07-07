'use client';
import { useEffect, useState } from 'react';
import { jobAPI, companyAPI, categoryAPI } from '@/lib/api-service';
import { JobCardGrid, JobCard } from '@/components/job-card-grid';

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Internship'
];

const SORT_OPTIONS = [
  { value: '-postedDate', label: 'Most Recent' },
  { value: '-salaryMax', label: 'Highest Salary' },
  { value: 'companyId', label: 'Company Name (A-Z)' }
];

type JobsSectionProps = {
  showFilters?: boolean;
  limit?: number;
};

export function JobsSection({
  showFilters = true,
  limit = 12
}: JobsSectionProps) {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [employmentType, setEmploymentType] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [sort, setSort] = useState('-postedDate');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch companies and categories on mount
  useEffect(() => {
    async function fetchCompaniesAndCategories() {
      const [companyRes, categoryRes] = await Promise.all([
        companyAPI.getCompanies(),
        categoryAPI.getCategories()
      ]);
      setCompanies(companyRes.companies || companyRes);
      setCategories(categoryRes.categories || categoryRes);
    }
    if (showFilters) fetchCompaniesAndCategories();
  }, [showFilters]);

  // Fetch jobs when filters/search/sort/page change
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const params: any = { limit, page, sort };
      if (search) params.search = search;
      if (employmentType) params.type = employmentType;
      if (company) params.company = company;
      if (location) params.location = location;
      if (category) params.category = category;
      const res = await jobAPI.getJobs(params);
      // Transform jobs to JobCard type
      const jobCards = (res.jobs || res).map((job: any) => ({
        id: job._id,
        title: job.title,
        company: job.companyId?.name || '',
        location: job.location,
        type: job.employmentType,
        salary: job.salaryMax
          ? `₱${job.salaryMin?.toLocaleString()} - ₱${job.salaryMax?.toLocaleString()}`
          : job.salaryMin
          ? `₱${job.salaryMin?.toLocaleString()}`
          : '—',
        posted: job.postedDate
          ? new Date(job.postedDate).toLocaleDateString()
          : '',
        logo: job.companyId?.logo,
        featured: job.isFeatured
      }));
      setJobs(jobCards);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || jobCards.length);
      // Extract unique locations from jobs
      const uniqueLocations = Array.from(
        new Set(
          (res.jobs || res).map((job: any) => job.location).filter(Boolean)
        )
      ) as string[];
      setLocations(uniqueLocations);
      setLoading(false);
    }
    fetchJobs();
  }, [search, employmentType, company, location, category, sort, page, limit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 500);
    setDebounceTimeout(timeout);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterChange =
    (setter: any) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="container px-4 md:px-6 mt-10">
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
      </div>
      {showFilters && (
        <form
          onSubmit={handleSubmit}
          className="w-full pt-8 pb-4 flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Search jobs by title, company, or keyword..."
            className="w-full md:w-1/5 rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          />
          <select
            value={category}
            onChange={handleFilterChange(setCategory)}
            className="w-full md:w-1/6 rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={employmentType}
            onChange={handleFilterChange(setEmploymentType)}
            className="w-full md:w-1/6 rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            <option value="">All Types</option>
            {EMPLOYMENT_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={company}
            onChange={handleFilterChange(setCompany)}
            className="w-full md:w-1/6 rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            <option value="">All Companies</option>
            {companies.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={location}
            onChange={handleFilterChange(setLocation)}
            className="w-full md:w-1/6 rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={handleFilterChange(setSort)}
            className="w-full md:w-1/6 rounded-md border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </form>
      )}
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3 w-full">
            {Array.from({ length: showFilters ? 6 : limit }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-gray-200 h-48 w-full"
              />
            ))}
          </div>
        ) : (
          <JobCardGrid jobs={jobs} />
        )}
        {/* Pagination Controls */}
        {showFilters && totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 pb-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded border bg-white text-brand-blue disabled:opacity-50">
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 rounded border ${
                  p === page
                    ? 'bg-brand-blue text-white'
                    : 'bg-white text-brand-blue'
                }`}>
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border bg-white text-brand-blue disabled:opacity-50">
              Next
            </button>
          </div>
        )}
        <div className="text-sm text-muted-foreground pb-8">
          Showing {jobs.length} of {total} jobs
        </div>
      </div>
    </section>
  );
}
