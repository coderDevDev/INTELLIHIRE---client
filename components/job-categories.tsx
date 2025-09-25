import Link from 'next/link';
import {
  Code,
  Building2,
  ShoppingBag,
  Hammer,
  HeartPulse,
  Landmark,
  Briefcase,
  ArrowRight,
  Sparkles
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

const categoryColors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-red-500 to-red-600',
  'from-indigo-500 to-indigo-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600'
];

export function JobCategories({ categories }: JobCategoriesProps) {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-32 left-20 w-64 h-64 bg-cyan-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2.5s' }}></div>
        <div
          className="absolute bottom-32 right-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}></div>
        <div
          className="absolute bottom-10 left-1/3 w-88 h-88 bg-rose-300/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3.5s' }}></div>
        <div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-amber-300/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="h-4 w-4" />
              Browse by Category
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Explore Job Categories
            </h2>
            <p className="max-w-[800px] text-gray-600 md:text-xl leading-relaxed">
              Discover opportunities across diverse industries and find the
              perfect match for your skills and career goals
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = iconMap[category.name] || Briefcase;
            const colorClass = categoryColors[index % categoryColors.length];
            return (
              <Link
                key={category._id}
                href={`/jobs/category/${category._id}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`rounded-2xl bg-gradient-to-br ${colorClass} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.count || 0} jobs available
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Available</span>
                      <span>{category.count || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${colorClass} h-2 rounded-full transition-all duration-500`}
                        style={{
                          width: `${Math.min((category.count || 0) * 10, 100)}%`
                        }}></div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/jobs/categories"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <Briefcase className="h-5 w-5" />
            View All Categories
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
