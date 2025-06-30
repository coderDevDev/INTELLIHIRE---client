import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"

export function TopCompanies() {
  const companies = [
    {
      id: 1,
      name: "Epson Precision Philippines Inc.",
      logo: "/placeholder.svg?height=60&width=120",
      jobs: 15,
    },
    {
      id: 2,
      name: "MyBrush Technology Inc.",
      logo: "/placeholder.svg?height=60&width=120",
      jobs: 8,
    },
    {
      id: 3,
      name: "Murata Manufacturing",
      logo: "/placeholder.svg?height=60&width=120",
      jobs: 12,
    },
    {
      id: 4,
      name: "SM City Sto. Tomas",
      logo: "/placeholder.svg?height=60&width=120",
      jobs: 10,
    },
    {
      id: 5,
      name: "Alfamart",
      logo: "/placeholder.svg?height=60&width=120",
      jobs: 6,
    },
    {
      id: 6,
      name: "CDO",
      logo: "/placeholder.svg?height=60&width=120",
      jobs: 4,
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">Top Employers</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Companies</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Leading employers in Sto. Tomas looking for talented individuals
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 py-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-24 w-full items-center justify-center rounded-md border bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  className="company-logo max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{company.name}</p>
                <p className="text-xs text-muted-foreground">{company.jobs} open positions</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/companies" className="inline-flex items-center gap-2">
              <Building className="h-4 w-4" />
              View All Companies
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
