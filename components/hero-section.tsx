import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Building,
  Sparkles,
  TrendingUp,
  Users,
  Briefcase,
  ExternalLink,
  Star,
  Clock,
  ArrowRight,
  Filter,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { BannerDisplay } from '@/components/banner-display';
import { useState, useEffect } from 'react';
import { bannerDisplayAPI } from '@/lib/api/bannerDisplayAPI';
import { statsAPI } from '@/lib/api/statsAPI';

export type Category = {
  _id: string;
  name: string;
};

type Banner = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  status: string;
  priority: number;
  targetAudience: string;
  clicks: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
};

type HeroSectionProps = {
  categories: Category[];
};

export function HeroSection({ categories }: HeroSectionProps) {
  const [topBanners, setTopBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [heroStats, setHeroStats] = useState({
    activeJobs: 0,
    jobSeekers: 0,
    successRate: 0,
    totalApplications: 0,
    successfulApplications: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    jobTitle: '',
    location: '',
    category: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  useEffect(() => {
    checkForTopBanners();
    fetchHeroStats();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || topBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % topBanners.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, topBanners.length]);

  // Carousel control functions with smooth transitions
  const nextBanner = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex(prev => (prev + 1) % topBanners.length);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 50);
  };

  const prevBanner = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex(
        prev => (prev - 1 + topBanners.length) % topBanners.length
      );
      setTimeout(() => setIsTransitioning(false), 300);
    }, 50);
  };

  const goToBanner = (index: number) => {
    if (isTransitioning || index === currentBannerIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBannerIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 50);
  };

  const checkForTopBanners = async () => {
    try {
      const response = await bannerDisplayAPI.getActiveBanners('top');
      if (response.success && response.data && response.data.length > 0) {
        setTopBanners(response.data); // Get all banners
        setCurrentBannerIndex(0); // Start with first banner
      } else {
        setTopBanners([]);
      }
    } catch (error) {
      console.error('Error checking for top banners:', error);
      setTopBanners([]);
    } finally {
      setBannerLoading(false);
    }
  };

  const fetchHeroStats = async () => {
    try {
      console.log('Fetching hero stats...');
      const response = await statsAPI.getHeroStats();
      console.log('Hero stats response:', response);
      if (response.success) {
        setHeroStats(response.data);
        console.log('Hero stats set:', response.data);
      } else {
        console.error('Failed to fetch hero stats:', response);
      }
    } catch (error) {
      console.error('Error fetching hero stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleBannerClick = (banner: Banner) => {
    // Custom banner click handling if needed
    console.log('Banner clicked:', banner);
  };

  // Enhanced search functionality
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Build search URL with parameters
      const searchParams = new URLSearchParams();
      if (searchForm.jobTitle) searchParams.set('q', searchForm.jobTitle);
      if (searchForm.location)
        searchParams.set('location', searchForm.location);
      if (searchForm.category)
        searchParams.set('category', searchForm.category);
      if (quickFilters.length > 0)
        searchParams.set('filters', quickFilters.join(','));

      // Navigate to jobs page with search parameters
      window.location.href = `/jobs?${searchParams.toString()}`;
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section
      className={`relative overflow-hidden h-[600px] md:h-[700px] transition-all duration-500 ease-in-out ${
        topBanners.length > 0
          ? ''
          : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
      }`}
      style={
        topBanners.length > 0
          ? {
              backgroundImage: `url(${topBanners[currentBannerIndex]?.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'background-image 0.5s ease-in-out'
            }
          : {}
      }>
      {/* Background Elements */}
      {topBanners.length > 0 ? (
        /* Banner Background Overlay */
        <>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          {/* Floating blobs for banner */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </>
      ) : (
        /* Default Background Elements */
        <>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          {/* Floating blobs for default */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </>
      )}

      <div className="container relative px-4 md:px-6 h-full flex items-center">
        {/* Carousel Navigation - Left/Right Side Controls */}
        {topBanners.length > 1 && (
          <>
            {/* Left Navigation Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={prevBanner}
              disabled={isTransitioning}
              onMouseEnter={() => setIsAutoRotating(false)}
              onMouseLeave={() => setIsAutoRotating(true)}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 hover:border-white/50 shadow-lg transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'opacity-100 hover:scale-110'
              }`}>
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Right Navigation Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={nextBanner}
              disabled={isTransitioning}
              onMouseEnter={() => setIsAutoRotating(false)}
              onMouseLeave={() => setIsAutoRotating(true)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 hover:border-white/50 shadow-lg transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'opacity-100 hover:scale-110'
              }`}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center w-full">
          {/* Left Content - Banner or Default */}
          <div className="flex flex-col justify-center space-y-8 text-white">
            {!bannerLoading && topBanners.length > 0 ? (
              /* Banner Content */
              <div
                className={`space-y-6 transition-all duration-500 ease-in-out ${
                  isTransitioning
                    ? 'opacity-70 scale-95'
                    : 'opacity-100 scale-100'
                }`}>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  Featured Promotion
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl leading-tight">
                  {topBanners[currentBannerIndex]?.title}
                </h1>

                <p className="max-w-[600px] text-lg md:text-xl text-blue-100 leading-relaxed">
                  {topBanners[currentBannerIndex]?.description}
                </p>

                {/* Stats - also show in banner content */}
                <div className="grid grid-cols-3 gap-6 py-6">
                  <div className="text-center group">
                    <div className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                      {statsLoading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-16 rounded mx-auto"></div>
                      ) : (
                        `${heroStats.activeJobs.toLocaleString()}+`
                      )}
                    </div>
                    <div className="text-sm text-blue-200 group-hover:text-white transition-colors duration-300">
                      Active Jobs
                    </div>
                    <div className="text-xs text-blue-300/80 mt-1">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      +12% this month
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                      {statsLoading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-16 rounded mx-auto"></div>
                      ) : (
                        `${heroStats.jobSeekers.toLocaleString()}+`
                      )}
                    </div>
                    <div className="text-sm text-blue-200 group-hover:text-white transition-colors duration-300">
                      Job Seekers
                    </div>
                    <div className="text-xs text-blue-300/80 mt-1">
                      <Users className="inline h-3 w-3 mr-1" />
                      Growing community
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                      {statsLoading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-16 rounded mx-auto"></div>
                      ) : (
                        `${heroStats.successRate}%`
                      )}
                    </div>
                    <div className="text-sm text-blue-200 group-hover:text-white transition-colors duration-300">
                      Success Rate
                    </div>
                    <div className="text-xs text-blue-300/80 mt-1">
                      <Star className="inline h-3 w-3 mr-1" />
                      AI-powered matching
                    </div>
                  </div>
                </div>

                {topBanners[currentBannerIndex]?.linkUrl && (
                  <div className="flex flex-col gap-4 min-[400px]:flex-row">
                    <Button
                      size="lg"
                      onClick={() =>
                        handleBannerClick(topBanners[currentBannerIndex])
                      }
                      className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 hover:border-white/50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Learn More
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 hover:border-white/50 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      asChild>
                      <Link href="/jobs">
                        <Briefcase className="mr-2 h-5 w-5" />
                        Browse Jobs
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Carousel Indicators */}
                {topBanners.length > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    {topBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToBanner(index)}
                        disabled={isTransitioning}
                        onMouseEnter={() => setIsAutoRotating(false)}
                        onMouseLeave={() => setIsAutoRotating(true)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentBannerIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/70'
                        } ${
                          isTransitioning
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Default Content */
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  AI-Powered Job Matching
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl leading-tight">
                  Find Your Dream Job in{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Sto. Tomas
                  </span>
                </h1>

                <p className="max-w-[600px] text-lg md:text-xl text-blue-100 leading-relaxed">
                  InteliHire revolutionizes job hunting with AI-powered matching
                  that connects you with perfect opportunities tailored to your
                  skills, experience, and career aspirations.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 py-6">
                  <div className="text-center group">
                    <div className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                      {statsLoading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-16 rounded mx-auto"></div>
                      ) : (
                        `${heroStats.activeJobs.toLocaleString()}+`
                      )}
                    </div>
                    <div className="text-sm text-blue-200 group-hover:text-white transition-colors duration-300">
                      Active Jobs
                    </div>
                    <div className="text-xs text-blue-300/80 mt-1">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      +12% this month
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                      {statsLoading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-16 rounded mx-auto"></div>
                      ) : (
                        `${heroStats.jobSeekers.toLocaleString()}+`
                      )}
                    </div>
                    <div className="text-sm text-blue-200 group-hover:text-white transition-colors duration-300">
                      Job Seekers
                    </div>
                    <div className="text-xs text-blue-300/80 mt-1">
                      <Users className="inline h-3 w-3 mr-1" />
                      Growing community
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                      {statsLoading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-16 rounded mx-auto"></div>
                      ) : (
                        `${heroStats.successRate}%`
                      )}
                    </div>
                    <div className="text-sm text-blue-200 group-hover:text-white transition-colors duration-300">
                      Success Rate
                    </div>
                    <div className="text-xs text-blue-300/80 mt-1">
                      <Star className="inline h-3 w-3 mr-1" />
                      AI-powered matching
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 hover:border-white/50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    asChild>
                    <Link href="/jobs">
                      <Briefcase className="mr-2 h-5 w-5" />
                      Browse Jobs
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 hover:border-white/50 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                    For Employers
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Search Card */}
        </div>
      </div>
    </section>
  );
}
