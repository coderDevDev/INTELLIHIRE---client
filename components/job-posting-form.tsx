'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { jobAPI, companyAPI, categoryAPI } from '@/lib/api-service';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScoringConfigForm } from '@/components/scoring-config-form';
import { ScoringCriteria, DEFAULT_SCORING_CONFIG } from '@/types/scoring.types';
import {
  Settings as SettingsIcon,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
interface Company {
  _id: string;
  name: string;
  isVerified?: boolean;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
  };
  scoringConfig?: ScoringCriteria;
}

interface Category {
  _id: string;
  name: string;
}

interface FormData {
  title: string;
  companyId: string;
  categoryId: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  location: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  salaryPeriod: string;
  isSalaryNegotiable: boolean;
  experienceLevel: string;
  experienceYearsMin: string;
  experienceYearsMax: string;
  educationLevel: string;
  skills: string[] | string;
  eligibility: string[] | string;
  postedDate: Date;
  expiryDate: Date;
  applicationDeadline: string;
  applicationEmail: string;
  applicationUrl: string;
  status: string;
  isFeatured: boolean;
  isUrgent: boolean;
  allowsRemote: boolean;
  department: string;
  positionCount: number;
  jobScoringConfig?: {
    useCompanyDefault: boolean;
    useSystemDefault: boolean;
    customScoring?: ScoringCriteria;
  };
}

