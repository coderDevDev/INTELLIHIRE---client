'use client';
import { useEffect, useState } from 'react';
import { jobAPI, companyAPI, categoryAPI } from '@/lib/api-service';
import { JobCardGrid, JobCard } from '@/components/job-card-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setEmploymentType('');
    setCompany('');
    setLocation('');
    setCategory('');
    setSort('-postedDate');
    setPage(1);
  };

  const activeFiltersCount = [
    search,
    employmentType,
    company,
    location,
    category
  ].filter(Boolean).length;

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
        <div
          className="absolute bottom-40 right-1/3 w-64 h-64 bg-green-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-yellow-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container relative px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="h-4 w-4" />
              Latest Opportunities
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Featured Job Openings
            </h2>
            <p className="max-w-[800px] text-gray-600 md:text-xl leading-relaxed">
              Discover the latest job opportunities in Sto. Tomas with our
              intelligent search and filtering system
            </p>
          </div>
        </div>

        {/* Enhanced Filters */}
        {showFilters && (
          <div className="mb-12">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            {/* Filter Form */}
            <form
              onSubmit={handleSubmit}
              className={`${
                showMobileFilters ? 'block' : 'hidden'
              } lg:block bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6`}>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchInput}
                    onChange={handleInputChange}
                    placeholder="Search jobs by title, company, or keyword..."
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="relative group">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={category}
                    onChange={handleFilterChange(setCategory)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                    <option value="">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative group">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={employmentType}
                    onChange={handleFilterChange(setEmploymentType)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                    <option value="">All Types</option>
                    {EMPLOYMENT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative group">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={company}
                    onChange={handleFilterChange(setCompany)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                    <option value="">All Companies</option>
                    {companies.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={location}
                    onChange={handleFilterChange(setLocation)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative group">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={sort}
                    onChange={handleFilterChange(setSort)}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700">
                      {activeFiltersCount} filter
                      {activeFiltersCount > 1 ? 's' : ''} applied
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="text-sm">
                  Clear Filters
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {Array.from({ length: showFilters ? 6 : limit }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-gray-200 h-64 w-full"
                />
              ))}
            </div>
          ) : (
            <JobCardGrid jobs={jobs} />
          )}

          {/* Enhanced Pagination */}
          {showFilters && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 ${
                        pageNum === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-blue-50'
                      }`}>
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing{' '}
              <span className="font-semibold text-blue-600">{jobs.length}</span>{' '}
              of <span className="font-semibold text-blue-600">{total}</span>{' '}
              jobs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
