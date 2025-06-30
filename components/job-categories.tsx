import Link from "next/link"
import { Code, Building2, ShoppingBag, Hammer, HeartPulse, Landmark, Briefcase } from "lucide-react"

export function JobCategories() {
  const categories = [
    {
      name: "Information Technology",
      icon: Code,
      color: "bg-blue-100 text-blue-600",
      count: 124,
      href: "/jobs/category/it",
    },
    {
      name: "Business",
      icon: Building2,
      color: "bg-purple-100 text-purple-600",
      count: 87,
      href: "/jobs/category/business",
    },
    {
      name: "Sales",
      icon: ShoppingBag,
      color: "bg-green-100 text-green-600",
      count: 65,
      href: "/jobs/category/sales",
    },
    {
      name: "Construction",
      icon: Hammer,
      color: "bg-yellow-100 text-yellow-600",
      count: 43,
      href: "/jobs/category/construction",
    },
    {
      name: "Healthcare",
      icon: HeartPulse,
      color: "bg-red-100 text-red-600",
      count: 38,
      href: "/jobs/category/healthcare",
    },
    {
      name: "Government",
      icon: Landmark,
      color: "bg-indigo-100 text-indigo-600",
      count: 29,
      href: "/jobs/category/government",
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">Browse by Category</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explore Job Categories</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find the perfect job in your field of expertise
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="category-card group rounded-xl border bg-card p-6 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full ${category.color} p-3`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-brand-blue">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} jobs available</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/jobs/categories"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Briefcase className="h-4 w-4" />
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}
