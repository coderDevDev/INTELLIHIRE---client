'use client';

import React, { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Target,
  Brain,
  BarChart,
  PieChart,
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Award,
  Users,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Search,
  ArrowRight,
  ChevronRight,
  Info,
  Lightbulb,
  Shield,
  BookOpen,
  GraduationCap,
  Building,
  User,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Network,
  Upload,
  Video,
  FileSpreadsheet,
  Mail,
  Image
} from 'lucide-react';
import Link from 'next/link';
import {
  authAPI,
  userAPI,
  applicationAPI,
  jobAPI,
  documentAPI
} from '@/lib/api-service';
import { toast } from 'sonner';

interface SuccessPrediction {
  _id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salaryRange: { min: number; max: number; currency: string };
  employmentType: string;
  successScore: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  factors: {
    education: { score: number; weight: number; details: string };
    experience: { score: number; weight: number; details: string };
    skills: { score: number; weight: number; details: string };
    location: { score: number; weight: number; details: string };
    profileCompleteness: { score: number; weight: number; details: string };
    marketDemand: { score: number; weight: number; details: string };
  };
  recommendations: string[];
  riskFactors: string[];
  applicationTips: string[];
  similarProfiles: {
    successRate: number;
    avgSalary: number;
    commonSkills: string[];
  };
  createdAt: string;
}

interface PredictionInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation: string;
}

