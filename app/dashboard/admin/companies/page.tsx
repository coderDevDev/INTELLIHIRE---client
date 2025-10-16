'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Shield,
  Settings,
  Upload,
  FileText,
  Eye,
  Download,
  Save
} from 'lucide-react';
import { companyAPI } from '@/lib/api-service';
import { toast } from 'sonner';
import { ScoringConfigForm } from '@/components/scoring-config-form';
import { ScoringCriteria } from '@/types/scoring.types';

interface Company {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  isGovernment?: boolean;
  isVerified?: boolean;
  verificationNotes?: string;
  verificationDate?: string;
  verificationDocuments?: string[];
  scoringConfig?: any;
  createdAt?: string;
}

interface CompanyFormData {
  name: string;
  description: string;
  logo: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  isGovernment: boolean;
  isVerified: boolean;
  verificationNotes: string;
  verificationDocuments: string[];
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isScoringDialogOpen, setIsScoringDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [scoringConfig, setScoringConfig] = useState<ScoringCriteria | null>(null);
  const [hasCustomConfig, setHasCustomConfig] = useState(false);
  const [companyScoringMode, setCompanyScoringMode] = useState<'custom' | 'system'>('custom');
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    logo: '',
    street: '',
    city: '',
    province: '',
    zipCode: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    isGovernment: false,
    isVerified: false,
    verificationNotes: '',
    verificationDocuments: []
  });
  
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Load companies
  useEffect(() => {
    loadCompanies();
  }, []);

  // Filter companies based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        company =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getCompanies();
      const companiesData = response.companies || response || [];
      setCompanies(companiesData);
      setFilteredCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (company?: Company) => {
    if (company) {
      // Edit mode
      setSelectedCompany(company);
      setFormData({
        name: company.name || '',
        description: company.description || '',
        logo: company.logo || '',
        street: company.address?.street || '',
        city: company.address?.city || '',
        province: company.address?.province || '',
        zipCode: company.address?.zipCode || '',
        contactEmail: company.contactEmail || '',
        contactPhone: company.contactPhone || '',
        website: company.website || '',
        isGovernment: company.isGovernment || false,
        isVerified: company.isVerified || false,
        verificationNotes: company.verificationNotes || '',
        verificationDocuments: company.verificationDocuments || []
      });
    } else {
      // Add mode
      setSelectedCompany(null);
      setFormData({
        name: '',
        description: '',
        logo: '',
        street: '',
        city: '',
        province: '',
        zipCode: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        isGovernment: false,
        isVerified: false,
        verificationNotes: '',
        verificationDocuments: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const companyData = {
        name: formData.name,
        description: formData.description,
        logo: formData.logo || undefined,
        address: {
          street: formData.street || undefined,
          city: formData.city || undefined,
          province: formData.province || undefined,
          zipCode: formData.zipCode || undefined
        },
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
        website: formData.website || undefined,
        isGovernment: formData.isGovernment,
        isVerified: formData.isVerified,
        verificationNotes: formData.verificationNotes || undefined,
        verificationDocuments: formData.verificationDocuments.length > 0 ? formData.verificationDocuments : undefined
      };

      if (selectedCompany) {
        // Update existing company
        await companyAPI.updateCompany(selectedCompany._id, companyData);
        toast.success('Company updated successfully');
      } else {
        // Create new company
        await companyAPI.createCompany(companyData);
        toast.success('Company created successfully');
      }

      setIsDialogOpen(false);
      loadCompanies();
    } catch (error: any) {
      console.error('Error saving company:', error);
      toast.error(error.response?.data?.message || 'Failed to save company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;

    try {
      await companyAPI.deleteCompany(selectedCompany._id);
      toast.success('Company deleted successfully');
      setIsDeleteDialogOpen(false);
      loadCompanies();
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(error.response?.data?.message || 'Failed to delete company');
    }
  };

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const openScoringDialog = async (company: Company) => {
    setSelectedCompany(company);
    try {
      // Use the dedicated scoring-config endpoint which returns DEFAULT_SCORING_CONFIG
      // when no custom config exists, ensuring users always see the complete template
      const response = await companyAPI.getScoringConfig(company._id);
      setScoringConfig(response.scoringConfig);
      setHasCustomConfig(response.hasCustomConfig || false);
      
      // Set mode based on whether company has custom config
      if (response.hasCustomConfig) {
        setCompanyScoringMode('custom');
      } else {
        setCompanyScoringMode('system');
      }
      
      setIsScoringDialogOpen(true);
    } catch (error) {
      console.error('Error loading scoring config:', error);
      toast.error('Failed to load scoring configuration');
    }
  };

  const handleCompanyScoringModeChange = (mode: 'custom' | 'system') => {
    setCompanyScoringMode(mode);
  };

  // Handle document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDoc(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit`);
          continue;
        }

        // Create FormData for upload
        const formDataUpload = new FormData();
        formDataUpload.append('document', file);

        // Upload to server
        const response = await companyAPI.uploadVerificationDocument(formDataUpload);
        if (response.url) {
          uploadedUrls.push(response.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          verificationDocuments: [...prev.verificationDocuments, ...uploadedUrls]
        }));
        toast.success(`${uploadedUrls.length} document(s) uploaded successfully`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload documents');
    } finally {
      setUploadingDoc(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Handle document removal
  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verificationDocuments: prev.verificationDocuments.filter((_, i) => i !== index)
    }));
    toast.success('Document removed');
  };

  const handleScoringSubmit = async (config: ScoringCriteria) => {
    if (!selectedCompany) return;

    try {
      if (companyScoringMode === 'system') {
        // Delete custom config to use system default
        try {
          await companyAPI.deleteScoringConfig(selectedCompany._id);
        } catch (deleteError: any) {
          // If company has no config, that's fine - they're already using system default
          if (deleteError.response?.status !== 404) {
            throw deleteError;
          }
        }
        toast.success('Company will now use system default scoring');
      } else {
        // Save custom config
        await companyAPI.updateScoringConfig(selectedCompany._id, config);
        toast.success('Scoring configuration updated successfully');
      }
      setIsScoringDialogOpen(false);
      loadCompanies();
    } catch (error: any) {
      console.error('Error saving scoring config:', error);
      toast.error(error.response?.data?.message || 'Failed to save scoring configuration');
    }
  };

  const handleUseSystemDefault = async () => {
    if (!selectedCompany) return;

    try {
      // Delete custom config to use system default
      try {
        await companyAPI.deleteScoringConfig(selectedCompany._id);
      } catch (deleteError: any) {
        // If company has no config to delete, that's okay - they'll use system default
        console.log('No custom config to delete, company will use system default');
      }
      
      toast.success('Company will now use system default scoring');
      setIsScoringDialogOpen(false);
      loadCompanies();
    } catch (error: any) {
      console.error('Error setting system default:', error);
      toast.error(error.response?.data?.message || 'Failed to set system default');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Company Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and organize company profiles
              </p>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {companies.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Government Agencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {companies.filter(c => c.isGovernment).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Private Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {companies.filter(c => !c.isGovernment).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {companies.filter(c => c.isVerified).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Companies</CardTitle>
                <CardDescription>
                  View and manage all registered companies
                </CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No companies found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map(company => (
                      <TableRow key={company._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {company.logo ? (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold">{company.name}</p>
                              {company.website && (
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  Website
                                </a>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {company.address?.city && company.address?.province ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              {company.address.city}, {company.address.province}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {company.contactEmail && (
                              <div className="flex items-center gap-1 text-xs">
                                <Mail className="h-3 w-3 text-gray-400" />
                                {company.contactEmail}
                              </div>
                            )}
                            {company.contactPhone && (
                              <div className="flex items-center gap-1 text-xs">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {company.contactPhone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={company.isGovernment ? 'default' : 'secondary'}>
                            {company.isGovernment ? 'Government' : 'Private'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {company.isVerified ? (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openScoringDialog(company)}
                              title="Configure PDS Scoring">
                              <Settings className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(company)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(company)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Company Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCompany ? 'Edit Company' : 'Add New Company'}
            </DialogTitle>
            <DialogDescription>
              {selectedCompany
                ? 'Update company information'
                : 'Fill in the details to create a new company'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., ABC Corporation"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description about the company"
                  rows={3}
                />
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  value={formData.logo}
                  onChange={e =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* Address Section */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Address</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={e =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={e =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={e =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      placeholder="Province"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={e =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      placeholder="Zip code"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Contact Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          contactEmail: e.target.value
                        })
                      }
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value
                        })
                      }
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={e =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://www.company.com"
                />
              </div>

              {/* Government Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isGovernment"
                  checked={formData.isGovernment}
                  onChange={e =>
                    setFormData({ ...formData, isGovernment: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isGovernment" className="cursor-pointer">
                  This is a government agency
                </Label>
              </div>

              <Separator className="my-4" />

              {/* Verification Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Verification
                </Label>

                {/* Verified Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isVerified" className="text-base cursor-pointer">
                      Verified Company
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Mark this company as verified. Only verified companies can post jobs.
                    </p>
                  </div>
                  <Switch
                    id="isVerified"
                    checked={formData.isVerified}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isVerified: checked })
                    }
                  />
                </div>

                {/* Verification Notes */}
                <div className="space-y-2">
                  <Label htmlFor="verificationNotes">
                    Verification Notes
                  </Label>
                  <Textarea
                    id="verificationNotes"
                    value={formData.verificationNotes}
                    onChange={e =>
                      setFormData({ ...formData, verificationNotes: e.target.value })
                    }
                    placeholder="Add notes about the verification process, documents reviewed, etc."
                    rows={3}
                  />
                </div>

                {/* Document Upload */}
                <div className="space-y-2">
                  <Label htmlFor="documents">
                    Verification Documents
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="documents"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor="documents"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm font-medium">
                        {uploadingDoc ? 'Uploading...' : 'Click to upload documents'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PDF, JPG, PNG, DOC (Max 5MB each)
                      </span>
                    </Label>
                  </div>

                  {/* Uploaded Documents List */}
                  {formData.verificationDocuments.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <Label className="text-sm font-medium">Uploaded Documents:</Label>
                      <div className="space-y-2">
                        {formData.verificationDocuments.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">
                                {doc.split('/').pop() || `Document ${index + 1}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(doc, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDocument(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : selectedCompany ? (
                  'Update Company'
                ) : (
                  'Create Company'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedCompany?.name}</strong>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Scoring Configuration Dialog */}
      <Dialog open={isScoringDialogOpen} onOpenChange={setIsScoringDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>PDS Scoring Configuration - {selectedCompany?.name}</DialogTitle>
            <DialogDescription>
              Choose how this company's jobs will evaluate applicants
            </DialogDescription>
          </DialogHeader>
          
          {scoringConfig !== null && (
            <div className="space-y-6">
              {/* Mode Selector */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Scoring Mode</Label>
                <div className="space-y-3">
                  {/* Option 1: Custom Configuration */}
                  <div
                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      companyScoringMode === 'custom'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleCompanyScoringModeChange('custom')}>
                    <input
                      type="radio"
                      checked={companyScoringMode === 'custom'}
                      onChange={() => handleCompanyScoringModeChange('custom')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Create Custom Configuration</span>
                        <Badge variant="secondary" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set company-wide scoring criteria that will be inherited by all jobs
                        from this company. Provides consistency across positions.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: System Default */}
                  <div
                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      companyScoringMode === 'system'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleCompanyScoringModeChange('system')}>
                    <input
                      type="radio"
                      checked={companyScoringMode === 'system'}
                      onChange={() => handleCompanyScoringModeChange('system')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Use System Default</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use the platform's standard scoring criteria. Balanced for general
                        government and private sector positions. Jobs can still customize
                        individually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Configuration Form */}
              {companyScoringMode === 'custom' && (
                <div className="border-t pt-6">
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Custom Mode:</strong> Configure company-wide defaults. All future
                      jobs will inherit these criteria unless customized at the job level.
                    </AlertDescription>
                  </Alert>
                  <ScoringConfigForm
                    initialConfig={scoringConfig}
                    onSave={handleScoringSubmit}
                    onCancel={() => setIsScoringDialogOpen(false)}
                    companyName={selectedCompany?.name}
                    hasCustomConfig={hasCustomConfig}
                  />
                </div>
              )}

              {/* System Default Preview */}
              {companyScoringMode === 'system' && (
                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Preview</Label>
                    <p className="text-sm text-muted-foreground">
                      This company will use the system default scoring configuration shown below.
                      Jobs can inherit this or customize individually.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      {Object.entries(scoringConfig).map(([key, criterion]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center gap-3">
                            <Checkbox checked={criterion.enabled} disabled />
                            <div>
                              <div className="font-medium">{criterion.label}</div>
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
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsScoringDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUseSystemDefault}>
                        <Save className="h-4 w-4 mr-2" />
                        Use System Default
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
