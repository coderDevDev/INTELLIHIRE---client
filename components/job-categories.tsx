import Link from 'next/link';
import {
  Code,
  Building2,
  ShoppingBag,
  Hammer,
  HeartPulse,
  Landmark,
  Briefcase
} from 'lucide-react';

export type Category = {
  _id: string;
  name: string;
  count?: number;
};

type JobCategoriesProps = {
  categories: Category[];
};

const iconMap: Record<string, any> = {
  'Information Technology': Code,
  Business: Building2,
  Sales: ShoppingBag,
  Construction: Hammer,
  Healthcare: HeartPulse,
  Government: Landmark
};

export function JobCategories({ categories }: JobCategoriesProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">
              Browse by Category
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Explore Job Categories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find the perfect job in your field of expertise
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 sm:grid-cols-2 md:grid-cols-3">
          {categories.map(category => {
            const Icon = iconMap[category.name] || Briefcase;
            return (
              <Link
                key={category._id}
                href={`/jobs/category/${category._id}`}
                className="category-card group rounded-xl border bg-card p-6 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full bg-gray-100 text-brand-blue p-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-brand-blue">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count || 0} jobs available
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/jobs/categories"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            <Briefcase className="h-4 w-4" />
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
