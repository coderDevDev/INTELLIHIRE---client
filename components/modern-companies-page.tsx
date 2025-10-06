'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Share2,
  Grid3X3,
  List,
  Award,
  Zap,
  Target,
  Building2,
  UserPlus,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { companyAPI, jobAPI } from '@/lib/api-service';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Company {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  industry?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
  };
  isGovernment?: boolean;
  isVerified?: boolean;
  createdAt: string;
  // Computed fields
  jobCount?: number;
  isHiring?: boolean;
  isRemoteFriendly?: boolean;
  isTopRated?: boolean;
  rating?: number;
  reviewCount?: number;
}

interface FilterState {
  search: string;
  industry: string[];
  companySize: string[];
  location: string;
  isHiring: boolean | null;
  isRemoteFriendly: boolean | null;
  isTopRated: boolean | null;
  isVerified: boolean | null;
}

export function ModernCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [savedCompanies, setSavedCompanies] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'top-rated'>(
    'all'
  );
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    industry: [],
    companySize: [],
    location: '',
    isHiring: null,
    isRemoteFriendly: null,
    isTopRated: null,
    isVerified: null
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
        const companiesRes = await companyAPI.getCompanies();
        const companiesData = companiesRes.companies || companiesRes;

        // Enhance companies with additional data
        const enhancedCompanies = await Promise.all(
          companiesData.map(async (company: Company) => {
            try {
              // Get job count for this company
              const jobsRes = await jobAPI.getJobs({
                companyId: company._id,
                limit: 1
              });
              const jobCount = jobsRes.total || 0;

              return {
                ...company,
                jobCount,
                isHiring: jobCount > 0,
                isRemoteFriendly: Math.random() > 0.5, // Mock data
                isTopRated: Math.random() > 0.7, // Mock data
                rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3-5 rating
                reviewCount: Math.floor(Math.random() * 100) + 10 // 10-110 reviews
              };
            } catch (error) {
              return {
                ...company,
                jobCount: 0,
                isHiring: false,
                isRemoteFriendly: false,
                isTopRated: false,
                rating: 0,
                reviewCount: 0
              };
            }
          })
        );

        setCompanies(enhancedCompanies);
        setFilteredCompanies(enhancedCompanies);

        // Load saved companies from localStorage
        const saved = JSON.parse(
          localStorage.getItem('savedCompanies') || '[]'
        );
        setSavedCompanies(saved);

        setHasMore(enhancedCompanies.length === 20);
      } catch (error) {
        console.error('Error loading companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Apply filters whenever companies or filters state changes
  useEffect(() => {
    let filtered = companies;

    // Search term filter
    if (filters.search) {
      filtered = filtered.filter(
        company =>
          company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          company.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          company.industry?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Industry filter
    if (filters.industry.length > 0) {
      filtered = filtered.filter(company =>
        filters.industry.includes(company.industry || '')
      );
    }

    // Company size filter (mock implementation)
    if (filters.companySize.length > 0) {
      filtered = filtered.filter(company => {
        const jobCount = company.jobCount || 0;
        if (filters.companySize.includes('startup') && jobCount <= 5)
          return true;
        if (
          filters.companySize.includes('smb') &&
          jobCount > 5 &&
          jobCount <= 20
        )
          return true;
        if (filters.companySize.includes('enterprise') && jobCount > 20)
          return true;
        return false;
      });
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(
        company =>
          company.address?.city
            ?.toLowerCase()
            .includes(filters.location.toLowerCase()) ||
          company.address?.province
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())
      );
    }

    // Hiring filter
    if (filters.isHiring !== null) {
      filtered = filtered.filter(
        company => company.isHiring === filters.isHiring
      );
    }

    // Remote friendly filter
    if (filters.isRemoteFriendly !== null) {
      filtered = filtered.filter(
        company => company.isRemoteFriendly === filters.isRemoteFriendly
      );
    }

    // Top rated filter
    if (filters.isTopRated !== null) {
      filtered = filtered.filter(
        company => company.isTopRated === filters.isTopRated
      );
    }

    // Verified filter
    if (filters.isVerified !== null) {
      filtered = filtered.filter(
        company => company.isVerified === filters.isVerified
      );
    }

    // Apply tab filter
    if (activeTab === 'featured') {
      filtered = filtered.filter(company => company.isVerified);
    } else if (activeTab === 'top-rated') {
      filtered = filtered.filter(company => company.isTopRated);
    }

    setFilteredCompanies(filtered);
  }, [companies, filters, activeTab]);

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMoreCompanies();
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

  const loadMoreCompanies = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const companiesRes = await companyAPI.getCompanies({
        page: nextPage,
        limit: 20
      });
      const newCompanies = companiesRes.companies || companiesRes;

      if (newCompanies.length > 0) {
        setCompanies(prev => [...prev, ...newCompanies]);
        setPage(nextPage);
        setHasMore(newCompanies.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more companies:', error);
      toast.error('Failed to load more companies');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxFilterChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    setFilters(prev => {
      const currentArray = (prev[key] as string[]) || [];
      if (checked) {
        return { ...prev, [key]: [...currentArray, value] };
      } else {
        return { ...prev, [key]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSaveCompany = (companyId: string) => {
    const saved = JSON.parse(localStorage.getItem('savedCompanies') || '[]');
    const isSaved = saved.includes(companyId);

    if (isSaved) {
      const updated = saved.filter((id: string) => id !== companyId);
      localStorage.setItem('savedCompanies', JSON.stringify(updated));
      setSavedCompanies(updated);
      toast.success('Company removed from saved');
    } else {
      const updated = [...saved, companyId];
      localStorage.setItem('savedCompanies', JSON.stringify(updated));
      setSavedCompanies(updated);
      toast.success('Company saved successfully');
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const closeCompanyDetails = () => {
    setShowCompanyDetails(false);
    setSelectedCompany(null);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      industry: [],
      companySize: [],
      location: '',
      isHiring: null,
      isRemoteFriendly: null,
      isTopRated: null,
      isVerified: null
    });
  };

  const getCompanySize = (jobCount: number) => {
    if (jobCount <= 5) return 'Startup';
    if (jobCount <= 20) return 'SMB';
    return 'Enterprise';
  };

  const industries = [
    'Information Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Government',
    'Non-profit',
    'Media & Entertainment'
  ];

  const companySizes = ['Startup', 'SMB', 'Enterprise'];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container relative z-10 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover Companies
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the best companies to work for. Explore opportunities, culture,
            and benefits.
          </motion.p>
        </div>

        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8">
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search companies by name, industry, or location..."
                    className="pl-10 bg-white/60 backdrop-blur-sm border-white/50 focus:ring-2 focus:ring-blue-500"
                    value={filters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Toggles */}
              <div className="flex items-center gap-2">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('all')}
                  className={
                    activeTab === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/60 backdrop-blur-sm border-white/50'
                  }>
                  All Companies
                </Button>
                <Button
                  variant={activeTab === 'featured' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('featured')}
                  className={
                    activeTab === 'featured'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/60 backdrop-blur-sm border-white/50'
                  }>
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Button>
                <Button
                  variant={activeTab === 'top-rated' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('top-rated')}
                  className={
                    activeTab === 'top-rated'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/60 backdrop-blur-sm border-white/50'
                  }>
                  <Award className="h-3 w-3 mr-1" />
                  Top Rated
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/60 backdrop-blur-sm border-white/50'
                  }>
                  <Grid3X3 className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/60 backdrop-blur-sm border-white/50'
                  }>
                  <List className="h-3 w-3" />
                </Button>
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/60 backdrop-blur-sm border-white/50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {Object.values(filters).some(v =>
                  Array.isArray(v) ? v.length > 0 : v !== '' && v !== null
                ) && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">
                    {
                      Object.values(filters).filter(v =>
                        Array.isArray(v) ? v.length > 0 : v !== '' && v !== null
                      ).length
                    }
                  </Badge>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                ref={filterRef}
                className={`lg:col-span-1 space-y-6 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg transition-all duration-300 ${
                  isFilterSticky ? 'lg:sticky lg:top-4' : ''
                }`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Industry Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Industry
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {industries.map(industry => (
                      <div
                        key={industry}
                        className="flex items-center space-x-2">
                        <Checkbox
                          id={`industry-${industry}`}
                          checked={filters.industry.includes(industry)}
                          onCheckedChange={checked =>
                            handleCheckboxFilterChange(
                              'industry',
                              industry,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`industry-${industry}`}
                          className="text-sm">
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Size Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Company Size
                  </Label>
                  <div className="space-y-2">
                    {companySizes.map(size => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={filters.companySize.includes(size)}
                          onCheckedChange={checked =>
                            handleCheckboxFilterChange(
                              'companySize',
                              size,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`size-${size}`} className="text-sm">
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Location
                  </Label>
                  <Input
                    placeholder="City or province..."
                    className="bg-white/60 backdrop-blur-sm border-white/50"
                    value={filters.location}
                    onChange={e =>
                      handleFilterChange('location', e.target.value)
                    }
                  />
                </div>

                {/* Quick Filters */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Quick Filters
                  </Label>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hiring"
                        checked={filters.isHiring === true}
                        onCheckedChange={checked =>
                          handleFilterChange('isHiring', checked ? true : null)
                        }
                      />
                      <Label htmlFor="hiring" className="text-sm">
                        Hiring Now
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remote"
                        checked={filters.isRemoteFriendly === true}
                        onCheckedChange={checked =>
                          handleFilterChange(
                            'isRemoteFriendly',
                            checked ? true : null
                          )
                        }
                      />
                      <Label htmlFor="remote" className="text-sm">
                        Remote Friendly
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="top-rated"
                        checked={filters.isTopRated === true}
                        onCheckedChange={checked =>
                          handleFilterChange(
                            'isTopRated',
                            checked ? true : null
                          )
                        }
                      />
                      <Label htmlFor="top-rated" className="text-sm">
                        Top Rated
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified"
                        checked={filters.isVerified === true}
                        onCheckedChange={checked =>
                          handleFilterChange(
                            'isVerified',
                            checked ? true : null
                          )
                        }
                      />
                      <Label htmlFor="verified" className="text-sm">
                        Verified
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
                  onClick={clearFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div
            className={`${
              showFilters ? 'lg:col-span-3' : 'lg:col-span-4'
            } space-y-6`}>
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'all' && 'All Companies'}
                  {activeTab === 'featured' && 'Featured Companies'}
                  {activeTab === 'top-rated' && 'Top Rated Companies'}
                </h2>
                <p className="text-gray-600">
                  {filteredCompanies.length} companies found
                </p>
              </div>
            </div>

            {/* Companies Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-lg text-gray-600">
                  Loading companies...
                </span>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium">
                  No companies found matching your criteria.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                {filteredCompanies.map((company, index) => (
                  <motion.div
                    key={company._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group">
                    <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6">
                        {viewMode === 'grid' ? (
                          // Grid View
                          <div className="text-center">
                            {/* Company Logo */}
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                              {company.logo ? (
                                <img
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Building2 className="h-10 w-10 text-gray-400" />
                              )}
                            </div>

                            {/* Company Name */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {company.name}
                            </h3>

                            {/* Industry & Location */}
                            <div className="text-sm text-gray-600 mb-3">
                              <p className="font-medium">{company.industry}</p>
                              <p>
                                {company.address?.city},{' '}
                                {company.address?.province}
                              </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap justify-center gap-1 mb-4">
                              {company.isHiring && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  Hiring Now
                                </Badge>
                              )}
                              {company.isRemoteFriendly && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  Remote Friendly
                                </Badge>
                              )}
                              {company.isTopRated && (
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Top Rated
                                </Badge>
                              )}
                              {company.isVerified && (
                                <Badge className="bg-purple-100 text-purple-700 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>

                            {/* Description */}
                            {company.description && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {company.description}
                              </p>
                            )}

                            {/* Job Count & Rating */}
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {company.jobCount || 0} jobs
                              </div>
                              {company.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  {company.rating} ({company.reviewCount})
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveCompany(company._id)}
                                className="bg-white/60 backdrop-blur-sm border-white/50">
                                {savedCompanies.includes(company._id) ? (
                                  <BookmarkCheck className="h-4 w-4" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleCompanyClick(company)}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                View Jobs
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // List View
                          <div className="flex items-start gap-4">
                            {/* Company Logo */}
                            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {company.logo ? (
                                <img
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Building2 className="h-8 w-8 text-gray-400" />
                              )}
                            </div>

                            {/* Company Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                    {company.name}
                                  </h3>
                                  <p className="text-gray-600 font-medium">
                                    {company.industry}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {company.isHiring && (
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                      Hiring Now
                                    </Badge>
                                  )}
                                  {company.isTopRated && (
                                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Top Rated
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Company Details */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {company.address?.city},{' '}
                                  {company.address?.province}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  {company.jobCount || 0} jobs available
                                </div>
                                {company.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    {company.rating} ({company.reviewCount}{' '}
                                    reviews)
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              {company.description && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                  {company.description}
                                </p>
                              )}

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveCompany(company._id)}
                                  className="bg-white/60 backdrop-blur-sm border-white/50">
                                  {savedCompanies.includes(company._id) ? (
                                    <>
                                      <BookmarkCheck className="h-4 w-4 mr-1" />
                                      Saved
                                    </>
                                  ) : (
                                    <>
                                      <Bookmark className="h-4 w-4 mr-1" />
                                      Save
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleCompanyClick(company)}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                  View Jobs
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {loadingMore ? (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                ) : (
                  <Button
                    variant="outline"
                    onClick={loadMoreCompanies}
                    className="bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90">
                    Load More Companies
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Details Modal */}
      <AnimatePresence>
        {showCompanyDetails && selectedCompany && (
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
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCompanyDetails}
                  className="absolute top-4 right-4 text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>

                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                    {selectedCompany.logo ? (
                      <img
                        src={selectedCompany.logo}
                        alt={selectedCompany.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">
                      {selectedCompany.name}
                    </h1>
                    <p className="text-blue-100 text-lg mb-3">
                      {selectedCompany.industry}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedCompany.address?.city},{' '}
                        {selectedCompany.address?.province}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {selectedCompany.jobCount || 0} jobs available
                      </div>
                      {selectedCompany.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {selectedCompany.rating} (
                          {selectedCompany.reviewCount} reviews)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveCompany(selectedCompany._id)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      {savedCompanies.includes(selectedCompany._id) ? (
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
                {/* Company Overview */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Company Overview
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedCompany.description ||
                        'No description available for this company.'}
                    </p>
                  </div>
                </div>

                {/* Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Company Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Industry:</span>
                        <span>
                          {selectedCompany.industry || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Size:</span>
                        <span>
                          {getCompanySize(selectedCompany.jobCount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Location:</span>
                        <span>
                          {selectedCompany.address?.city},{' '}
                          {selectedCompany.address?.province}
                        </span>
                      </div>
                      {selectedCompany.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Website:</span>
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Company Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Jobs Available
                        </span>
                        <Badge className="bg-green-100 text-green-700">
                          {selectedCompany.jobCount || 0}
                        </Badge>
                      </div>
                      {selectedCompany.rating && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {selectedCompany.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({selectedCompany.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <div className="flex gap-1">
                          {selectedCompany.isHiring && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Hiring Now
                            </Badge>
                          )}
                          {selectedCompany.isVerified && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={() => {
                      closeCompanyDetails();
                      router.push(`/jobs?company=${selectedCompany._id}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Briefcase className="h-5 w-5 mr-2" />
                    View All Jobs ({selectedCompany.jobCount || 0})
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleSaveCompany(selectedCompany._id)}
                    className="flex-1 bg-white/60 backdrop-blur-sm border-white/50">
                    {savedCompanies.includes(selectedCompany._id) ? (
                      <>
                        <BookmarkCheck className="h-5 w-5 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-5 w-5 mr-2" />
                        Save Company
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

