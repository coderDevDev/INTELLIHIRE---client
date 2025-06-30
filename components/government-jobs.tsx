import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Building, Clock, Landmark } from "lucide-react"

export function GovernmentJobs() {
  const jobs = [
    {
      id: 1,
      title: "IT Helpdesk",
      department: "City Information Technology Office",
      location: "Sto. Tomas City Hall",
      type: "Full-time",
      salary: "SG-11 (₱25,439/month)",
      posted: "Just now",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      title: "Administrative Assistant",
      department: "City Mayor's Office",
      location: "Sto. Tomas City Hall",
      type: "Contract",
      salary: "SG-8 (₱18,998/month)",
      posted: "5 days ago",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      title: "Software Developer",
      department: "City Information Technology Office",
      location: "Sto. Tomas City Hall",
      type: "Full-time",
      salary: "SG-15 (₱35,097/month)",
      posted: "3 days ago",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      title: "Quality Assurance",
      department: "City Planning and Development Office",
      location: "Sto. Tomas City Hall",
      type: "Full-time",
      salary: "SG-13 (₱29,798/month)",
      posted: "1 week ago",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <section className="bg-brand-blue py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-white px-3 py-1 text-sm text-brand-blue">
              Government Opportunities
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              City Government Job Openings
            </h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Serve the community of Sto. Tomas with these government positions
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id} className="job-card overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                      <Landmark className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.department}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-brand-blue text-brand-blue">
                    Government
                  </Badge>
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
                    <Link href={`/jobs/government/${job.id}`}>Apply Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-brand-blue"
            asChild
          >
            <Link href="/jobs/government" className="inline-flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              View All Government Jobs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
