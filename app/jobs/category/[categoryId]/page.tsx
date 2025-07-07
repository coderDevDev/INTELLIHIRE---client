'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { jobAPI, categoryAPI, companyAPI } from '@/lib/api-service';
import { JobCardGrid, JobCard } from '@/components/job-card-grid';
import { MainHeader } from '@/components/main-header';

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

export default function CategoryJobsPage() {
  const { categoryId } = useParams();
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [employmentType, setEmploymentType] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [sort, setSort] = useState('-postedDate');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  // Fetch companies on mount
  useEffect(() => {
    async function fetchCompanies() {
      const res = await companyAPI.getCompanies();
      setCompanies(res.companies || res);
    }
    fetchCompanies();
  }, []);

  // Fetch jobs and category when filters/search/sort/page/categoryId change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!categoryId || typeof categoryId !== 'string') return;
      const [cat, jobsRes] = await Promise.all([
        categoryAPI.getCategory(categoryId),
        jobAPI.getJobs({
          category: categoryId,
          limit,
          page,
          sort,
          ...(search && { search }),
          ...(employmentType && { type: employmentType }),
          ...(company && { company }),
          ...(location && { location })
        })
      ]);
      setCategory(cat);
      const jobCards = (jobsRes.jobs || jobsRes).map((job: any) => ({
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
      setTotalPages(jobsRes.totalPages || 1);
      setTotal(jobsRes.total || jobCards.length);
      // Extract unique locations from jobs
      const uniqueLocations = Array.from(
        new Set(
          (jobsRes.jobs || jobsRes)
            .map((job: any) => job.location)
            .filter(Boolean)
        )
      ) as string[];
      setLocations(uniqueLocations);
      setLoading(false);
    }
    fetchData();
  }, [categoryId, search, employmentType, company, location, sort, page]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex-1">
          <section className="bg-gray-50 py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">
                    Jobs by Category
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {category?.name ? `Jobs in ${category.name}` : 'Jobs'}
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Discover job opportunities in this category
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3 w-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-lg bg-gray-200 h-48 w-full"
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">
                  Jobs by Category
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {category?.name ? `Jobs in ${category.name}` : 'Jobs'}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover job opportunities in this category
                </p>
              </div>
            </div>
            {/* Filter/Search/Sort Bar */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-6xl mx-auto pt-8 pb-4 flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Search jobs by title, company, or keyword..."
                className="w-full md:w-1/4 rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              />
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
            {/* Job Grid & Pagination */}
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
              {loading ? (
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3 w-full">
                  {Array.from({ length: 6 }).map((_, i) => (
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
              <div className="text-sm text-muted-foreground pb-8">
                Showing {jobs.length} of {total} jobs
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
