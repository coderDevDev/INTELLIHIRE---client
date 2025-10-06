'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Filter,
  X,
  MapPin,
  Building,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  ArrowUpDown,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
  onSearchChange: (search: string) => void;
  categories?: FilterOption[];
  companies?: FilterOption[];
  locations?: FilterOption[];
  employmentTypes?: FilterOption[];
  salaryRanges?: FilterOption[];
  showAdvanced?: boolean;
  className?: string;
}

export function EnhancedSearchFilters({
  onFiltersChange,
  onSearchChange,
  categories = [],
  companies = [],
  locations = [],
  employmentTypes = [],
  salaryRanges = [],
  showAdvanced = true,
  className
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [filters, setFilters] = useState({
    category: '',
    company: '',
    location: '',
    employmentType: '',
    salaryMin: 0,
    salaryMax: 100000,
    postedWithin: '',
    experienceLevel: '',
    remoteWork: false,
    benefits: [] as string[],
    skills: [] as string[],
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    location: true,
    salary: false,
    experience: false,
    benefits: false,
    skills: false
  });

  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [showSavedFilters, setShowSavedFilters] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 300);

    setDebounceTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery, onSearchChange]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      company: '',
      location: '',
      employmentType: '',
      salaryMin: 0,
      salaryMax: 100000,
      postedWithin: '',
      experienceLevel: '',
      remoteWork: false,
      benefits: [],
      skills: [],
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    setSearchQuery('');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveCurrentFilters = () => {
    const filterName = prompt('Enter a name for this filter set:');
    if (filterName) {
      const newSavedFilter = {
        id: Date.now().toString(),
        name: filterName,
        filters: { ...filters },
        searchQuery,
        createdAt: new Date()
      };
      setSavedFilters(prev => [...prev, newSavedFilter]);
    }
  };

  const loadSavedFilter = (savedFilter: any) => {
    setFilters(savedFilter.filters);
    setSearchQuery(savedFilter.searchQuery);
  };

  const deleteSavedFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== '' && value !== 0 && value !== 100000;
  }).length;

  const FilterSection = ({
    title,
    icon,
    sectionKey,
    children,
    defaultExpanded = true
  }: {
    title: string;
    icon: React.ReactNode;
    sectionKey: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded =
      expandedSections[sectionKey as keyof typeof expandedSections] ??
      defaultExpanded;

    return (
      <div className="space-y-3">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full text-left hover:bg-white/60 rounded-lg p-2 transition-colors duration-200">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-gray-700">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {isExpanded && <div className="space-y-3 pl-6">{children}</div>}
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Enhanced Search Bar */}
      <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Smart Job Search
          </CardTitle>
          <CardDescription>
            Find your perfect job with AI-powered search and intelligent filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search jobs, companies, skills, or locations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-12 text-lg rounded-xl border-white/50 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-white/60">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Search Suggestions */}
          {searchQuery && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-powered search
              </Badge>
              <Badge variant="outline" className="border-white/50">
                <Target className="h-3 w-3 mr-1" />
                Smart matching
              </Badge>
            </div>
          )}

          {/* Filter Toggle and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-600 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50">
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedFilters(!showSavedFilters)}
                className="hover:bg-white/60">
                <Save className="h-4 w-4 mr-1" />
                Saved
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={saveCurrentFilters}
                className="hover:bg-white/60">
                <Plus className="h-4 w-4 mr-1" />
                Save Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Filters Panel */}
      {showSavedFilters && savedFilters.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Saved Filter Sets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedFilters.map(savedFilter => (
                <div
                  key={savedFilter.id}
                  className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50">
                  <div>
                    <p className="font-medium text-gray-900">
                      {savedFilter.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Saved {savedFilter.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadSavedFilter(savedFilter)}
                      className="hover:bg-white/60">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSavedFilter(savedFilter.id)}
                      className="hover:bg-red-50 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Advanced Filters
            </CardTitle>
            <CardDescription>
              Refine your search with detailed filters and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <FilterSection
              title="Job Categories"
              icon={<Briefcase className="h-4 w-4 text-blue-600" />}
              sectionKey="category">
              <div className="grid grid-cols-1 gap-2">
                {categories.map(cat => (
                  <label
                    key={cat.value}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-white/60 rounded-lg p-2 transition-colors duration-200">
                    <Checkbox
                      checked={filters.category === cat.value}
                      onCheckedChange={checked =>
                        handleFilterChange('category', checked ? cat.value : '')
                      }
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        {cat.label}
                      </span>
                      {cat.count && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({cat.count})
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Location Filter */}
            <FilterSection
              title="Locations"
              icon={<MapPin className="h-4 w-4 text-green-600" />}
              sectionKey="location">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={filters.remoteWork}
                    onCheckedChange={checked =>
                      handleFilterChange('remoteWork', checked)
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Remote Work Available
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {locations.map(loc => (
                    <label
                      key={loc.value}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-white/60 rounded-lg p-2 transition-colors duration-200">
                      <Checkbox
                        checked={filters.location === loc.value}
                        onCheckedChange={checked =>
                          handleFilterChange(
                            'location',
                            checked ? loc.value : ''
                          )
                        }
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">
                          {loc.label}
                        </span>
                        {loc.count && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({loc.count})
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </FilterSection>

            {/* Salary Range */}
            <FilterSection
              title="Salary Range"
              icon={<DollarSign className="h-4 w-4 text-green-600" />}
              sectionKey="salary"
              defaultExpanded={false}>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={[filters.salaryMin, filters.salaryMax]}
                    onValueChange={([min, max]) => {
                      handleFilterChange('salaryMin', min);
                      handleFilterChange('salaryMax', max);
                    }}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₱{filters.salaryMin.toLocaleString()}</span>
                  <span>₱{filters.salaryMax.toLocaleString()}</span>
                </div>
              </div>
            </FilterSection>

            {/* Employment Type */}
            <FilterSection
              title="Employment Type"
              icon={<Clock className="h-4 w-4 text-purple-600" />}
              sectionKey="experience"
              defaultExpanded={false}>
              <div className="grid grid-cols-1 gap-2">
                {employmentTypes.map(type => (
                  <label
                    key={type.value}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-white/60 rounded-lg p-2 transition-colors duration-200">
                    <Checkbox
                      checked={filters.employmentType === type.value}
                      onCheckedChange={checked =>
                        handleFilterChange(
                          'employmentType',
                          checked ? type.value : ''
                        )
                      }
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        {type.label}
                      </span>
                      {type.count && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({type.count})
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Sort Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">Sort By</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Select
                  value={filters.sortBy}
                  onValueChange={value => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="company">Company Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sortOrder}
                  onValueChange={value =>
                    handleFilterChange('sortOrder', value)
                  }>
                  <SelectTrigger className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                    <SelectValue placeholder="Sort order..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



