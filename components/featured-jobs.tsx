import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Building, Clock, Briefcase } from "lucide-react"

export function FeaturedJobs() {
  const jobs = [
    {
      id: 1,
      title: "Software Developer",
      company: "Epson Precision Philippines Inc.",
      location: "Sto. Tomas, Batangas",
      type: "Full-time",
      salary: "₱30,000 - ₱45,000",
      posted: "2 days ago",
      logo: "/placeholder.svg?height=40&width=40",
      featured: true,
    },
    {
      id: 2,
      title: "Sales Clerk",
      company: "SM City Sto. Tomas",
      location: "Sto. Tomas, Batangas",
      type: "Full-time",
      salary: "₱16,000 - ₱18,000",
      posted: "3 days ago",
      logo: "/placeholder.svg?height=40&width=40",
      featured: true,
    },
    {
      id: 3,
      title: "Quality Assurance",
      company: "Murata Manufacturing",
      location: "Sto. Tomas, Batangas",
      type: "Full-time",
      salary: "₱25,000 - ₱35,000",
      posted: "1 week ago",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
    },
    {
      id: 4,
      title: "Administrative Assistant",
      company: "City Government of Sto. Tomas",
      location: "Sto. Tomas, Batangas",
      type: "Contract",
      salary: "₱18,000 - ₱22,000",
      posted: "5 days ago",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
    },
    {
      id: 5,
      title: "IT Helpdesk",
      company: "City Government of Sto. Tomas",
      location: "Sto. Tomas, Batangas",
      type: "Full-time",
      salary: "₱22,000 - ₱28,000",
      posted: "Just now",
      logo: "/placeholder.svg?height=40&width=40",
      featured: true,
    },
    {
      id: 6,
      title: "Software Developer",
      company: "MyBrush Technology Inc.",
      location: "Sto. Tomas, Batangas",
      type: "Full-time",
      salary: "₱35,000 - ₱50,000",
      posted: "3 days ago",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
    },
  ]

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">
              Latest Opportunities
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Job Openings</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the latest job opportunities in Sto. Tomas
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="job-card overflow-hidden">
              {job.featured && (
                <div className="absolute right-0 top-0">
                  <Badge className="rounded-bl-md rounded-tr-md rounded-br-none rounded-tl-none bg-brand-blue">
                    Featured
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={job.logo || "/placeholder.svg"}
                        alt={job.company}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Posted {job.posted}</span>
                  </div>
                  <div className="pt-1 font-medium text-brand-blue">{job.salary}</div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button asChild>
                    <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/jobs" className="inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              View All Jobs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
