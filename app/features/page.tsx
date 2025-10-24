'use client';

import Link from 'next/link';
import {
  Bot,
  Target,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  BarChart4,
  FileText,
  Upload,
  CheckCircle,
  Users,
  Building,
  Calendar,
  Mail,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Brain,
  GitBranch,
  LineChart,
  ChevronRight,
  Home
} from 'lucide-react';

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Bot,
      title: 'AI-Powered Document Intelligence',
      gradient: 'from-blue-500 to-blue-600',
      description:
        'Advanced artificial intelligence extracts and processes data from government forms and resumes with unprecedented accuracy.',
      details: [
        {
          title: 'PDS Parsing',
          items: [
            'Automatic extraction from CS Form No. 212 (Personal Data Sheet)',
            'Google Gemini AI & OpenAI integration for intelligent parsing',
            'OCR support for scanned documents using Tesseract.js',
            'Extracts: Personal Info, Education, Work Experience, Eligibility, Training, Skills, Awards',
            'Table extraction from complex PDF structures',
            '92%+ accuracy rate with confidence scoring'
          ]
        },
        {
          title: 'Resume/CV Processing',
          items: [
            'Unstructured document parsing',
            'Skill extraction and categorization',
            'Experience timeline building',
            'Education verification',
            'Multiple format support (PDF, DOCX, Images)'
          ]
        },
        {
          title: 'ATS Resume Conversion',
          items: [
            'Convert PDS to ATS-friendly format',
            'Remove complex formatting',
            'Keyword optimization',
            'Section standardization',
            'Applicant Tracking System compatibility'
          ]
        }
      ]
    },
    {
      icon: Target,
      title: 'Intelligent Ranking & Scoring System',
      gradient: 'from-purple-500 to-purple-600',
      description:
        'Customizable 8-criteria evaluation system provides transparent, fair, and objective applicant assessment.',
      details: [
        {
          title: '8 Scoring Criteria',
          items: [
            "Education (Default 20%): Doctorate, Master's, Bachelor's, Vocational, High School",
            'Work Experience (25%): 10+ years, 7-9, 4-6, 2-3, 0-1 year brackets',
            'Training Programs (10%): Seminars, workshops, certifications count',
            'Civil Service Eligibility (15%): RA 1080, CS Professional, Sub-Professional',
            'Skills (10%): Technical and soft skills matching',
            'Awards & Recognition (5%): Achievements and honors',
            'Relevant Experience (10%): Position-specific experience',
            'Certifications (5%): Industry certifications and licenses'
          ]
        },
        {
          title: 'Customizable Configuration',
          items: [
            'Three-level hierarchy: System → Company → Job-specific',
            'Adjust weight percentages per criterion',
            'Enable/disable individual criteria',
            'Real-time validation (weights must sum to 100%)',
            'Sub-criteria points customization',
            'Reset to defaults option'
          ]
        },
        {
          title: 'Transparent Breakdown',
          items: [
            'Detailed score breakdown for each criterion',
            'Percentage match visualization',
            'Letter grades: Excellent, Very Good, Good, Fair',
            'Percentile ranking among all applicants',
            'Strengths and concerns analysis',
            'Match reasons explanation'
          ]
        }
      ]
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics & AI Insights',
      gradient: 'from-green-500 to-green-600',
      description:
        'Leverage machine learning and AI to predict outcomes, recommend paths, and provide actionable insights.',
      details: [
        {
          title: 'Job Recommendations',
          items: [
            'AI-powered job matching based on profile',
            'Skills alignment scoring',
            'Experience relevance analysis',
            'Education match verification',
            'Location proximity consideration',
            'Career goals alignment',
            'Confidence score with explanations'
          ]
        },
        {
          title: 'Career Path Prediction',
          items: [
            'Career trajectory analysis',
            'Skill gap identification',
            'Recommended training programs',
            'Career advancement suggestions',
            'Salary projection models',
            'Success probability calculation',
            'Step-by-step progression plans'
          ]
        },
        {
          title: 'Candidate Success Prediction',
          items: [
            'Likelihood of selection analysis',
            'Competitive positioning',
            'Areas for improvement identification',
            'Success factors breakdown',
            'Time-to-readiness estimation',
            'Hiring success rate forecasting'
          ]
        }
      ]
    },
    {
      icon: Briefcase,
      title: 'Complete Job Management System',
      gradient: 'from-yellow-500 to-yellow-600',
      description:
        'End-to-end job posting lifecycle management with powerful tools for employers and administrators.',
      details: [
        {
          title: 'Job Posting Features',
          items: [
            'Create, edit, archive job postings',
            'Rich text editor for descriptions',
            'Custom scoring configuration per job',
            'Category and classification system',
            'Salary range specification',
            'Employment type selection',
            'Deadline management with auto-close',
            'Application tracking dashboard'
          ]
        },
        {
          title: 'Application Management',
          items: [
            'Real-time ranking updates',
            'Status workflow: Applied → Screening → Interview → Hired',
            'Bulk operations on applications',
            'Filter and search capabilities',
            'Export applicant lists (Excel, PDF, CSV)',
            'Email notifications on status changes',
            'Interview scheduling integration'
          ]
        },
        {
          title: 'Analytics & Reporting',
          items: [
            'Application trends over time',
            'Applicant demographics breakdown',
            'Score distribution analysis',
            'Time-to-hire metrics',
            'Drop-off analysis',
            'Comparison across jobs',
            'Success rate tracking'
          ]
        }
      ]
    },
    {
      icon: GraduationCap,
      title: 'Smart Matching Engine',
      gradient: 'from-red-500 to-red-600',
      description:
        'Multi-dimensional matching algorithm ensures perfect candidate-job alignment based on comprehensive criteria.',
      details: [
        {
          title: 'Education Matching',
          items: [
            "Degree level verification (Doctorate, Master's, Bachelor's, etc.)",
            'Field of study alignment',
            'Institution recognition',
            'Graduation year tracking',
            'Honors and distinctions',
            'Continuing education credits'
          ]
        },
        {
          title: 'Experience Matching',
          items: [
            'Years of experience calculation',
            'Position relevance scoring',
            'Industry experience weighting',
            'Government service tracking',
            'Career progression analysis',
            'Salary history consideration'
          ]
        },
        {
          title: 'Skills & Competencies',
          items: [
            'Technical skills matching',
            'Soft skills evaluation',
            'Language proficiency',
            'Software/tool expertise',
            'Domain knowledge assessment',
            'Transferable skills identification'
          ]
        },
        {
          title: 'Location & Availability',
          items: [
            'Geographic proximity calculation',
            'Commute time estimation',
            'Relocation willingness',
            'Remote work preferences',
            'Start date availability',
            'Schedule flexibility matching'
          ]
        }
      ]
    },
    {
      icon: Award,
      title: 'Civil Service & Eligibility Verification',
      gradient: 'from-indigo-500 to-indigo-600',
      description:
        'Automated verification system for Philippine civil service eligibility and professional licenses.',
      details: [
        {
          title: 'Eligibility Types',
          items: [
            'RA 1080 (Bar/Board Examination)',
            'Career Service Professional',
            'Career Service Sub-Professional',
            'Special eligibility certifications',
            'Honor graduates eligibility',
            'PBET/CSE-PPT results tracking'
          ]
        },
        {
          title: 'Verification Process',
          items: [
            'License number validation',
            'Exam date and location verification',
            'Rating/score recording',
            'Expiration date tracking',
            'Renewal status monitoring',
            'Issuing authority confirmation'
          ]
        },
        {
          title: 'Requirements Checking',
          items: [
            'Job-specific eligibility requirements',
            'Automatic qualification matching',
            'Alert for missing credentials',
            'Grace period handling',
            'Alternative qualification acceptance',
            'Exemption case management'
          ]
        }
      ]
    },
    {
      icon: MessageSquare,
      title: 'Conversation-Based Messaging',
      gradient: 'from-orange-500 to-orange-600',
      description:
        'Professional communication platform with thread management, real-time updates, and email integration.',
      details: [
        {
          title: 'Messaging Features',
          items: [
            'One thread per conversation (no duplicate chains)',
            'Auto-sorting by recency (newest first)',
            'Per-conversation unread counts',
            'Real-time message updates',
            'Email notifications for new messages',
            'Message status tracking (read, replied, archived)'
          ]
        },
        {
          title: 'Communication Types',
          items: [
            'Admin ↔ Applicant direct messaging',
            'Admin ↔ Employer communication',
            'Employer ↔ Applicant interview coordination',
            'Interview invitations',
            'Status update notifications',
            'Document request messaging'
          ]
        },
        {
          title: 'Message Organization',
          items: [
            'Search and filter conversations',
            'Priority levels (high, medium, low)',
            'Category tags (application, interview, general)',
            'Archive inactive conversations',
            'Pin important threads',
            'Attachment support'
          ]
        }
      ]
    },
    {
      icon: BarChart4,
      title: 'Comprehensive Analytics & Reports',
      gradient: 'from-teal-500 to-teal-600',
      description:
        'Data-driven insights with beautiful dashboards, trend analysis, and exportable reports.',
      details: [
        {
          title: 'Dashboard Analytics',
          items: [
            'Total jobs, applicants, and applications count',
            'Active vs inactive jobs visualization',
            'Application status distribution charts',
            'Applicant demographics breakdown',
            'Job category distribution',
            'Geographic distribution maps',
            'Monthly trends and patterns'
          ]
        },
        {
          title: 'Report Types',
          items: [
            'Applicant Summary Report (demographics, qualifications)',
            'Job Application Success Report (conversion rates)',
            'PDS Parsing Accuracy Report',
            'Time-to-hire metrics report',
            'Interview success rate analysis',
            'Skill demand trends report'
          ]
        },
        {
          title: 'Export Options',
          items: [
            'Excel format with full details',
            'PDF formatted reports with charts',
            'CSV for data analysis',
            'Scheduled automated reports',
            'Custom date range selection',
            'Filter by category, status, location'
          ]
        }
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: Users,
      title: 'User Management',
      items: [
        'Role-based access control (Admin, Employer, Applicant)',
        'Email verification workflow',
        'Password reset functionality',
        'Profile management',
        'Account security settings'
      ]
    },
    {
      icon: Building,
      title: 'Company Management',
      items: [
        'Company verification system',
        'Document upload (permits, licenses)',
        'Custom scoring per company',
        'Company profiles with branding',
        'Multi-company support'
      ]
    },
    {
      icon: Calendar,
      title: 'Scheduling & Automation',
      items: [
        'Auto-close expired job postings',
        'Scheduled job recommendations',
        'Automated status updates',
        'Weekly report generation',
        'Document cleanup tasks'
      ]
    },
    {
      icon: Mail,
      title: 'Email Integration',
      items: [
        'Welcome emails',
        'Application confirmations',
        'Status change notifications',
        'Interview invitations',
        'Job recommendations',
        'Newsletter campaigns'
      ]
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      items: [
        'JWT authentication',
        'Password hashing (bcryptjs)',
        'Secure file storage',
        'Data encryption',
        'Audit logging',
        'GDPR compliance ready'
      ]
    },
    {
      icon: Zap,
      title: 'Performance Optimized',
      items: [
        'Database indexing',
        'Efficient queries',
        'Pagination on all lists',
        'Image optimization',
        'Caching strategies',
        'Fast page loads'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-16 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-48 right-16 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-16 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container relative px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Features</span>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              <Brain className="h-5 w-5" />
              Complete Feature Guide
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Everything You Need to Know
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Explore the comprehensive suite of AI-powered tools that make
              INTELLIHIRE the most advanced recruitment platform for Philippine
              government offices
            </p>

            {/* <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link href="/register">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/login">
                <button className="inline-flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Sign In
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="space-y-32">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 lg:gap-20 items-center`}>
                {/* Icon Side */}
                <div className="flex-shrink-0">
                  <div
                    className={`relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br ${feature.gradient} rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-16 w-16 md:h-20 md:w-20 text-white" />
                    <div className="absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-30 blur-xl"></div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {feature.title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-8">
                    {feature.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`}></div>
                          {detail.title}
                        </h3>
                        <ul className="space-y-3">
                          {detail.items.map((item, itemIdx) => (
                            <li
                              key={itemIdx}
                              className="flex items-start gap-3 text-gray-700">
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg mb-6">
              <Sparkles className="h-5 w-5" />
              More Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complete Platform Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Additional features that make INTELLIHIRE a complete solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>

                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Transform Your Recruitment?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Join hundreds of government offices using INTELLIHIRE to
                streamline their hiring process
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                <Link href="/register">
                  <button className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="inline-flex items-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Sign In to Dashboard
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
