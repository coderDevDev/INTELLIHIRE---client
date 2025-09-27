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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Route,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Briefcase,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Lightbulb,
  BarChart,
  PieChart,
  Activity,
  Zap,
  GraduationCap,
  Building,
  User,
  Eye,
  Download,
  Share2,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { authAPI, careerPathAPI } from '@/lib/api-service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface CareerPath {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  estimatedDuration: number; // in months
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  prerequisites: string[];
  skills: string[];
  certifications: string[];
  averageSalary: {
    min: number;
    max: number;
    currency: string;
  };
  jobMarketDemand: 'Low' | 'Medium' | 'High' | 'Very High';
  growthPotential: number; // percentage
  relatedJobs: string[];
  milestones: CareerMilestone[];
  userProgress: number; // percentage completed
  isRecommended: boolean;
  matchScore: number;
  // New AI-powered fields
  algorithmicScore?: number;
  aiScore?: number;
  aiInsights?: {
    score: number;
    reasons: string[];
    skillGaps: string[];
    learningRecommendations: string[];
    careerProgression: string[];
    strengths: string[];
    concerns: string[];
    marketInsights: {
      demand: string;
      salaryRange: string;
      growthTrend: string;
      remoteOpportunities: string;
    };
  };
}

interface CareerMilestone {
  _id: string;
  title: string;
  description: string;
  type: 'skill' | 'certification' | 'experience' | 'education';
  priority: 'High' | 'Medium' | 'Low';
  estimatedTime: number; // in weeks
  resources: string[];
  isCompleted: boolean;
  completedAt?: string;
}

interface CareerGoal {
  _id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'Paused';
  progress: number;
  milestones: string[];
  createdAt: string;
  updatedAt: string;
}

interface CareerInsight {
  type: 'market_trend' | 'skill_gap' | 'salary_insight' | 'growth_opportunity';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  actionable: boolean;
  recommendation: string;
}

