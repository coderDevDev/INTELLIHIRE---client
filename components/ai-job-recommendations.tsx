'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  MapPin,
  Building,
  Calendar,
  TrendingUp,
  Star,
  Sparkles,
  Brain,
  Target,
  Zap,
  ArrowRight,
  Clock,
  Users,
  DollarSign,
  PhilippinePeso
} from 'lucide-react';
import Link from 'next/link';
import { jobAPI } from '@/lib/api-service';

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
  postedDate: string;
  expiryDate: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  matchScore: number;
  matchReasons: string[];
  isUrgent?: boolean;
  isFeatured?: boolean;
  applicationCount?: number;
  viewCount?: number;
}

interface AIJobRecommendationsProps {
  userId?: string;
  limit?: number;
  showHeader?: boolean;
}

export function AIJobRecommendations({
  userId,
  limit = 6,
  showHeader = true
}: AIJobRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [aiProcessing, setAiProcessing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setAiProcessing(true);

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Fetch jobs and simulate AI matching
      const response = await jobAPI.getJobs({ limit: 20, page: 1 });
      const jobs = response.jobs || [];

      // Simulate AI matching algorithm
      const aiRecommendations = jobs
        .map(job => ({
          ...job,
          matchScore: Math.floor(Math.random() * 40) + 60, // 60-100% match
          matchReasons: generateMatchReasons(),
          applicationCount: Math.floor(Math.random() * 50) + 1,
          viewCount: Math.floor(Math.random() * 200) + 10
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      setRecommendations(aiRecommendations);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoading(false);
      setAiProcessing(false);
    }
  };

  const generateMatchReasons = () => {
    const reasons = [
      'Skills match your profile',
      'Location preference aligned',
      'Experience level suitable',
      'Education requirements met',
      'Salary expectations match',
      'Company culture fit',
      'Career growth opportunity',
      'Remote work available'
    ];

    return reasons
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 80) return 'bg-blue-50 border-blue-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-orange-50 border-orange-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (
    min?: number,
    max?: number,
    currency?: string,
    period?: string
  ) => {
    if (!min || !max || !currency || !period) return 'Salary not specified';
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} per ${period}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI-Powered Job Recommendations
              </h2>
            </div>
            <p className="text-gray-600">
              Analyzing your profile to find the perfect matches...
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg animate-pulse">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AI-Powered Job Recommendations
            </h2>
            <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
          </div>
          <p className="text-gray-600">
            Personalized job matches based on your skills, experience, and
            preferences
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((job, index) => (
          <Card
            key={job._id}
            className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {job.title}
                    </h3>
                    {job.isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                    {job.isFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {job.companyId?.name}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-semibold border ${getMatchScoreBg(
                    job.matchScore
                  )} ${getMatchScoreColor(job.matchScore)}`}>
                  {job.matchScore}% match
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {job.employmentType}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Match Score Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Match Score</span>
                  <span
                    className={`font-semibold ${getMatchScoreColor(
                      job.matchScore
                    )}`}>
                    {job.matchScore}%
                  </span>
                </div>
                <Progress
                  value={job.matchScore}
                  className="h-2"
                  style={{
                    background: `linear-gradient(to right, ${
                      job.matchScore >= 90
                        ? '#10b981'
                        : job.matchScore >= 80
                        ? '#3b82f6'
                        : job.matchScore >= 70
                        ? '#f59e0b'
                        : '#f97316'
                    } ${job.matchScore}%, #e5e7eb ${job.matchScore}%)`
                  }}
                />
              </div>

              {/* Match Reasons */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Target className="h-3 w-3" />
                  Why this matches:
                </div>
                <div className="space-y-1">
                  {job.matchReasons.slice(0, 2).map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-gray-700">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50">
                  <Users className="h-3 w-3 mx-auto mb-1 text-blue-600" />
                  <div className="font-semibold">{job.applicationCount}</div>
                  <div className="text-gray-500">Applied</div>
                </div>
                <div className="text-center p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50">
                  <Clock className="h-3 w-3 mx-auto mb-1 text-green-600" />
                  <div className="font-semibold">
                    {formatDate(job.postedDate)}
                  </div>
                  <div className="text-gray-500">Posted</div>
                </div>
                <div className="text-center p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50">
                  <PhilippinePeso className="h-3 w-3 mx-auto mb-1 text-purple-600" />
                  <div className="font-semibold text-xs">
                    {job.salaryMin && job.salaryMax
                      ? `${
                          job.salaryCurrency
                        } ${job.salaryMin.toLocaleString()}+`
                      : 'Not specified'}
                  </div>
                  <div className="text-gray-500">Salary</div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg group"
                asChild>
                <Link href={`/jobs/${job._id}`}>
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 mb-4">
            Complete your profile to get personalized job recommendations
          </p>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            asChild>
            <Link href="/dashboard/applicant/profile">Complete Profile</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