interface JobPostingFormProps {
  initialData?: Partial<FormData>;
  onSubmit?: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export function JobPostingForm({
  initialData,
  onSubmit,
  isEditing
}: JobPostingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentTab, setCurrentTab] = useState('basic');
  const [scoringConfig, setScoringConfig] = useState<ScoringCriteria>(
    DEFAULT_SCORING_CONFIG
  );
  const [scoringMode, setScoringMode] = useState<
    'company' | 'system' | 'custom'
  >('company');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    companyId: '',
    categoryId: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    location: '',
    employmentType: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'PHP',
    salaryPeriod: 'monthly',
    isSalaryNegotiable: false,
    experienceLevel: '',
    experienceYearsMin: '',
    experienceYearsMax: '',
    educationLevel: '',
    skills: '',
    eligibility: '',
    postedDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationDeadline: '',
    applicationEmail: '',
    applicationUrl: '',
    status: 'draft',
    isFeatured: false,
    isUrgent: false,
    allowsRemote: false,
    department: '',
    positionCount: 1,
    jobScoringConfig: {
      useCompanyDefault: true,
      useSystemDefault: false,
      customScoring: undefined
    }
  });

  // Populate form fields if editing
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        companyId:
          typeof initialData.companyId === 'object' &&
          initialData.companyId !== null
            ? (initialData.companyId as { _id: string })._id
            : initialData.companyId || '',
        categoryId:
          typeof initialData.categoryId === 'object' &&
          initialData.categoryId !== null
            ? (initialData.categoryId as { _id: string })._id
            : initialData.categoryId || '',
        postedDate: initialData.postedDate
          ? new Date(initialData.postedDate)
          : prev.postedDate,
        expiryDate: initialData.expiryDate
          ? new Date(initialData.expiryDate)
          : prev.expiryDate,
        skills: Array.isArray(initialData.skills)
          ? initialData.skills.join(', ')
          : initialData.skills || '',
        eligibility: Array.isArray(initialData.eligibility)
          ? initialData.eligibility.join(', ')
          : initialData.eligibility || '',
        salaryMin: initialData.salaryMin ? String(initialData.salaryMin) : '',
        salaryMax: initialData.salaryMax ? String(initialData.salaryMax) : '',
        experienceYearsMin: initialData.experienceYearsMin
          ? String(initialData.experienceYearsMin)
          : '',
        experienceYearsMax: initialData.experienceYearsMax
          ? String(initialData.experienceYearsMax)
          : '',
        positionCount: initialData.positionCount
          ? Number(initialData.positionCount)
          : 1
      }));
    }
  }, [initialData]);

  // Debug: Log formData and options
  useEffect(() => {
    console.log('formData.companyId:', formData.companyId);
    console.log('formData.categoryId:', formData.categoryId);
    console.log('companies:', companies);
    console.log('categories:', categories);
  }, [formData, companies, categories]);

  // Ensure companyId/categoryId are valid after options load
  useEffect(() => {
    if (
      companies.length > 0 &&
      formData.companyId &&
      !companies.some(c => c._id === formData.companyId)
    ) {
      setFormData(prev => ({ ...prev, companyId: '' }));
    }
    if (
      categories.length > 0 &&
      formData.categoryId &&
      !categories.some(c => c._id === formData.categoryId)
    ) {
      setFormData(prev => ({ ...prev, categoryId: '' }));
    }
  }, [companies, categories]);

  // Load companies and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch companies and categories from API
        const [companiesData, categoriesData] = await Promise.all([
          companyAPI.getCompanies(),
          categoryAPI.getCategories()
        ]);

        const loadedCompanies = companiesData.companies || companiesData || [];
        const loadedCategories =
          categoriesData.categories || categoriesData || [];

        // Filter to show only verified companies
        const verifiedCompanies = loadedCompanies.filter(
          (company: Company) => company.isVerified
        );

        setCompanies(verifiedCompanies);
        setCategories(loadedCategories);

        // Show helpful message if no verified companies exist
        if (verifiedCompanies.length === 0) {
          toast.warning('No verified companies found', {
            description:
              'Please verify companies in the Company Management section first.'
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load companies and categories', {
          description: 'Please check your connection and try again.'
        });
        setCompanies([]);
        setCategories([]);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle company selection and auto-populate location + scoring config
  const handleCompanyChange = async (companyId: string) => {
    setFormData(prev => ({
      ...prev,
      companyId
    }));

    // Find the selected company and populate location
    const selectedCompany = companies.find(c => c._id === companyId);

    if (selectedCompany) {
      // Auto-populate location
      if (selectedCompany.address) {
        const { street, city, province, zipCode } = selectedCompany.address;
        const locationParts = [street, city, province, zipCode].filter(Boolean);
        const location = locationParts.join(', ');

        if (location) {
          setFormData(prev => ({
            ...prev,
            location
          }));

          toast({
            title: 'Location auto-filled',
            description: `Location populated from ${selectedCompany.name}'s address`
          });
        }
      }

      // Load company's scoring configuration
      try {
        const companyDetails = await companyAPI.getCompanyById(companyId);

        if (companyDetails.scoringConfig) {
          setScoringConfig(companyDetails.scoringConfig);
          setScoringMode('company');
          setFormData(prev => ({
            ...prev,
            jobScoringConfig: {
              useCompanyDefault: true,
              useSystemDefault: false,
              customScoring: undefined
            }
          }));

          toast({
            title: 'Scoring configuration loaded',
            description: `Using ${selectedCompany.name}'s scoring criteria. You can customize in the Scoring tab.`
          });
        } else {
          // Use default if company has no custom config
          setScoringConfig(DEFAULT_SCORING_CONFIG);
          setScoringMode('system');
          setFormData(prev => ({
            ...prev,
            jobScoringConfig: {
              useCompanyDefault: false,
              useSystemDefault: true,
              customScoring: undefined
            }
          }));
        }
      } catch (error) {
        console.error('Error loading company scoring config:', error);
        toast({
          title: 'Could not load scoring configuration',
          description: 'Using default scoring criteria.',
          variant: 'destructive'
        });
        setScoringConfig(DEFAULT_SCORING_CONFIG);
      }
    }
  };

  const handleSkillsChange = (value: string) => {
    // Convert comma-separated skills to array
    const skillsArray = value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleEligibilityChange = (value: string) => {
    // Convert comma-separated eligibility to array
    const eligibilityArray = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item);
    setFormData(prev => ({
      ...prev,
      eligibility: eligibilityArray
    }));
  };

  const handleScoringModeChange = (mode: 'company' | 'system' | 'custom') => {
    setScoringMode(mode);

    if (mode === 'company') {
      // Use company's config
      const selectedCompany = companies.find(c => c._id === formData.companyId);
      if (selectedCompany?.scoringConfig) {
        setScoringConfig(selectedCompany.scoringConfig);
      }
      setFormData(prev => ({
        ...prev,
        jobScoringConfig: {
          useCompanyDefault: true,
          useSystemDefault: false,
          customScoring: undefined
        }
      }));
    } else if (mode === 'system') {
      // Use system default
      setScoringConfig(DEFAULT_SCORING_CONFIG);
      setFormData(prev => ({
        ...prev,
        jobScoringConfig: {
          useCompanyDefault: false,
          useSystemDefault: true,
          customScoring: undefined
        }
      }));
    } else {
      // Custom mode - keep current config but mark as custom
      setFormData(prev => ({
        ...prev,
        jobScoringConfig: {
          useCompanyDefault: false,
          useSystemDefault: false,
          customScoring: scoringConfig
        }
      }));
    }
  };

  const handleScoringConfigSave = async (config: ScoringCriteria) => {
    setScoringConfig(config);
    setScoringMode('custom');
    setFormData(prev => ({
      ...prev,
      jobScoringConfig: {
        useCompanyDefault: false,
        useSystemDefault: false,
        customScoring: config
      }
    }));

    toast({
      title: 'Scoring configuration updated',
      description: 'Custom scoring will be used for this job post.'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Prepare the data for submission
      const jobData: any = {
        ...formData,
        // jobScoringConfig already in formData with correct structure
        salaryMin: formData.salaryMin
          ? parseFloat(formData.salaryMin)
          : undefined,
        salaryMax: formData.salaryMax
          ? parseFloat(formData.salaryMax)
          : undefined,
        experienceYearsMin: formData.experienceYearsMin
          ? parseInt(formData.experienceYearsMin)
          : undefined,
        experienceYearsMax: formData.experienceYearsMax
          ? parseInt(formData.experienceYearsMax)
          : undefined,
        positionCount: parseInt(formData.positionCount.toString()),
        applicationDeadline: formData.applicationDeadline
          ? new Date(formData.applicationDeadline)
          : undefined,
        postedDate: new Date(formData.postedDate),
        expiryDate: new Date(formData.expiryDate),
        skills:
          typeof formData.skills === 'string'
            ? formData.skills
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : formData.skills,
        eligibility:
          typeof formData.eligibility === 'string'
            ? formData.eligibility
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : formData.eligibility
      };
      Object.keys(jobData).forEach(key => {
        if (
          jobData[key] === '' ||
          jobData[key] === null ||
          jobData[key] === undefined
        ) {
          delete jobData[key];
        }
      });
      if (onSubmit) {
        await onSubmit(jobData);
      } else {
        await jobAPI.createJob(jobData);
        toast({
          title: 'Success',
          description: 'Job posting created successfully!'
        });
        router.push('/dashboard/admin/jobs');
      }
    } catch (error: any) {
      console.error('Error submitting job:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to submit job posting',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation functions for each tab
  const validateBasicTab = () => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push('Job title is required');
    if (!formData.companyId) errors.push('Company is required');
    if (!formData.categoryId) errors.push('Category is required');
    if (!formData.location.trim()) errors.push('Location is required');
    if (!formData.employmentType) errors.push('Employment type is required');
    if (!formData.postedDate) errors.push('Posting date is required');
    if (!formData.expiryDate) errors.push('Expiry date is required');

    return errors;
  };

  const validateDetailsTab = () => {
    const errors: string[] = [];

    if (!formData.description.trim())
      errors.push('Job description is required');
    if (!formData.responsibilities.trim())
      errors.push('Job responsibilities are required');

    return errors;
  };

  const validateRequirementsTab = () => {
    const errors: string[] = [];

    if (!formData.educationLevel) errors.push('Education level is required');
    if (!formData.experienceLevel) errors.push('Experience level is required');
    if (
      !formData.skills ||
      (Array.isArray(formData.skills) && formData.skills.length === 0)
    ) {
      errors.push('Required skills are needed');
    }

    return errors;
  };

  const validateCurrentTab = () => {
    switch (currentTab) {
      case 'basic':
        return validateBasicTab();
      case 'details':
        return validateDetailsTab();
      case 'requirements':
        return validateRequirementsTab();
      case 'scoring':
        return []; // Scoring tab is optional (has its own internal validation)
      case 'settings':
        return []; // Settings tab is optional
      default:
        return [];
    }
  };

  const handleNextTab = () => {
    const errors = validateCurrentTab();

    if (errors.length > 0) {
      toast({
        title: 'Please complete required fields',
        description: errors.join(', '),
        variant: 'destructive'
      });
      return;
    }

    const tabs = ['basic', 'details', 'requirements', 'scoring', 'settings'];
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
      // Show success message
      toast({
        title: 'Tab completed',
        description: 'Moving to next section...'
      });
    }
  };

  const handlePreviousTab = () => {
    const tabs = ['basic', 'details', 'requirements', 'scoring', 'settings'];
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const canProceedToNext = () => {
    const errors = validateCurrentTab();
    return errors.length === 0;
  };

  const isLastTab = () => {
    return currentTab === 'settings';
  };

  const isFirstTab = () => {
    return currentTab === 'basic';
  };

  const getTabProgress = () => {
    const tabs = ['basic', 'details', 'requirements', 'scoring', 'settings'];
    const currentIndex = tabs.indexOf(currentTab);
    return ((currentIndex + 1) / tabs.length) * 100;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step{' '}
              {[
                'basic',
                'details',
                'requirements',
                'scoring',
                'settings'
              ].indexOf(currentTab) + 1}{' '}
              of 5
            </span>
            <span>{Math.round(getTabProgress())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getTabProgress()}%` }}></div>
          </div>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details for this job posting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Software Developer"
                    required
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyId">
                      Company <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.companyId}
                      onValueChange={handleCompanyChange}>
                      <SelectTrigger id="companyId">
                        <SelectValue placeholder="Select verified company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No verified companies available
                          </div>
                        ) : (
                          companies.map(company => (
                            <SelectItem key={company._id} value={company._id}>
                              <div className="flex items-center gap-2">
                                {company.name}
                                {company.isVerified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs">
                                    ✓ Verified
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {companies.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Only verified companies are shown
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={value =>
                        handleInputChange('categoryId', value)
                      }>
                      <SelectTrigger id="categoryId">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g. IT Department"
                      value={formData.department}
                      onChange={e =>
                        handleInputChange('department', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="Select a company to auto-fill location"
                      required
                      value={formData.location}
                      onChange={e =>
                        handleInputChange('location', e.target.value)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Auto-filled from company address. You can edit if
                      needed.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Posting Date <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      date={formData.postedDate}
                      onSelect={date => handleInputChange('postedDate', date)}
                      placeholder="Select posting date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Expiry Date <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      date={formData.expiryDate}
                      onSelect={date => handleInputChange('expiryDate', date)}
                      placeholder="Select expiry date"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employment-type">
                      Employment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={value =>
                        handleInputChange('employmentType', value)
                      }>
                      <SelectTrigger id="employment-type">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="positionCount">Number of Positions</Label>
                    <Input
                      id="positionCount"
                      type="number"
                      min="1"
                      value={formData.positionCount}
                      onChange={e =>
                        handleInputChange('positionCount', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Minimum Salary</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      placeholder="e.g. 30000"
                      value={formData.salaryMin}
                      onChange={e =>
                        handleInputChange('salaryMin', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Maximum Salary</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      placeholder="e.g. 45000"
                      value={formData.salaryMax}
                      onChange={e =>
                        handleInputChange('salaryMax', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryPeriod">Salary Period</Label>
                    <Select
                      value={formData.salaryPeriod}
                      onValueChange={value =>
                        handleInputChange('salaryPeriod', value)
                      }>
                      <SelectTrigger id="salaryPeriod">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Provide detailed information about the job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter job description"
                    className="min-h-[150px]"
                    required
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">
                    Responsibilities <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="responsibilities"
                    placeholder="Enter job responsibilities"
                    className="min-h-[150px]"
                    required
                    value={formData.responsibilities}
                    onChange={e =>
                      handleInputChange('responsibilities', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    placeholder="Enter job benefits"
                    className="min-h-[100px]"
                    value={formData.benefits}
                    onChange={e =>
                      handleInputChange('benefits', e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>Job Requirements</CardTitle>
                <CardDescription>
                  Specify the requirements for this position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education">
                    Education Requirements{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={value =>
                      handleInputChange('educationLevel', value)
                    }>
                    <SelectTrigger id="education">
                      <SelectValue placeholder="Select minimum education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">
                        High School Diploma
                      </SelectItem>
                      <SelectItem value="Associate">
                        Associate Degree
                      </SelectItem>
                      <SelectItem value="Bachelor">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="Master">Master's Degree</SelectItem>
                      <SelectItem value="Doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      Experience Level <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.experienceLevel}
                      onValueChange={value =>
                        handleInputChange('experienceLevel', value)
                      }>
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceYearsMin">
                      Minimum Years of Experience
                    </Label>
                    <Input
                      id="experienceYearsMin"
                      type="number"
                      min="0"
                      placeholder="e.g. 2"
                      value={formData.experienceYearsMin}
                      onChange={e =>
                        handleInputChange('experienceYearsMin', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">
                    Required Skills <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="Enter required skills (comma separated)"
                    className="min-h-[100px]"
                    required
                    value={
                      Array.isArray(formData.skills)
                        ? formData.skills.join(', ')
                        : formData.skills
                    }
                    onChange={e => handleSkillsChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility">
                    Required Eligibility/Certifications
                  </Label>
                  <Textarea
                    id="eligibility"
                    placeholder="Enter required eligibility or certifications (comma separated)"
                    className="min-h-[100px]"
                    value={
                      Array.isArray(formData.eligibility)
                        ? formData.eligibility.join(', ')
                        : formData.eligibility
                    }
                    onChange={e => handleEligibilityChange(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-blue-600" />
                  PDS Scoring Configuration
                </CardTitle>
                <CardDescription>
                  Choose how this job should evaluate applicants based on their
                  PDS (Personal Data Sheet)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scoring Mode Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Scoring Mode
                  </Label>
                  <div className="space-y-3">
                    {/* Option 1: Company Default */}
                    <div
                      className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        scoringMode === 'company'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleScoringModeChange('company')}>
                      <input
                        type="radio"
                        checked={scoringMode === 'company'}
                        onChange={() => handleScoringModeChange('company')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Use Company Default
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.companyId ? (
                            <>
                              Use scoring criteria from{' '}
                              <strong>
                                {
                                  companies.find(
                                    c => c._id === formData.companyId
                                  )?.name
                                }
                              </strong>
                              . Consistent with other jobs from this company.
                            </>
                          ) : (
                            'Select a company first to use their scoring criteria.'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Option 2: System Default */}
                    <div
                      className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        scoringMode === 'system'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleScoringModeChange('system')}>
                      <input
                        type="radio"
                        checked={scoringMode === 'system'}
                        onChange={() => handleScoringModeChange('system')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Use System Default
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use the platform's standard scoring criteria. Balanced
                          for general government and private sector positions.
                        </p>
                      </div>
                    </div>

                    {/* Option 3: Custom */}
                    <div
                      className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        scoringMode === 'custom'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleScoringModeChange('custom')}>
                      <input
                        type="radio"
                        checked={scoringMode === 'custom'}
                        onChange={() => handleScoringModeChange('custom')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Customize for This Job
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs text-amber-600 border-amber-600">
                            Advanced
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create custom scoring criteria specific to this job
                          post. Overrides company defaults.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show Custom Configuration Form only when Custom mode is selected */}
                {scoringMode === 'custom' && (
                  <div className="border-t pt-6">
                    <Alert className="mb-4 bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <strong>Custom Mode:</strong> Changes here will only
                        apply to this job post. The company's default scoring
                        will remain unchanged.
                      </AlertDescription>
                    </Alert>
                    <ScoringConfigForm
                      initialConfig={scoringConfig}
                      onSave={handleScoringConfigSave}
                      onCancel={() => {
                        // Reset to previous mode
                        const selectedCompany = companies.find(
                          c => c._id === formData.companyId
                        );
                        if (selectedCompany?.scoringConfig) {
                          handleScoringModeChange('company');
                        } else {
                          handleScoringModeChange('system');
                        }
                        toast({
                          title: 'Changes discarded',
                          description: 'Returned to previous scoring mode.'
                        });
                      }}
                      companyName={
                        companies.find(c => c._id === formData.companyId)
                          ?.name || 'This Job'
                      }
                      isJobLevel={true}
                      hasCustomConfig={scoringMode === 'custom'}
                    />
                  </div>
                )}

                {/* Preview for Company/System modes */}
                {scoringMode !== 'custom' && (
                  <div className="border-t pt-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Preview</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        {scoringMode === 'company'
                          ? "This job will use the company's scoring configuration shown below."
                          : 'This job will use the system default scoring configuration shown below.'}
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        {Object.entries(scoringConfig).map(
                          ([key, criterion]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between p-3 bg-white rounded border">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={criterion.enabled}
                                  disabled
                                />
                                <div>
                                  <div className="font-medium">
                                    {criterion.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {criterion.description}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-blue-600">
                                  {criterion.weight}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Max: {criterion.maxPoints}pts
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground italic mt-2">
                        ℹ️ To customize these values, select "Customize for This
                        Job" above.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Job Posting Settings</CardTitle>
                <CardDescription>
                  Configure additional settings for this job posting (all fields
                  are optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.isFeatured}
                      onCheckedChange={checked =>
                        handleInputChange('isFeatured', checked)
                      }
                    />
                    <Label htmlFor="featured">Mark as Featured Job</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={formData.isUrgent}
                      onCheckedChange={checked =>
                        handleInputChange('isUrgent', checked)
                      }
                    />
                    <Label htmlFor="urgent">Mark as Urgent Hiring</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote"
                      checked={formData.allowsRemote}
                      onCheckedChange={checked =>
                        handleInputChange('allowsRemote', checked)
                      }
                    />
                    <Label htmlFor="remote">Allow Remote Work</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application-email">Application Email</Label>
                  <Input
                    id="application-email"
                    type="email"
                    placeholder="e.g. careers@stotomas.gov.ph"
                    value={formData.applicationEmail}
                    onChange={e =>
                      handleInputChange('applicationEmail', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application-url">
                    External Application URL (Optional)
                  </Label>
                  <Input
                    id="application-url"
                    type="url"
                    placeholder="e.g. https://careers.stotomas.gov.ph/apply"
                    value={formData.applicationUrl}
                    onChange={e =>
                      handleInputChange('applicationUrl', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application-deadline">
                    Application Deadline
                  </Label>
                  <DatePicker
                    date={
                      formData.applicationDeadline
                        ? new Date(formData.applicationDeadline)
                        : undefined
                    }
                    onSelect={date =>
                      handleInputChange('applicationDeadline', date)
                    }
                    placeholder="Select application deadline"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isFirstTab() && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousTab}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}>
              Cancel
            </Button>

            {!isLastTab() ? (
              <Button
                type="button"
                onClick={handleNextTab}
                disabled={!canProceedToNext()}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Job Posting'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
