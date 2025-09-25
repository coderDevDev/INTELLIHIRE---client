import {
  FileText,
  Search,
  BarChart4,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: 'PDS Parsing',
      description:
        'Automatic extraction of data from Personal Data Sheets using advanced AI technology',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Search,
      title: 'Smart Matching',
      description:
        'AI-powered matching of applicants with suitable job positions based on skills and experience',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: BarChart4,
      title: 'Advanced Analytics',
      description:
        'Comprehensive analytics and reporting for better decision making and insights',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Briefcase,
      title: 'Job Management',
      description:
        'Easy creation and management of job postings with intuitive tools',
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: GraduationCap,
      title: 'Education Matching',
      description:
        'Match candidates based on educational qualifications and certifications',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: Award,
      title: 'Eligibility Verification',
      description:
        'Verify required certifications and qualifications automatically',
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Zap,
      title: 'Quick Application',
      description:
        'Apply to multiple jobs with a single click and streamlined process',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get notified about application status changes instantly',
      gradient: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600'
    }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-16 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-48 right-16 w-72 h-72 bg-sky-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}></div>
        <div
          className="absolute bottom-16 left-1/4 w-80 h-80 bg-fuchsia-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}></div>
        <div
          className="absolute bottom-48 right-1/3 w-64 h-64 bg-lime-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-orange-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s' }}></div>
        <div
          className="absolute top-1/4 right-1/4 w-40 h-40 bg-teal-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="h-4 w-4" />
              Why Choose InteliHire
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="max-w-[800px] text-gray-600 md:text-xl leading-relaxed">
              Our AI-powered platform revolutionizes the job application process
              with cutting-edge technology designed for both applicants and
              employers
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              style={{ animationDelay: `${index * 100}ms` }}>
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center justify-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Hover Effect Border */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <Sparkles className="h-5 w-5" />
            Explore All Features
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