export default function CareerPathPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [userGoals, setUserGoals] = useState<CareerGoal[]>([]);
  const [insights, setInsights] = useState<CareerInsight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

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

  // Load career path data
  const loadCareerData = async () => {
    try {
      setLoading(true);

      // Load career paths, goals, and insights
      const [pathsResponse, goalsResponse, insightsResponse] =
        await Promise.all([
          careerPathAPI.getCareerPaths({
            category: selectedCategory,
            level: selectedLevel
          }),
          careerPathAPI.getUserGoals(),
          careerPathAPI.getCareerInsights()
        ]);

      setCareerPaths(pathsResponse.careerPaths || []);
      setUserGoals(goalsResponse.goals || []);
      setInsights(insightsResponse.insights || []);
    } catch (error) {
      console.error('Error loading career data:', error);

      // Fallback to mock data
      const mockCareerPaths: CareerPath[] = [
        {
          _id: '1',
          title: 'Software Developer',
          description:
            'Build and maintain software applications using various programming languages and frameworks.',
          category: 'Information Technology',
          level: 'Entry',
          estimatedDuration: 12,
          difficulty: 'Medium',
          prerequisites: [
            'Basic programming knowledge',
            'Problem-solving skills'
          ],
          skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git'],
          certifications: [
            'AWS Certified Developer',
            'Google Cloud Professional'
          ],
          averageSalary: { min: 40000, max: 80000, currency: 'PHP' },
          jobMarketDemand: 'Very High',
          growthPotential: 25,
          relatedJobs: [
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer'
          ],
          milestones: [
            {
              _id: 'm1',
              title: 'Learn Programming Fundamentals',
              description: 'Master basic programming concepts and syntax',
              type: 'skill',
              priority: 'High',
              estimatedTime: 8,
              resources: ['Online courses', 'Coding bootcamp'],
              isCompleted: false
            },
            {
              _id: 'm2',
              title: 'Build First Project',
              description: 'Create a complete web application',
              type: 'experience',
              priority: 'High',
              estimatedTime: 4,
              resources: ['Portfolio project', 'GitHub'],
              isCompleted: false
            }
          ],
          userProgress: 0,
          isRecommended: true,
          matchScore: 95
        },
        {
          _id: '2',
          title: 'Data Analyst',
          description:
            'Analyze data to help organizations make informed business decisions.',
          category: 'Data Science',
          level: 'Entry',
          estimatedDuration: 10,
          difficulty: 'Medium',
          prerequisites: ['Statistics knowledge', 'Analytical thinking'],
          skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics'],
          certifications: [
            'Google Data Analytics Certificate',
            'Microsoft Power BI'
          ],
          averageSalary: { min: 35000, max: 65000, currency: 'PHP' },
          jobMarketDemand: 'High',
          growthPotential: 20,
          relatedJobs: [
            'Business Analyst',
            'Data Scientist',
            'Research Analyst'
          ],
          milestones: [
            {
              _id: 'm3',
              title: 'Learn SQL and Database Management',
              description: 'Master database querying and management',
              type: 'skill',
              priority: 'High',
              estimatedTime: 6,
              resources: ['SQL courses', 'Database tutorials'],
              isCompleted: false
            },
            {
              _id: 'm4',
              title: 'Complete Data Analysis Project',
              description: 'Analyze real-world dataset and present findings',
              type: 'experience',
              priority: 'High',
              estimatedTime: 4,
              resources: ['Kaggle datasets', 'Portfolio'],
              isCompleted: false
            }
          ],
          userProgress: 0,
          isRecommended: true,
          matchScore: 88
        },
        {
          _id: '3',
          title: 'Digital Marketing Specialist',
          description:
            'Develop and implement digital marketing strategies to promote products and services.',
          category: 'Marketing',
          level: 'Entry',
          estimatedDuration: 8,
          difficulty: 'Easy',
          prerequisites: ['Communication skills', 'Creative thinking'],
          skills: [
            'Social Media Marketing',
            'SEO',
            'Google Ads',
            'Content Creation'
          ],
          certifications: ['Google Ads Certification', 'Facebook Blueprint'],
          averageSalary: { min: 25000, max: 50000, currency: 'PHP' },
          jobMarketDemand: 'High',
          growthPotential: 15,
          relatedJobs: [
            'Content Marketing Manager',
            'SEO Specialist',
            'Social Media Manager'
          ],
          milestones: [
            {
              _id: 'm5',
              title: 'Learn Digital Marketing Fundamentals',
              description: 'Understand core digital marketing concepts',
              type: 'skill',
              priority: 'High',
              estimatedTime: 4,
              resources: ['Digital marketing courses', 'Industry blogs'],
              isCompleted: false
            },
            {
              _id: 'm6',
              title: 'Run First Marketing Campaign',
              description: 'Create and execute a digital marketing campaign',
              type: 'experience',
              priority: 'High',
              estimatedTime: 6,
              resources: ['Campaign tools', 'Analytics platforms'],
              isCompleted: false
            }
          ],
          userProgress: 0,
          isRecommended: false,
          matchScore: 72
        }
      ];

      const mockGoals: CareerGoal[] = [
        {
          _id: 'g1',
          title: 'Become a Senior Software Developer',
          description: 'Advance to senior level within 2 years',
          targetDate: '2026-01-15',
          status: 'Planning',
          progress: 15,
          milestones: [
            'Complete advanced courses',
            'Lead a project',
            'Mentor junior developers'
          ],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          _id: 'g2',
          title: 'Learn Data Science',
          description: 'Transition to data science role',
          targetDate: '2025-06-30',
          status: 'In Progress',
          progress: 40,
          milestones: [
            'Complete Python course',
            'Build ML models',
            'Get certification'
          ],
          createdAt: '2024-01-10',
          updatedAt: '2024-01-20'
        }
      ];

      const mockInsights: CareerInsight[] = [
        {
          type: 'market_trend',
          title: 'AI Skills in High Demand',
          description:
            'Companies are increasingly looking for professionals with AI and machine learning skills.',
          impact: 'High',
          actionable: true,
          recommendation:
            'Consider learning Python, TensorFlow, or PyTorch to stay competitive.'
        },
        {
          type: 'skill_gap',
          title: 'Cloud Computing Skills Gap',
          description:
            'Your profile shows strong programming skills but limited cloud experience.',
          impact: 'Medium',
          actionable: true,
          recommendation:
            'Learn AWS, Azure, or Google Cloud to expand your opportunities.'
        },
        {
          type: 'salary_insight',
          title: 'Software Developer Salary Growth',
          description:
            'Software developer salaries have increased by 15% in the past year.',
          impact: 'High',
          actionable: false,
          recommendation:
            'Market conditions are favorable for software developers.'
        }
      ];

      setCareerPaths(mockCareerPaths);
      setUserGoals(mockGoals);
      setInsights(mockInsights);

      toast({
        title: 'Using Demo Data',
        description: 'API not available, showing demo career path data',
        variant: 'default'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCareerData();
    }
  }, [user, selectedCategory, selectedLevel]);

  // Handle starting a career path
  const handleStartCareerPath = async (careerPathId: string) => {
    try {
      await careerPathAPI.startCareerPath(careerPathId);
      toast({
        title: 'Career Path Started',
        description: 'You have successfully started this career path!',
        variant: 'default'
      });
      loadCareerData(); // Reload data to show updated progress
    } catch (error) {
      console.error('Error starting career path:', error);
      toast({
        title: 'Error',
        description: 'Failed to start career path',
        variant: 'destructive'
      });
    }
  };

  // Handle completing a milestone
  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await careerPathAPI.completeMilestone(milestoneId);
      toast({
        title: 'Milestone Completed',
        description: 'Great job! You have completed this milestone.',
        variant: 'default'
      });
      loadCareerData();
    } catch (error) {
      console.error('Error completing milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete milestone',
        variant: 'destructive'
      });
    }
  };

  // Format salary
  const formatSalary = (salary: {
    min: number;
    max: number;
    currency: string;
  }) => {
    return `${
      salary.currency
    } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-blue-600 bg-blue-100';
      case 'Hard':
        return 'text-orange-600 bg-orange-100';
      case 'Expert':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get demand color
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Low':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'High':
        return 'text-blue-600 bg-blue-100';
      case 'Very High':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get insight type icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'market_trend':
        return <TrendingUp className="h-5 w-5" />;
      case 'skill_gap':
        return <Target className="h-5 w-5" />;
      case 'salary_insight':
        return <DollarSign className="h-5 w-5" />;
      case 'growth_opportunity':
        return <Zap className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">
              Loading your career path insights...
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
              <Route className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Career Path
              </h1>
              <p className="text-sm text-gray-600">
                Discover and plan your professional journey
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300"
              onClick={loadCareerData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              onClick={() => setActiveTab('goals')}>
              <Plus className="h-4 w-4 mr-2" />
              Set Goal
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container py-8 space-y-8">
          {/* Career Overview Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Active Career Paths
                </CardTitle>
                <Route className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {careerPaths.filter(path => path.userProgress > 0).length}
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  In progress
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Career Goals
                </CardTitle>
                <Target className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {userGoals.length}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  {
                    userGoals.filter(goal => goal.status === 'Completed').length
                  }{' '}
                  completed
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Completed Milestones
                </CardTitle>
                <Award className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {careerPaths.reduce(
                    (total, path) =>
                      total + path.milestones.filter(m => m.isCompleted).length,
                    0
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <Star className="h-3 w-3" />
                  Achievements
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Market Insights
                </CardTitle>
                <BarChart className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {insights.length}
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <Lightbulb className="h-3 w-3" />
                  Actionable insights
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white/80">
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="paths"
                className="data-[state=active]:bg-white/80">
                Career Paths
              </TabsTrigger>
              {/* <TabsTrigger
                value="goals"
                className="data-[state=active]:bg-white/80">
                My Goals
              </TabsTrigger> */}
              {/* <TabsTrigger
                value="insights"
                className="data-[state=active]:bg-white/80">
                Insights
              </TabsTrigger> */}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid ">
                {/* Recommended Career Paths */}
                <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Recommended for You
                    </CardTitle>
                    <CardDescription>
                      Career paths that match your profile and goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {careerPaths
                      .filter(path => path.isRecommended)
                      .slice(0, 3)
                      .map(path => (
                        <div
                          key={path._id}
                          className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {path.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {path.category}
                              </p>
                            </div>
                            <Badge
                              className={`text-xs ${getDifficultyColor(
                                path.difficulty
                              )}`}>
                              {path.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {path.estimatedDuration} months
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatSalary(path.averageSalary)}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {path.growthPotential}% growth
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge
                              className={`text-xs ${getDemandColor(
                                path.jobMarketDemand
                              )}`}>
                              {path.jobMarketDemand} Demand
                            </Badge>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              onClick={() => handleStartCareerPath(path._id)}>
                              Start Path
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Career Goals Progress */}
                {/* <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Goal Progress
                    </CardTitle>
                    <CardDescription>
                      Track your career goal achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userGoals.slice(0, 3).map(goal => (
                      <div
                        key={goal._id}
                        className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {goal.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Target:{' '}
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              goal.status === 'Completed'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs">
                            {goal.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">
                              {goal.progress}%
                            </span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card> */}
              </div>

              {/* Recent Insights */}
              {/* <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                    Recent Insights
                  </CardTitle>
                  <CardDescription>
                    Personalized career insights and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {insights.slice(0, 4).map((insight, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              insight.impact === 'High'
                                ? 'bg-red-100 text-red-600'
                                : insight.impact === 'Medium'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-green-100 text-green-600'
                            }`}>
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {insight.description}
                            </p>
                            {insight.actionable && (
                              <div className="text-xs text-blue-600 font-medium">
                                💡 {insight.recommendation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </TabsContent>

            {/* Career Paths Tab */}
            <TabsContent value="paths" className="space-y-6">
              {/* Filters */}
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Filter Career Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-center rounded-xl bg-white/40 backdrop-blur-sm p-4 border border-white/50 shadow-sm">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[200px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Information Technology">
                          IT
                        </SelectItem>
                        <SelectItem value="Data Science">
                          Data Science
                        </SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedLevel}
                      onValueChange={setSelectedLevel}>
                      <SelectTrigger className="w-[150px] bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Entry">Entry</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Career Paths Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {careerPaths.map(path => (
                  <Card
                    key={path._id}
                    className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {path.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {path.category} • {path.level} Level
                          </CardDescription>
                        </div>
                        {path.isRecommended && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {path.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Match Score */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs font-semibold ${
                              path.matchScore >= 80
                                ? 'text-green-600 bg-green-100'
                                : path.matchScore >= 60
                                ? 'text-blue-600 bg-blue-100'
                                : path.matchScore >= 40
                                ? 'text-yellow-600 bg-yellow-100'
                                : 'text-red-600 bg-red-100'
                            }`}>
                            {path.matchScore}% Match
                          </Badge>
                          {path.aiScore && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              <Zap className="h-3 w-3 mr-1" />
                              AI: {path.aiScore}%
                            </Badge>
                          )}
                        </div>
                        {path.isRecommended && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>

                      {/* AI Insights Preview */}
                      {path.aiInsights && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                              AI Insights
                            </span>
                          </div>
                          <div className="space-y-1">
                            {path.aiInsights.reasons
                              .slice(0, 2)
                              .map((reason, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 text-xs text-gray-600">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            {path.aiInsights.skillGaps.length > 0 && (
                              <div className="text-xs text-orange-600">
                                <AlertCircle className="h-3 w-3 inline mr-1" />
                                {path.aiInsights.skillGaps.length} skill gaps
                                identified
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {path.estimatedDuration} months
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {formatSalary(path.averageSalary)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {path.growthPotential}% growth
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {path.jobMarketDemand} demand
                          </span>
                        </div>
                      </div>

                      {/* Difficulty and Skills */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Difficulty:
                          </span>
                          <Badge
                            className={`text-xs ${getDifficultyColor(
                              path.difficulty
                            )}`}>
                            {path.difficulty}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Key Skills:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {path.skills.slice(0, 3).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {path.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{path.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {path.userProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Your Progress</span>
                            <span className="font-medium text-gray-900">
                              {path.userProgress}%
                            </span>
                          </div>
                          <Progress value={path.userProgress} className="h-2" />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
                          asChild>
                          <Link
                            href={`/dashboard/applicant/career-path/${path._id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          onClick={() => handleStartCareerPath(path._id)}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          {path.userProgress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Career Goals
                </h2>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  onClick={() => {
                    /* Add goal creation modal */
                  }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {userGoals.map(goal => (
                  <Card
                    key={goal._id}
                    className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {goal.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            Target:{' '}
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            goal.status === 'Completed'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-xs">
                          {goal.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">
                        {goal.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">
                            {goal.progress}%
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Milestones:
                        </span>
                        <ul className="mt-1 space-y-1">
                          {goal.milestones
                            .slice(0, 3)
                            .map((milestone, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {milestone}
                              </li>
                            ))}
                          {goal.milestones.length > 3 && (
                            <li className="text-xs text-gray-500">
                              +{goal.milestones.length - 3} more milestones
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Career Insights
                </h2>
                <Button
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80"
                  onClick={loadCareerData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Insights
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            insight.impact === 'High'
                              ? 'bg-red-100 text-red-600'
                              : insight.impact === 'Medium'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {insight.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {insight.type.replace('_', ' ').toUpperCase()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">
                        {insight.description}
                      </p>

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

                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            insight.impact === 'High'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-xs">
                          {insight.impact} Impact
                        </Badge>
                        {insight.actionable && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
