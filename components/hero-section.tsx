import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Building } from 'lucide-react';

export type Category = {
  _id: string;
  name: string;
};

type HeroSectionProps = {
  categories: Category[];
};

export function HeroSection({ categories }: HeroSectionProps) {
  return (
    <section className="hero-gradient py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4 text-white">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Find Your Dream Job in Sto. Tomas
              </h1>
              <p className="max-w-[600px] md:text-xl">
                InteliHire uses AI-powered matching to connect you with the
                perfect job opportunities tailored to your skills and
                experience.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                className="w-full bg-white text-brand-blue hover:bg-gray-100">
                Browse Jobs
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white text-white hover:bg-white/10">
                For Employers
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Quick Job Search</h2>
              <p className="text-muted-foreground">
                Find the perfect job in seconds
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="pl-9"
                  defaultValue="Sto. Tomas, Batangas"
                />
              </div>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="w-full" size="lg">
                <Search className="mr-2 h-4 w-4" /> Search Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
