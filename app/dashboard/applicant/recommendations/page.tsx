'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Star,
  Search,
  Filter,
  MapPin,
  Building,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  Zap,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';
import Link from 'next/link';
import { jobAPI, authAPI } from '@/lib/api-service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface JobRecommendation {
  _id: string;
  title: string;
  companyId: {
    _id: string;
    name: string;
    logo?: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  location: string;
  employmentType: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  expiryDate: string;
  applicationCount: number;
  viewCount: number;
  isFeatured: boolean;
  isUrgent: boolean;
  matchScore: number;
  matchReasons: string[];
  skillsMatch: string[];
  experienceMatch: string[];
  educationMatch: string[];
  eligibilityMatch: string[];
  // New AI-powered fields
  algorithmicScore?: number;
  aiScore?: number;
}

interface RecommendationFilters {
  minMatchScore: number;
  location: string;
  employmentType: string;
  salaryRange: string;
  category: string;
}

export default function JobRecommendationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState<RecommendationFilters>({
    minMatchScore: 70,
    location: 'all',
    employmentType: 'all',
    salaryRange: 'all',
    category: 'all'
  });

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (!authAPI.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authAPI.getCurrentUser();
      if (currentUser && currentUser.role !== 'applicant') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive'
        });
        router.push('/dashboard');
        return;
      }
      setUser(currentUser);
    };

    checkAuth();
  }, [router, toast]);

  // Load job recommendations
  const loadRecommendations = async () => {
    try {
      setLoading(true);

      const params = {
        minMatchScore: filters.minMatchScore,
        location: filters.location !== 'all' ? filters.location : undefined,
        employmentType:
          filters.employmentType !== 'all' ? filters.employmentType : undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
        salaryRange:
          filters.salaryRange !== 'all' ? filters.salaryRange : undefined
      };

      const response = await jobAPI.getJobRecommendations(params);
      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);

      // Fallback to mock data if API fails
      const mockRecommendations: JobRecommendation[] = [
        {
          _id: '1',
          title: 'Senior Software Developer',
          companyId: {
            _id: 'comp1',
            name: 'TechCorp Philippines',
            logo: '/logos/techcorp.png'
          },
          categoryId: {
            _id: 'cat1',
            name: 'Information Technology'
          },
          location: 'Manila, Philippines',
          employmentType: 'Full-time',
          salary: {
            min: 80000,
            max: 120000,
            currency: 'PHP'
          },
          postedDate: '2024-01-15',
          expiryDate: '2024-02-15',
          applicationCount: 45,
          viewCount: 234,
          isFeatured: true,
          isUrgent: false,
          matchScore: 95,
          matchReasons: [
            'Strong match in React and Node.js experience',
            "Bachelor's degree in Computer Science matches requirement",
            '5+ years experience aligns with senior role'
          ],
          skillsMatch: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
          experienceMatch: ['5+ years software development'],
          educationMatch: ["Bachelor's in Computer Science"],
          eligibilityMatch: ['Professional License (Optional)']
        },
        {
          _id: '2',
          title: 'Data Analyst',
          companyId: {
            _id: 'comp2',
            name: 'Data Insights Inc',
            logo: '/logos/data-insights.png'
          },
          categoryId: {
            _id: 'cat2',
            name: 'Data Science'
          },
          location: 'Cebu, Philippines',
          employmentType: 'Full-time',
          salary: {
            min: 50000,
            max: 75000,
            currency: 'PHP'
          },
          postedDate: '2024-01-12',
          expiryDate: '2024-02-12',
          applicationCount: 23,
          viewCount: 156,
          isFeatured: false,
          isUrgent: true,
          matchScore: 88,
          matchReasons: [
            'Python and SQL skills match requirements',
            'Statistics background aligns with role',
            '2+ years data analysis experience'
          ],
          skillsMatch: ['Python', 'SQL', 'Excel', 'Tableau'],
          experienceMatch: ['2+ years data analysis'],
          educationMatch: ["Bachelor's in Statistics"],
          eligibilityMatch: []
        },
        {
          _id: '3',
          title: 'Marketing Specialist',
          companyId: {
            _id: 'comp3',
            name: 'Creative Agency Co',
            logo: '/logos/creative-agency.png'
          },
          categoryId: {
            _id: 'cat3',
            name: 'Marketing'
          },
          location: 'Makati, Philippines',
          employmentType: 'Full-time',
          salary: {
            min: 35000,
            max: 50000,
            currency: 'PHP'
          },
          postedDate: '2024-01-10',
          expiryDate: '2024-02-10',
          applicationCount: 67,
          viewCount: 189,
          isFeatured: false,
          isUrgent: false,
          matchScore: 82,
          matchReasons: [
            'Digital marketing experience matches requirements',
            'Communication skills align with role',
            "Bachelor's degree in Marketing"
          ],
          skillsMatch: [
            'Digital Marketing',
            'Social Media',
            'Content Creation'
          ],
          experienceMatch: ['1+ years marketing experience'],
          educationMatch: ["Bachelor's in Marketing"],
          eligibilityMatch: []
        }
      ];

      setRecommendations(mockRecommendations);

      toast({
        title: 'Using Demo Data',
        description: 'API not available, showing demo recommendations',
        variant: 'default'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, filters]);

  // Handle job application
  const handleApply = async (jobId: string) => {
    try {
      // Mock application - replace with actual API call
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully!',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive'
      });
    }
  };

  // Handle save job
  const handleSaveJob = async (jobId: string) => {
    try {
      await jobAPI.saveJob(jobId);
      toast({
        title: 'Job Saved',
        description: 'Job has been saved to your favorites',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: 'Error',
        description: 'Failed to save job',
        variant: 'destructive'
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format salary
  const formatSalary = (salary?: {
    min: number;
    max: number;
    currency: string;
  }) => {
    if (!salary) return 'Salary not specified';
    return `${
      salary.currency
    } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">
              Loading personalized job recommendations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Job Recommendations
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered personalized job suggestions based on your profile
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300"
              onClick={loadRecommendations}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              asChild>
              <Link href="/jobs" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse All Jobs
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container py-8 space-y-8">
          {/* Recommendation Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Recommendations
                </CardTitle>
                <Star className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {recommendations.length}
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  Personalized matches
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  High Match Jobs
                </CardTitle>
                <Target className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {recommendations.filter(job => job.matchScore >= 90).length}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  90%+ match score
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Featured Jobs
                </CardTitle>
                <Award className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {recommendations.filter(job => job.isFeatured).length}
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <Star className="h-3 w-3" />
                  Premium listings
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Urgent Jobs
                </CardTitle>
                <Zap className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {recommendations.filter(job => job.isUrgent).length}
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  Apply quickly
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                Filter Recommendations
              </CardTitle>
              <CardDescription>
                Refine your job recommendations based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center rounded-xl bg-white/40 backdrop-blur-sm p-4 border border-white/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Filters:
                  </span>
                </div>

                <Select
                  value={filters.minMatchScore.toString()}
                  onValueChange={value =>
                    setFilters({ ...filters, minMatchScore: parseInt(value) })
                  }>
                  <SelectTrigger className="w-[150px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                    <SelectValue placeholder="Match Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50%+ Match</SelectItem>
                    <SelectItem value="60">60%+ Match</SelectItem>
                    <SelectItem value="70">70%+ Match</SelectItem>
                    <SelectItem value="80">80%+ Match</SelectItem>
                    <SelectItem value="90">90%+ Match</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.location}
                  onValueChange={value =>
                    setFilters({ ...filters, location: value })
                  }>
                  <SelectTrigger className="w-[150px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="manila">Manila</SelectItem>
                    <SelectItem value="cebu">Cebu</SelectItem>
                    <SelectItem value="davao">Davao</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.employmentType}
                  onValueChange={value =>
                    setFilters({ ...filters, employmentType: value })
                  }>
                  <SelectTrigger className="w-[150px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                    <SelectValue placeholder="Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category}
                  onValueChange={value =>
                    setFilters({ ...filters, category: value })
                  }>
                  <SelectTrigger className="w-[180px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Job Recommendations */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Recommended Jobs
              </h2>
              <div className="text-sm text-gray-600">
                Showing {recommendations.length} personalized recommendations
              </div>
            </div>

            {recommendations.length === 0 ? (
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardContent className="text-center py-12">
                  <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Recommendations Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any job recommendations matching your
                    criteria. Try adjusting your filters or update your profile
                    for better matches.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
                      onClick={() =>
                        setFilters({
                          minMatchScore: 50,
                          location: 'all',
                          employmentType: 'all',
                          salaryRange: 'all',
                          category: 'all'
                        })
                      }>
                      Reset Filters
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      asChild>
                      <Link href="/dashboard/applicant/profile">
                        Update Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {recommendations.map(job => (
                  <Card
                    key={job._id}
                    className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-semibold text-gray-900">
                              {job.title}
                            </CardTitle>
                            <Badge
                              className={`text-xs font-semibold ${getMatchScoreColor(
                                job.matchScore
                              )}`}>
                              {job.matchScore}% Match
                            </Badge>
                            {job.aiScore && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                <Zap className="h-3 w-3 mr-1" />
                                AI: {job.aiScore}%
                              </Badge>
                            )}
                            {job.isFeatured && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {job.isUrgent && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {job.companyId.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.employmentType}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatSalary(job.salary)}
                            </span>
                          </div>
                          <CardDescription className="text-sm">
                            {job.categoryId.name} • Posted{' '}
                            {formatDate(job.postedDate)} • Expires{' '}
                            {formatDate(job.expiryDate)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
                            onClick={() => handleSaveJob(job._id)}>
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
                            asChild>
                            <Link href={`/jobs/${job._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Match Reasons */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          Why This Job Matches You
                        </h4>
                        <div className="space-y-2">
                          {job.matchReasons.map((reason, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills Match */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-600" />
                          Skills Match
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skillsMatch.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-purple-100 text-purple-700 border-purple-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Job Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/50">
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applicationCount} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.viewCount} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {Math.ceil(
                              (new Date(job.expiryDate).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{' '}
                            days left
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
                            asChild>
                            <Link href={`/jobs/${job._id}`}>
                              View Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                            onClick={() => handleApply(job._id)}>
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
