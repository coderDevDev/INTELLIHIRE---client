import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  MapPin,
  Building,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  onClear: () => void;
  className?: string;
}

export function SearchFilters({
  onSearch,
  onClear,
  className
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    company: '',
    type: '',
    category: '',
    salaryMin: 0,
    salaryMax: 100000,
    remote: false,
    urgent: false,
    featured: false
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship'
  ];

  const categories = [
    'Information Technology',
    'Business',
    'Sales',
    'Marketing',
    'Healthcare',
    'Education',
    'Engineering',
    'Design'
  ];

  const companies = ['ABC Company', 'XYZ Inc.', 'Tech Corp', 'Startup Labs'];

  const locations = ['Sto. Tomas', 'Manila', 'Quezon City', 'Makati', 'Taguig'];

  useEffect(() => {
    const active = [];
    if (filters.search) active.push('Search');
    if (filters.location) active.push('Location');
    if (filters.company) active.push('Company');
    if (filters.type) active.push('Type');
    if (filters.category) active.push('Category');
    if (filters.salaryMin > 0 || filters.salaryMax < 100000)
      active.push('Salary');
    if (filters.remote) active.push('Remote');
    if (filters.urgent) active.push('Urgent');
    if (filters.featured) active.push('Featured');

    setActiveFilters(active);
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      search: '',
      location: '',
      company: '',
      type: '',
      category: '',
      salaryMin: 0,
      salaryMax: 100000,
      remote: false,
      urgent: false,
      featured: false
    });
    onClear();
  };

  const removeFilter = (filterName: string) => {
    const filterMap: Record<string, string> = {
      Search: 'search',
      Location: 'location',
      Company: 'company',
      Type: 'type',
      Category: 'category',
      Salary: 'salaryMin',
      Remote: 'remote',
      Urgent: 'urgent',
      Featured: 'featured'
    };

    const key = filterMap[filterName];
    if (key === 'salaryMin') {
      handleFilterChange('salaryMin', 0);
      handleFilterChange('salaryMax', 100000);
    } else if (
      key === 'search' ||
      key === 'location' ||
      key === 'company' ||
      key === 'type' ||
      key === 'category'
    ) {
      handleFilterChange(key, '');
    } else {
      handleFilterChange(key, false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs, companies, or keywords..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(filter => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear All
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <Card className="animate-in slide-in-from-top-2 duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Select
                  value={filters.location}
                  onValueChange={value =>
                    handleFilterChange('location', value)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  Company
                </label>
                <Select
                  value={filters.company}
                  onValueChange={value => handleFilterChange('company', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Companies</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Employment Type
                </label>
                <Select
                  value={filters.type}
                  onValueChange={value => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {employmentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={value =>
                    handleFilterChange('category', value)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Salary Range (₱)
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[filters.salaryMin, filters.salaryMax]}
                    onValueChange={([min, max]) => {
                      handleFilterChange('salaryMin', min);
                      handleFilterChange('salaryMax', max);
                    }}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₱{filters.salaryMin.toLocaleString()}</span>
                    <span>₱{filters.salaryMax.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Job Features</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote"
                      checked={filters.remote}
                      onCheckedChange={checked =>
                        handleFilterChange('remote', checked)
                      }
                    />
                    <label htmlFor="remote" className="text-sm">
                      Remote Work
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={filters.urgent}
                      onCheckedChange={checked =>
                        handleFilterChange('urgent', checked)
                      }
                    />
                    <label htmlFor="urgent" className="text-sm">
                      Urgent Hiring
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={checked =>
                        handleFilterChange('featured', checked)
                      }
                    />
                    <label htmlFor="featured" className="text-sm">
                      Featured Jobs
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={handleClear}>
                Clear All
              </Button>
              <Button onClick={handleSearch}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