export default function SuccessPredictionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<SuccessPrediction[]>([]);
  const [insights, setInsights] = useState<PredictionInsight[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    minScore: '70',
    confidence: 'all',
    category: 'all',
    location: 'all'
  });

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      toast.error('Please log in to view success predictions.');
      return;
    }
    setUser(currentUser);
    loadPredictionData();
  }, [router]);

  const loadPredictionData = async () => {
    setLoading(true);
    try {
      // Load success predictions and insights
      const [predictionsResponse, insightsResponse] = await Promise.all([
        getSuccessPredictions(),
        getPredictionInsights()
      ]);

      setPredictions(predictionsResponse);
      setInsights(insightsResponse);
    } catch (error) {
      console.error('Error loading prediction data:', error);

      // Fallback to mock data
      const mockPredictions: SuccessPrediction[] = [
        {
          _id: 'pred1',
          jobId: 'job1',
          jobTitle: 'Senior Software Developer',
          companyName: 'TechCorp Philippines',
          companyLogo: '/logos/techcorp.png',
          location: 'Manila, Philippines',
          salaryRange: { min: 80000, max: 120000, currency: 'PHP' },
          employmentType: 'Full-time',
          successScore: 87,
          confidenceLevel: 'high',
          factors: {
            education: {
              score: 95,
              weight: 20,
              details: "Bachelor's in Computer Science matches requirement"
            },
            experience: {
              score: 85,
              weight: 25,
              details: '5+ years experience aligns with senior role'
            },
            skills: {
              score: 90,
              weight: 25,
              details: 'Strong match in React, Node.js, TypeScript'
            },
            location: {
              score: 100,
              weight: 10,
              details: 'Same city as job location'
            },
            profileCompleteness: {
              score: 80,
              weight: 10,
              details: 'Profile is 80% complete'
            },
            marketDemand: {
              score: 75,
              weight: 10,
              details: 'High demand for senior developers'
            }
          },
          recommendations: [
            'Highlight your React and Node.js projects in your portfolio',
            'Emphasize your leadership experience in previous roles',
            "Prepare specific examples of complex problems you've solved"
          ],
          riskFactors: [
            'Limited experience with cloud platforms (AWS/Azure)',
            'No formal certifications in relevant technologies'
          ],
          applicationTips: [
            'Customize your cover letter to mention specific company projects',
            'Prepare a technical presentation showcasing your skills',
            "Research the company's tech stack and mention relevant experience"
          ],
          similarProfiles: {
            successRate: 78,
            avgSalary: 95000,
            commonSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Git']
          },
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: 'pred2',
          jobId: 'job2',
          jobTitle: 'Data Analyst',
          companyName: 'Data Insights Inc',
          companyLogo: '/logos/data-insights.png',
          location: 'Cebu, Philippines',
          salaryRange: { min: 50000, max: 75000, currency: 'PHP' },
          employmentType: 'Full-time',
          successScore: 72,
          confidenceLevel: 'medium',
          factors: {
            education: {
              score: 88,
              weight: 20,
              details: 'Statistics background aligns with role'
            },
            experience: {
              score: 70,
              weight: 25,
              details: '2+ years data analysis experience'
            },
            skills: {
              score: 75,
              weight: 25,
              details: 'Good Python and SQL skills'
            },
            location: {
              score: 60,
              weight: 10,
              details: 'Different city but willing to relocate'
            },
            profileCompleteness: {
              score: 85,
              weight: 10,
              details: 'Profile is 85% complete'
            },
            marketDemand: {
              score: 80,
              weight: 10,
              details: 'Growing demand for data analysts'
            }
          },
          recommendations: [
            'Complete a data visualization course (Tableau/Power BI)',
            'Build a portfolio with real data analysis projects',
            'Consider getting certified in Python for data science'
          ],
          riskFactors: [
            'Limited experience with advanced statistical methods',
            'No experience with machine learning frameworks'
          ],
          applicationTips: [
            'Create a data visualization showcasing your analytical skills',
            "Prepare examples of insights you've derived from data",
            'Show enthusiasm for learning new analytical tools'
          ],
          similarProfiles: {
            successRate: 65,
            avgSalary: 62500,
            commonSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics']
          },
          createdAt: '2024-01-12T14:20:00Z'
        },
        {
          _id: 'pred3',
          jobId: 'job3',
          jobTitle: 'Marketing Specialist',
          companyName: 'Creative Agency Co',
          companyLogo: '/logos/creative-agency.png',
          location: 'Makati, Philippines',
          salaryRange: { min: 35000, max: 50000, currency: 'PHP' },
          employmentType: 'Full-time',
          successScore: 65,
          confidenceLevel: 'medium',
          factors: {
            education: {
              score: 85,
              weight: 20,
              details: 'Marketing degree matches requirement'
            },
            experience: {
              score: 60,
              weight: 25,
              details: '1+ years marketing experience'
            },
            skills: {
              score: 70,
              weight: 25,
              details: 'Good digital marketing skills'
            },
            location: {
              score: 100,
              weight: 10,
              details: 'Same city as job location'
            },
            profileCompleteness: {
              score: 75,
              weight: 10,
              details: 'Profile is 75% complete'
            },
            marketDemand: {
              score: 70,
              weight: 10,
              details: 'Moderate demand for marketing roles'
            }
          },
          recommendations: [
            'Gain experience with social media advertising platforms',
            'Learn about marketing automation tools',
            'Build a portfolio showcasing successful campaigns'
          ],
          riskFactors: [
            'Limited experience with paid advertising',
            'No formal training in marketing analytics'
          ],
          applicationTips: [
            'Prepare case studies of successful marketing campaigns',
            'Show creativity in your application materials',
            'Demonstrate understanding of target audience analysis'
          ],
          similarProfiles: {
            successRate: 58,
            avgSalary: 42500,
            commonSkills: [
              'Digital Marketing',
              'Social Media',
              'Content Creation',
              'Analytics'
            ]
          },
          createdAt: '2024-01-10T09:15:00Z'
        }
      ];

      const mockInsights: PredictionInsight[] = [
        {
          type: 'strength',
          title: 'Strong Technical Foundation',
          description:
            'Your technical skills in React, Node.js, and TypeScript are highly valued in the current job market.',
          impact: 'high',
          actionable: true,
          recommendation:
            'Continue building projects and contributing to open source to strengthen your portfolio.'
        },
        {
          type: 'opportunity',
          title: 'Cloud Computing Skills Gap',
          description:
            'Many high-paying positions require cloud platform experience (AWS, Azure, GCP).',
          impact: 'high',
          actionable: true,
          recommendation:
            'Consider taking cloud certification courses to increase your marketability.'
        },
        {
          type: 'weakness',
          title: 'Limited Leadership Experience',
          description:
            'Senior roles often require demonstrated leadership and mentoring experience.',
          impact: 'medium',
          actionable: true,
          recommendation:
            'Volunteer to lead small projects or mentor junior developers to build leadership skills.'
        },
        {
          type: 'threat',
          title: 'Competitive Market',
          description:
            'The software development market is highly competitive with many qualified candidates.',
          impact: 'medium',
          actionable: true,
          recommendation:
            'Focus on niche skills or emerging technologies to differentiate yourself.'
        }
      ];

      setPredictions(mockPredictions);
      setInsights(mockInsights);

      toast({
        title: 'Using Demo Data',
        description: 'API not available, showing demo success predictions',
        variant: 'default'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSuccessPredictions = async () => {
    // This would call the actual API endpoint
    // For now, return empty array to trigger mock data
    throw new Error('API not implemented yet');
  };

  const getPredictionInsights = async () => {
    // This would call the actual API endpoint
    // For now, return empty array to trigger mock data
    throw new Error('API not implemented yet');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'weakness':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'opportunity':
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
      case 'threat':
        return <Shield className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-green-50 border-green-200';
      case 'weakness':
        return 'bg-red-50 border-red-200';
      case 'opportunity':
        return 'bg-blue-50 border-blue-200';
      case 'threat':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatSalary = (salary: {
    min: number;
    max: number;
    currency: string;
  }) => {
    return `${
      salary.currency
    } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping-slow"></div>
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-blue-600">
                <Brain className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Analyzing Your Success Potential...
            </h2>
            <p className="text-blue-700 text-opacity-80">
              Loading personalized success predictions and insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-xl shadow-lg backdrop-blur-xl border border-white/50 animate-fade-in overflow-y-auto">
      <div className="relative mb-6">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 mb-2 relative z-10 animate-fade-in-down">
          Success Prediction
        </h1>
        <p className="text-lg text-gray-700 relative z-10 animate-fade-in-up">
          AI-powered insights to maximize your job application success.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-grow flex flex-col relative z-10">
        <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-md border border-white/50 rounded-lg shadow-sm mb-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm transition-all duration-300">
            <BarChart className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="predictions"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm transition-all duration-300">
            <Target className="h-4 w-4 mr-2" /> Predictions
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm transition-all duration-300">
            <Brain className="h-4 w-4 mr-2" /> Insights
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm transition-all duration-300">
            <Lightbulb className="h-4 w-4 mr-2" /> Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="flex-grow flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            <Card className="glass-card p-4 flex flex-col items-center text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-3xl font-bold text-green-800">
                {Math.round(
                  predictions.reduce((acc, p) => acc + p.successScore, 0) /
                    predictions.length
                ) || 0}
                %
              </CardTitle>
              <CardDescription className="text-gray-600">
                Average Success Score
              </CardDescription>
            </Card>
            <Card className="glass-card p-4 flex flex-col items-center text-center">
              <Target className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-3xl font-bold text-blue-800">
                {predictions.length}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Job Predictions
              </CardDescription>
            </Card>
            <Card className="glass-card p-4 flex flex-col items-center text-center">
              <Star className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-3xl font-bold text-purple-800">
                {predictions.filter(p => p.confidenceLevel === 'high').length}
              </CardTitle>
              <CardDescription className="text-gray-600">
                High Confidence
              </CardDescription>
            </Card>
            <Card className="glass-card p-4 flex flex-col items-center text-center">
              <Award className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle className="text-3xl font-bold text-orange-800">
                {insights.filter(i => i.actionable).length}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Actionable Insights
              </CardDescription>
            </Card>
          </div>

          <Card className="glass-card p-6 flex-grow animate-fade-in-up delay-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-800">
                Success Prediction Summary
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your overall job application success potential.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Top Strengths
                  </h3>
                  <div className="space-y-2">
                    {insights
                      .filter(i => i.type === 'strength')
                      .slice(0, 3)
                      .map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {insights
                      .filter(i => i.type === 'weakness')
                      .slice(0, 3)
                      .map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="gradient-button">
                    <Link href="/dashboard/applicant/recommendations">
                      View Job Recommendations{' '}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="glass-button-secondary">
                    <Link href="/dashboard/applicant/profile">
                      Complete Profile <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="predictions"
          className="flex-grow flex flex-col space-y-6">
          <div className="flex flex-wrap gap-4 mb-4 animate-fade-in-up">
            <Select
              value={filters.minScore}
              onValueChange={value =>
                setFilters(prev => ({ ...prev, minScore: value }))
              }>
              <SelectTrigger className="w-[180px] glass-input">
                <SelectValue placeholder="Min Score" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="50">50%+</SelectItem>
                <SelectItem value="60">60%+</SelectItem>
                <SelectItem value="70">70%+</SelectItem>
                <SelectItem value="80">80%+</SelectItem>
                <SelectItem value="90">90%+</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.confidence}
              onValueChange={value =>
                setFilters(prev => ({ ...prev, confidence: value }))
              }>
              <SelectTrigger className="w-[180px] glass-input">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow animate-fade-in-up delay-100">
            {predictions
              .filter(p => p.successScore >= parseInt(filters.minScore))
              .filter(
                p =>
                  filters.confidence === 'all' ||
                  p.confidenceLevel === filters.confidence
              )
              .map(prediction => (
                <Card
                  key={prediction._id}
                  className="glass-card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {prediction.companyLogo ? (
                          <img
                            src={prediction.companyLogo}
                            alt={prediction.companyName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-blue-800">
                          {prediction.jobTitle}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {prediction.companyName}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`text-sm font-semibold px-3 py-1 rounded-full border ${getScoreColor(
                          prediction.successScore
                        )}`}>
                        {prediction.successScore}% Success
                      </Badge>
                      <Badge
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getConfidenceColor(
                          prediction.confidenceLevel
                        )}`}>
                        {prediction.confidenceLevel} confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-0 space-y-4 text-gray-700">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {prediction.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        {formatSalary(prediction.salaryRange)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {prediction.employmentType}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Success Factors:
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(prediction.factors).map(
                          ([key, factor]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between">
                              <span className="text-sm capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={factor.score}
                                  className="w-20 h-2"
                                />
                                <span className="text-sm font-medium w-8">
                                  {factor.score}%
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Top Recommendations:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {prediction.recommendations
                          .slice(0, 2)
                          .map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 p-0 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-button-secondary">
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </Button>
                    <Button size="sm" className="gradient-button">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent
          value="insights"
          className="flex-grow flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 animate-fade-in-up">
            Personalized Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow animate-fade-in-up delay-100">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className={`glass-card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300 ${getInsightColor(
                  insight.type
                )}`}>
                <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getInsightColor(
                        insight.type
                      )}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {insight.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 capitalize">
                        {insight.type}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      insight.impact === 'high'
                        ? 'bg-red-500/20 text-red-600 border-red-500'
                        : insight.impact === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500'
                        : 'bg-blue-500/20 text-blue-600 border-blue-500'
                    }`}>
                    {insight.impact} impact
                  </Badge>
                </CardHeader>
                <CardContent className="flex-grow p-0 space-y-3 text-gray-700">
                  <p className="text-sm">{insight.description}</p>

                  {insight.actionable && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-blue-900">
                            Recommendation:
                          </span>
                          <p className="text-sm text-blue-700 mt-1">
                            {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="recommendations"
          className="flex-grow flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 animate-fade-in-up">
            Success Tips & Recommendations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow animate-fade-in-up delay-100">
            {predictions.map(prediction => (
              <Card
                key={prediction._id}
                className="glass-card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold text-blue-800">
                    {prediction.jobTitle}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {prediction.companyName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-0 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Application Tips:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {prediction.applicationTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ChevronRight className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Risk Factors to Address:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {prediction.riskFactors.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Similar Profiles:
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>
                        Success Rate:{' '}
                        <span className="font-medium">
                          {prediction.similarProfiles.successRate}%
                        </span>
                      </p>
                      <p>
                        Average Salary:{' '}
                        <span className="font-medium">
                          {formatSalary({
                            min: prediction.similarProfiles.avgSalary,
                            max: prediction.similarProfiles.avgSalary,
                            currency: 'PHP'
                          })}
                        </span>
                      </p>
                      <p>
                        Common Skills:{' '}
                        <span className="font-medium">
                          {prediction.similarProfiles.commonSkills.join(', ')}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
