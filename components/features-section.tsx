import { FileText, Search, BarChart4, Briefcase, GraduationCap, Award, Zap, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "PDS Parsing",
      description: "Automatic extraction of data from Personal Data Sheets",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Search,
      title: "Smart Matching",
      description: "AI-powered matching of applicants with suitable job positions",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart4,
      title: "Advanced Analytics",
      description: "Comprehensive analytics and reporting for better decision making",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Briefcase,
      title: "Job Management",
      description: "Easy creation and management of job postings",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: GraduationCap,
      title: "Education Matching",
      description: "Match candidates based on educational qualifications",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Award,
      title: "Eligibility Verification",
      description: "Verify required certifications and qualifications",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Zap,
      title: "Quick Application",
      description: "Apply to multiple jobs with a single click",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get notified about application status changes instantly",
      color: "bg-teal-100 text-teal-600",
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">
              Why Choose InteliHire
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered platform streamlines the job application process for both applicants and employers
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`rounded-full ${feature.color} p-3`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
