'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Search,
  MapPin,
  Building,
  Clock,
  Bookmark,
  BookmarkCheck,
  Filter,
  X,
  Loader2,
  Star,
  TrendingUp,
  Eye,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
  Phone,
  Heart,
  Share2
} from 'lucide-react';
import {
  jobAPI,
  categoryAPI,
  authAPI,
  applicationAPI,
  documentAPI
} from '@/lib/api-service';
// import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

interface Job {
  _id: string;
  title: string;
  companyId?: {
    _id: string;
    name: string;
    logo?: string;
    isGovernment?: boolean;
  };
  location: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  description: string;
  postedDate: string;
  isRemote?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
  category?: string;
  experienceLevel?: string;
  skills?: string[];
  requirements?: string;
  applicationCount?: number;
  status: string;
  // AI recommendation fields
  matchScore?: number;
  algorithmicScore?: number;
  aiScore?: number;
  matchReasons?: string[];
  aiInsights?: any;
}

interface FilterState {
  search: string;
  category: string[];
  salaryRange: [number, number];
  experienceLevel: string[];
  datePosted: string;
  employmentType: string[];
  location: string;
  isRemote: boolean | null;
}

export function ModernJobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [userApplications, setUserApplications] = useState<Set<string>>(
    new Set()
  );
  const [userDocuments, setUserDocuments] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: [],
    salaryRange: [0, 200000],
    experienceLevel: [],
    datePosted: '',
    employmentType: [],
    location: '',
    isRemote: null
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const [isFilterSticky, setIsFilterSticky] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Get company filter from URL params
        const companyId = searchParams.get('company');

        const [jobsRes, categoriesRes] = await Promise.all([
          jobAPI.getJobs({
            limit: 20,
            page: 1,
            ...(companyId && { companyId })
          }),
          categoryAPI.getCategories()
        ]);

        const jobsData = jobsRes.jobs || jobsRes;
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setCategories(categoriesRes.categories || categoriesRes);

        // If company filter is active, show a message
        if (companyId) {
          const companyName =
            jobsData.length > 0 ? jobsData[0].companyId?.name : 'this company';
          toast.success(`Showing jobs from ${companyName}`);
        }

        // Load saved jobs from localStorage
        const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setSavedJobs(saved);

        // Load recently viewed jobs
        const viewed = JSON.parse(
          localStorage.getItem('recentlyViewedJobs') || '[]'
        );
        setRecentlyViewed(viewed.slice(0, 5));

        // Load user documents if authenticated
        if (authAPI.isAuthenticated()) {
          try {
            const docs = await documentAPI.getMyDocuments();
            setUserDocuments(docs || []);
          } catch (error) {
            console.error('Error loading user documents:', error);
            setUserDocuments([]);
          }
        }

        // Load AI-powered job recommendations
        try {
          const recommendationsRes = await jobAPI.getJobRecommendations({
            limit: 3
          });
          const recommendations =
            recommendationsRes.recommendations || recommendationsRes;
          setRecommendedJobs(recommendations.slice(0, 3));
        } catch (error) {
          console.error('Error loading recommendations:', error);
          // Fallback to first 3 jobs if recommendations fail
          setRecommendedJobs(jobsData.slice(0, 3));
        }

        // Load user applications if authenticated
        if (authAPI.isAuthenticated()) {
          try {
            const user = authAPI.getCurrentUser();
            if (user?.id) {
              const applicationsRes = await applicationAPI.getMyApplications();
              const appliedJobIds = new Set<string>(
                applicationsRes.applications?.map(
                  (app: any) => app.jobId._id
                ) || []
              );
              setUserApplications(appliedJobIds);
            }
          } catch (error) {
            console.error('Error loading user applications:', error);
          }
        }

        setHasMore(jobsData.length === 20);
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [searchParams]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMoreJobs();
    }
  }, [inView, hasMore, loadingMore]);

  // Handle filter sticky behavior and infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setIsFilterSticky(rect.top <= 0);
      }

      // Check if load more element is in view
      if (loadMoreRef.current) {
        const rect = loadMoreRef.current.getBoundingClientRect();
        setInView(rect.top <= window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadMoreJobs = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      // Get company filter from URL params
      const companyId = searchParams.get('company');

      const jobsRes = await jobAPI.getJobs({
        limit: 20,
        page: nextPage,
        ...(companyId && { companyId })
      });
      const newJobs = jobsRes.jobs || jobsRes;

      if (newJobs.length > 0) {
        setJobs(prev => [...prev, ...newJobs]);
        setFilteredJobs(prev => [...prev, ...newJobs]);
        setPage(nextPage);
        setHasMore(newJobs.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more jobs:', error);
      toast.error('Failed to load more jobs');
    } finally {
      setLoadingMore(false);
    }
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...jobs];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchLower) ||
          job.companyId?.name.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(job =>
        filters.category.includes(job.category || '')
      );
    }

    // Salary range filter
    filtered = filtered.filter(job => {
      const minSalary = job.salaryMin || 0;
      const maxSalary = job.salaryMax || 0;
      return (
        minSalary >= filters.salaryRange[0] &&
        maxSalary <= filters.salaryRange[1]
      );
    });

    // Experience level filter
    if (filters.experienceLevel.length > 0) {
      filtered = filtered.filter(job =>
        filters.experienceLevel.includes(job.experienceLevel || '')
      );
    }

    // Date posted filter
    if (filters.datePosted && filters.datePosted !== 'any') {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.datePosted) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(job => new Date(job.postedDate) >= filterDate);
    }

    // Employment type filter
    if (filters.employmentType.length > 0) {
      filtered = filtered.filter(job =>
        filters.employmentType.includes(job.employmentType)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Remote filter
    if (filters.isRemote !== null) {
      filtered = filtered.filter(job => job.isRemote === filters.isRemote);
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));

    toast.success(
      savedJobs.includes(jobId)
        ? 'Job removed from saved'
        : 'Job saved successfully'
    );
  };

  const handleViewJob = (job: Job) => {
    const viewed = JSON.parse(
      localStorage.getItem('recentlyViewedJobs') || '[]'
    );
    const updated = [
      job,
      ...viewed.filter((j: Job) => j._id !== job._id)
    ].slice(0, 10);
    setRecentlyViewed(updated.slice(0, 5));
    localStorage.setItem('recentlyViewedJobs', JSON.stringify(updated));
  };

  const handleJobClick = async (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    handleViewJob(job);

    // Load similar jobs
    setLoadingSimilar(true);
    try {
      const similarRes = await jobAPI.getJobs({
        limit: 6,
        category: job.category,
        search: job.title.split(' ')[0] // Use first word of job title
      });
      const similar = similarRes.jobs || similarRes;
      setSimilarJobs(similar.filter((j: Job) => j._id !== job._id).slice(0, 5));
    } catch (error) {
      console.error('Error loading similar jobs:', error);
      setSimilarJobs([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const closeJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJob(null);
    setSimilarJobs([]);
  };

  const handleApplyNow = async (job: Job) => {
    // Check if already applied
    if (userApplications.has(job._id)) {
      toast.error('You have already applied for this position');
      return;
    }

    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      toast.error('Please login to apply for this job');
      router.push(`/login?redirect=/jobs/${job._id}/apply`);
      return;
    }

    // Check if required documents are uploaded
    const isGovernmentJob = job.companyId?.isGovernment || false;
    const hasPDS = userDocuments.some(doc => doc.type === 'pds');
    const hasResume = userDocuments.some(doc => doc.type === 'resume');

    if (isGovernmentJob && !hasPDS) {
      toast.error(
        'Government jobs require a PDS (Personal Data Sheet). Please upload your PDS first.',
        {
          action: {
            label: 'Upload PDS',
            onClick: () => router.push('/dashboard/applicant/documents')
          },
          duration: 6000
        }
      );
      return;
    }

    if (!isGovernmentJob && !hasResume) {
      toast.error(
        'This job requires a Resume/CV. Please upload your resume first.',
        {
          action: {
            label: 'Upload Resume',
            onClick: () => router.push('/dashboard/applicant/documents')
          },
          duration: 6000
        }
      );
      return;
    }

    // All checks passed, proceed to application
    closeJobDetails();
    router.push(`/jobs/${job._id}/apply`);
  };

  const isJobApplied = (jobId: string) => {
    return userApplications.has(jobId);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: [],
      salaryRange: [0, 200000],
      experienceLevel: [],
      datePosted: '',
      employmentType: [],
      location: '',
      isRemote: null
    });
  };

  const formatSalary = (job: Job) => {
    // Handle new salary object format
    if (job.salary) {
      const { min, max, currency = 'PHP' } = job.salary;
      if (!min && !max) return 'Salary not specified';
      if (min && max)
        return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
      if (min) return `₱${min.toLocaleString()}+`;
      if (max) return `Up to ₱${max.toLocaleString()}`;
    }

    // Handle legacy salary fields
    const min = job.salaryMin;
    const max = job.salaryMax;
    if (!min && !max) return 'Salary not specified';
    if (min && max)
      return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
    if (min) return `₱${min.toLocaleString()}+`;
    if (max) return `Up to ₱${max.toLocaleString()}`;
    return 'Salary not specified';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 text-lg">
            Discover amazing opportunities in Sto. Tomas and beyond
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div
              ref={filterRef}
              className={`bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50 ${
                isFilterSticky ? 'sticky top-4' : ''
              }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  Filters
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Job title, company, keyword..."
                      value={filters.search}
                      onChange={e =>
                        setFilters(prev => ({
                          ...prev,
                          search: e.target.value
                        }))
                      }
                      className="pl-10 bg-white/60 backdrop-blur-sm border-white/50"
                    />
                  </div>
                </div>

                {/* Job Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Job Category
                  </Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map(category => (
                      <div
                        key={category._id}
                        className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category._id}`}
                          checked={filters.category.includes(category.name)}
                          onCheckedChange={checked => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                category: [...prev.category, category.name]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                category: prev.category.filter(
                                  c => c !== category.name
                                )
                              }));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`category-${category._id}`}
                          className="text-sm text-gray-600 cursor-pointer">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Salary Range: ₱{filters.salaryRange[0].toLocaleString()} - ₱
                    {filters.salaryRange[1].toLocaleString()}
                  </Label>
                  <Slider
                    value={filters.salaryRange}
                    onValueChange={value =>
                      setFilters(prev => ({
                        ...prev,
                        salaryRange: value as [number, number]
                      }))
                    }
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Experience Level
                  </Label>
                  <div className="space-y-2">
                    {['Entry', 'Mid', 'Senior', 'Executive'].map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`exp-${level}`}
                          checked={filters.experienceLevel.includes(level)}
                          onCheckedChange={checked => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                experienceLevel: [
                                  ...prev.experienceLevel,
                                  level
                                ]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                experienceLevel: prev.experienceLevel.filter(
                                  l => l !== level
                                )
                              }));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`exp-${level}`}
                          className="text-sm text-gray-600 cursor-pointer">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Posted */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Date Posted
                  </Label>
                  <Select
                    value={filters.datePosted || 'any'}
                    onValueChange={value =>
                      setFilters(prev => ({
                        ...prev,
                        datePosted: value === 'any' ? '' : value
                      }))
                    }>
                    <SelectTrigger className="bg-white/60 backdrop-blur-sm border-white/50">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Employment Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Employment Type
                  </Label>
                  <div className="space-y-2">
                    {[
                      'Full-time',
                      'Part-time',
                      'Contract',
                      'Temporary',
                      'Internship'
                    ].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.employmentType.includes(type)}
                          onCheckedChange={checked => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                employmentType: [...prev.employmentType, type]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                employmentType: prev.employmentType.filter(
                                  t => t !== type
                                )
                              }));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm text-gray-600 cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remote Work */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Remote Work
                  </Label>
                  <Select
                    value={
                      filters.isRemote === null
                        ? 'any'
                        : filters.isRemote.toString()
                    }
                    onValueChange={value =>
                      setFilters(prev => ({
                        ...prev,
                        isRemote: value === 'any' ? null : value === 'true'
                      }))
                    }>
                    <SelectTrigger className="bg-white/60 backdrop-blur-sm border-white/50">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="true">Remote only</SelectItem>
                      <SelectItem value="false">On-site only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Job Cards */}
          <div className="flex-1">
            {/* Personalization Section */}
            {(recommendedJobs.length > 0 || recentlyViewed.length > 0) && (
              <div className="mb-8 space-y-6">
                {/* Recommended Jobs */}
                {recommendedJobs.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Recommended for You
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {recommendedJobs.map(job => (
                          <div
                            key={job._id}
                            className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 cursor-pointer"
                            onClick={() => handleJobClick(job)}>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {job.title}
                              </h4>
                              <div className="flex gap-1">
                                {job.matchScore && (
                                  <Badge className="text-xs bg-blue-100 text-blue-700">
                                    {job.matchScore}% match
                                  </Badge>
                                )}
                                {isJobApplied(job._id) ? (
                                  <Badge className="text-xs bg-green-100 text-green-700">
                                    Applied
                                  </Badge>
                                ) : (
                                  <Badge className="text-xs bg-yellow-100 text-yellow-700">
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {job.companyId?.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recently Viewed */}
                {/* {recentlyViewed.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Eye className="h-5 w-5 text-blue-500" />
                        Recently Viewed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {recentlyViewed.map(job => (
                          <div
                            key={job._id}
                            className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 cursor-pointer"
                            onClick={() => handleJobClick(job)}>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {job.title}
                              </h4>
                              <Badge className="text-xs bg-blue-100 text-blue-700">
                                Viewed
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {job.companyId?.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )} */}
              </div>
            )}

            {/* Job Cards */}
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {searchParams.get('company')
                      ? 'Company Jobs'
                      : `${filteredJobs.length} Jobs Found`}
                  </h2>
                  <p className="text-gray-600">
                    {searchParams.get('company') && jobs.length > 0 && (
                      <span className="text-blue-600 font-medium">
                        Showing jobs from {jobs[0].companyId?.name}
                      </span>
                    )}
                    {filters.search &&
                      !searchParams.get('company') &&
                      `Searching for "${filters.search}"`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="bg-white/60 backdrop-blur-sm border-white/50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Job Cards Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-600">Loading jobs...</p>
                  </div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  <AnimatePresence>
                    {filteredJobs.map((job, index) => (
                      <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group">
                        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-4 flex-1">
                                {/* Company Logo */}
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {job.companyId?.logo ? (
                                      <img
                                        src={job.companyId.logo}
                                        alt={job.companyId.name}
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <Building className="h-8 w-8 text-gray-400" />
                                    )}
                                  </div>
                                </div>

                                {/* Job Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                        {job.title}
                                      </h3>
                                      <p className="text-gray-600 font-medium">
                                        {job.companyId?.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isJobApplied(job._id) && (
                                        <Badge className="bg-green-100 text-green-700">
                                          Applied
                                        </Badge>
                                      )}
                                      {job.isFeatured && (
                                        <Badge className="bg-yellow-100 text-yellow-700">
                                          <Star className="h-3 w-3 mr-1" />
                                          Featured
                                        </Badge>
                                      )}
                                      {job.isUrgent && (
                                        <Badge className="bg-red-100 text-red-700">
                                          Urgent
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {/* Job Details */}
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {job.location}
                                    </div>
                                    {job.isRemote && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs">
                                        Remote
                                      </Badge>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Briefcase className="h-4 w-4" />
                                      {job.employmentType}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {getTimeAgo(job.postedDate)}
                                    </div>
                                    {job.applicationCount && (
                                      <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {job.applicationCount} applicants
                                      </div>
                                    )}
                                  </div>

                                  {/* Salary */}
                                  <div className="flex items-center gap-1 text-sm font-medium text-green-600 mb-3">
                                    <DollarSign className="h-4 w-4" />
                                    {formatSalary(job)}
                                  </div>

                                  {/* Description */}
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {job.description}
                                  </p>

                                  {/* Skills */}
                                  {job.skills && job.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {job.skills
                                        .slice(0, 3)
                                        .map((skill, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="outline"
                                            className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                            {skill}
                                          </Badge>
                                        ))}
                                      {job.skills.length > 3 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs">
                                          +{job.skills.length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveJob(job._id)}
                                  className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                                  {savedJobs.includes(job._id) ? (
                                    <BookmarkCheck className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                                  onClick={() => handleJobClick(job)}>
                                  {isJobApplied(job._id)
                                    ? 'View Application'
                                    : 'View Details'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Load More Trigger */}
                  {hasMore && (
                    <div ref={loadMoreRef} className="flex justify-center py-8">
                      {loadingMore ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading more jobs...
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={loadMoreJobs}
                          className="bg-white/60 backdrop-blur-sm border-white/50">
                          Load More Jobs
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {showJobDetails && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeJobDetails}
                  className="absolute top-4 right-4 text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                    {selectedJob.companyId?.logo ? (
                      <img
                        src={selectedJob.companyId.logo}
                        alt={selectedJob.companyId.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">
                      {selectedJob.title}
                    </h1>
                    <p className="text-blue-100 text-lg mb-3">
                      {selectedJob.companyId?.name}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedJob.location}
                      </div>
                      {selectedJob.isRemote && (
                        <Badge className="bg-white/20 text-white border-white/30">
                          Remote
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {selectedJob.employmentType}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeAgo(selectedJob.postedDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveJob(selectedJob._id)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      {savedJobs.includes(selectedJob._id) ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
                {/* Salary & Match Score */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {formatSalary(selectedJob)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {selectedJob.matchScore && (
                      <Badge className="bg-blue-100 text-blue-700">
                        {selectedJob.matchScore}% Match
                      </Badge>
                    )}
                    {isJobApplied(selectedJob._id) && (
                      <Badge className="bg-green-100 text-green-700">
                        Applied
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Job Description
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedJob.description}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                {selectedJob.requirements && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Requirements
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedJob.requirements}
                      </p>
                    </div>
                  </div>
                )}

                {/* Skills */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Overview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    About {selectedJob.companyId?.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Learn more about this company and their culture.
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white/60 backdrop-blur-sm border-white/50">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Company Profile
                  </Button>
                </div>

                {/* Similar Jobs */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Similar Jobs
                  </h2>
                  {loadingSimilar ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : similarJobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {similarJobs.map(job => (
                        <div
                          key={job._id}
                          className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 cursor-pointer"
                          onClick={() => {
                            setSelectedJob(job);
                            handleViewJob(job);
                          }}>
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                              {job.companyId?.logo ? (
                                <img
                                  src={job.companyId.logo}
                                  alt={job.companyId.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Building className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {job.title}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                {job.companyId?.name}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </div>
                              <div className="flex gap-1 mt-1">
                                {job.matchScore && (
                                  <Badge className="text-xs bg-blue-100 text-blue-700">
                                    {job.matchScore}% match
                                  </Badge>
                                )}
                                {isJobApplied(job._id) && (
                                  <Badge className="text-xs bg-green-100 text-green-700">
                                    Applied
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No similar jobs found
                    </p>
                  )}
                </div>
              </div>

              {/* Sticky Apply Button */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-white/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {formatSalary(selectedJob)}
                      </span>
                      <span className="text-gray-500 ml-2">
                        • {selectedJob.employmentType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSaveJob(selectedJob._id)}
                      className="bg-white/60 backdrop-blur-sm border-white/50">
                      {savedJobs.includes(selectedJob._id) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save Job
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleApplyNow(selectedJob)}
                      disabled={isJobApplied(selectedJob._id)}
                      className={`shadow-lg px-8 ${
                        isJobApplied(selectedJob._id)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                      }`}>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {isJobApplied(selectedJob._id)
                        ? 'Already Applied'
                        : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
