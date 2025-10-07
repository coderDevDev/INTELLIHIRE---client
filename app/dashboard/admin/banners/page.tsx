'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Image as NextImage,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Link,
  Target,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
  Search,
  CheckSquare,
  Square,
  X,
  Copy,
  History,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { bannerAPI } from '@/lib/api/bannerAPI';
import { bannerTemplateAPI } from '@/lib/api/bannerTemplateAPI';
import { bannerCategoryAPI } from '@/lib/api/bannerCategoryAPI';
import { bannerTagAPI } from '@/lib/api/bannerTagAPI';
import { BannerAnalyticsDashboard } from '@/components/banner-analytics-dashboard';
import { BannerPreview, ABTestManager } from '@/components/banner-preview-ab';
import {
  validateBannerForm,
  bannerFormSchemaRH,
  type BannerFormData,
  type BannerFormDataRH
} from '@/lib/validations/bannerValidation';

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  status: 'active' | 'inactive' | 'scheduled';
  priority: number;
  startDate?: string;
  endDate?: string;
  startDateTime?: string;
  endDateTime?: string;
  timezone?: string;
  recurring?: boolean;
  recurringPattern?: 'none' | 'daily' | 'weekly' | 'monthly';
  category?: string;
  tags?: string[];
  targetAudience: 'all' | 'applicants' | 'employers' | 'admin';
  clicks: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

interface BannerTemplate {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateData: {
    title: string;
    description: string;
    imageUrl: string;
    linkUrl?: string;
    position: string;
    priority: number;
    targetAudience: string;
  };
  usageCount: number;
  createdAt: string;
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [templates, setTemplates] = useState<BannerTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage');

  // Banner form state - using react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<BannerFormDataRH>({
    resolver: zodResolver(bannerFormSchemaRH),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'top',
      priority: 1,
      targetAudience: 'all',
      category: '',
      tags: [],
      startDate: '',
      endDate: '',
      startDateTime: '',
      endDateTime: '',
      timezone: 'UTC',
      recurring: false,
      recurringPattern: 'none',
      status: 'active'
    }
  });

  // Watch form values for real-time updates
  const watchedValues = watch();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Bulk operations state
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [audienceFilter, setAudienceFilter] = useState<string>('');

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Preview and A/B Testing state
  const [previewBannerData, setPreviewBannerData] = useState<Banner | null>(
    null
  );
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showABTestModal, setShowABTestModal] = useState(false);

  // Edit banner state
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<BannerFormData>({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'top',
    status: 'active',
    priority: 1,
    targetAudience: 'all',
    category: '',
    tags: [],
    startDate: '',
    endDate: '',
    startDateTime: '',
    endDateTime: '',
    timezone: 'UTC',
    recurring: false,
    recurringPattern: 'none'
  });
  const [editTagsInput, setEditTagsInput] = useState('');

  // Scheduling state
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedulingBanner, setSchedulingBanner] = useState<Banner | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    recurring: false,
    recurringPattern: 'none' as 'none' | 'daily' | 'weekly' | 'monthly'
  });

  // Categories and Tags state
  const [categories, setCategories] = useState<
    Array<{ _id: string; name: string; color?: string }>
  >([]);
  const [availableTags, setAvailableTags] = useState<
    Array<{ _id: string; name: string; color?: string }>
  >([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');

  // Form validation state
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>(
    {}
  );

  // View mode state
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Duplication and Versioning state
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versioningBanner, setVersioningBanner] = useState<Banner | null>(null);
  const [bannerVersions, setBannerVersions] = useState<Banner[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicatingBanner, setDuplicatingBanner] = useState<Banner | null>(
    null
  );

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      setLoading(true);

      // Fetch banners, templates, categories, and tags in parallel
      const [
        bannersResponse,
        templatesResponse,
        categoriesResponse,
        tagsResponse
      ] = await Promise.all([
        bannerAPI.getBanners(),
        bannerTemplateAPI.getTemplates(),
        bannerCategoryAPI.getCategories(),
        bannerTagAPI.getTags()
      ]);

      setBanners(bannersResponse.data.docs || []);
      setTemplates(templatesResponse.data.docs || []);
      setCategories(categoriesResponse.data || []);
      setAvailableTags(tagsResponse.data || []);
    } catch (error) {
      console.error('Error fetching banner data:', error);
      toast.error('Failed to load banner data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.'
      );
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setUploadingImage(true);

    try {
      const response = await bannerAPI.uploadBannerImage(file);
      setValue('imageUrl', response.data.imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const createBanner = async (data: BannerFormDataRH) => {
    try {
      const bannerData = {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || undefined,
        position: data.position,
        priority: data.priority,
        targetAudience: data.targetAudience,
        category: data.category || undefined,
        tags: data.tags.length > 0 ? data.tags : undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        startDateTime: data.startDateTime || undefined,
        endDateTime: data.endDateTime || undefined,
        timezone: data.timezone,
        recurring: data.recurring,
        recurringPattern: data.recurringPattern,
        status: 'active' // Default status for new banners
      };

      const response = await bannerAPI.createBanner(bannerData);

      // Add the new banner to the list
      setBanners(prev => [response.data, ...prev]);

      // Reset form
      reset();
      setImageFile(null);
      toast.success('Banner created successfully');
    } catch (error) {
      console.error('Error creating banner:', error);
      toast.error('Failed to create banner');
    }
  };

  const toggleBannerStatus = async (bannerId: string) => {
    try {
      const banner = banners.find(b => b._id === bannerId);
      if (!banner) return;

      const newStatus = banner.status === 'active' ? 'inactive' : 'active';
      await bannerAPI.updateBannerStatus(bannerId, newStatus);

      setBanners(prev =>
        prev.map(b =>
          b._id === bannerId
            ? { ...b, status: newStatus, updatedAt: new Date().toISOString() }
            : b
        )
      );

      toast.success('Banner status updated');
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast.error('Failed to update banner status');
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerAPI.deleteBanner(bannerId);
        setBanners(prev => prev.filter(banner => banner._id !== bannerId));
        toast.success('Banner deleted successfully');
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast.error('Failed to delete banner');
      }
    }
  };

  // Edit banner functions
  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setEditFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      position: banner.position,
      status: banner.status,
      priority: banner.priority,
      targetAudience: banner.targetAudience,
      category: banner.category || '',
      tags: banner.tags || [],
      startDate: banner.startDate
        ? new Date(banner.startDate).toISOString().split('T')[0]
        : '',
      endDate: banner.endDate
        ? new Date(banner.endDate).toISOString().split('T')[0]
        : '',
      startDateTime: banner.startDateTime || '',
      endDateTime: banner.endDateTime || '',
      timezone: banner.timezone || 'UTC',
      recurring: banner.recurring || false,
      recurringPattern: banner.recurringPattern || 'none'
    });
    setEditTagsInput(banner.tags ? banner.tags.join(', ') : '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingBanner(null);
    setEditFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'top',
      status: 'active',
      priority: 1,
      targetAudience: 'all',
      category: '',
      tags: [],
      startDate: '',
      endDate: '',
      startDateTime: '',
      endDateTime: '',
      timezone: 'UTC',
      recurring: false,
      recurringPattern: 'none'
    });
    setEditTagsInput('');
  };

  const updateBanner = async () => {
    try {
      // Prepare validation data with proper types
      const validationData = {
        ...editFormData,
        tags: editTagsInput
          ? editTagsInput
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag)
          : []
      };

      // Validate form data
      const validation = validateBannerForm(validationData);
      if (!validation.success) {
        toast.error(validation.errors?.[0] || 'Validation failed');
        return;
      }

      // Prepare update data
      const updateData: any = {
        ...editFormData,
        tags: editTagsInput
          ? editTagsInput
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag)
          : [],
        startDate: editFormData.startDate
          ? new Date(editFormData.startDate).toISOString()
          : undefined,
        endDate: editFormData.endDate
          ? new Date(editFormData.endDate).toISOString()
          : undefined
      };

      // Remove empty fields
      Object.keys(updateData).forEach(key => {
        if (
          updateData[key] === '' ||
          updateData[key] === null ||
          updateData[key] === undefined
        ) {
          delete updateData[key];
        }
      });

      await bannerAPI.updateBanner(editingBanner!._id, updateData);

      // Update local state
      setBanners(prev =>
        prev.map(banner =>
          banner._id === editingBanner!._id
            ? ({
                ...banner,
                ...updateData,
                updatedAt: new Date().toISOString()
              } as Banner)
            : banner
        )
      );

      toast.success('Banner updated successfully');
      closeEditModal();
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Failed to update banner');
    }
  };

  const handleEditImageUpload = async (file: File) => {
    try {
      const response = await bannerAPI.uploadBannerImage(file);
      setEditFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  // Bulk operations
  const handleBulkAction = async () => {
    if (selectedBanners.length === 0) {
      toast.error('Please select banners to perform bulk action');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select a bulk action');
      return;
    }

    try {
      const promises = selectedBanners.map(bannerId => {
        switch (bulkAction) {
          case 'activate':
            return bannerAPI.updateBannerStatus(bannerId, 'active');
          case 'deactivate':
            return bannerAPI.updateBannerStatus(bannerId, 'inactive');
          case 'delete':
            return bannerAPI.deleteBanner(bannerId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);

      // Update local state
      if (bulkAction === 'delete') {
        setBanners(prev =>
          prev.filter(banner => !selectedBanners.includes(banner._id))
        );
      } else {
        setBanners(prev =>
          prev.map(banner =>
            selectedBanners.includes(banner._id)
              ? {
                  ...banner,
                  status: bulkAction === 'activate' ? 'active' : 'inactive',
                  updatedAt: new Date().toISOString()
                }
              : banner
          )
        );
      }

      setSelectedBanners([]);
      setBulkAction('');
      setShowBulkActions(false);
      toast.success(`Bulk ${bulkAction} completed successfully`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const toggleBannerSelection = (bannerId: string) => {
    setSelectedBanners(prev =>
      prev.includes(bannerId)
        ? prev.filter(id => id !== bannerId)
        : [...prev, bannerId]
    );
  };

  const selectAllBanners = () => {
    if (selectedBanners.length === banners.length) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(banners.map(banner => banner._id));
    }
  };

  // Template operations
  const createBannerFromTemplate = async (template: any) => {
    try {
      const response = await bannerTemplateAPI.createBannerFromTemplate(
        template._id
      );
      setBanners(prev => [response.data, ...prev]);
      setShowTemplateModal(false);
      setSelectedTemplate(null);
      toast.success('Banner created from template successfully');
    } catch (error) {
      console.error('Error creating banner from template:', error);
      toast.error('Failed to create banner from template');
    }
  };

  // Filtered banners based on search and filters
  const filteredBanners = banners.filter(banner => {
    const matchesSearch =
      !searchTerm ||
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || banner.status === statusFilter;
    const matchesPosition =
      !positionFilter || banner.position === positionFilter;
    const matchesAudience =
      !audienceFilter || banner.targetAudience === audienceFilter;
    const matchesCategory =
      !categoryFilter || banner.category === categoryFilter;
    const matchesTag =
      !tagFilter || (banner.tags && banner.tags.includes(tagFilter));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPosition &&
      matchesAudience &&
      matchesCategory &&
      matchesTag
    );
  });

  // Preview and A/B Testing functions
  const openPreview = (banner: Banner) => {
    setPreviewBannerData(banner);
    setShowPreviewModal(true);
  };

  const closePreview = () => {
    setPreviewBannerData(null);
    setShowPreviewModal(false);
  };

  const startABTest = (bannerIds: string[]) => {
    console.log('Starting A/B test with banners:', bannerIds);
    toast.success('A/B test started successfully');
    setShowABTestModal(false);
  };

  const stopABTest = () => {
    console.log('Stopping A/B test');
    toast.success('A/B test stopped successfully');
  };

  // Scheduling functions
  const openSchedulingModal = (banner: Banner) => {
    setSchedulingBanner(banner);
    setScheduleForm({
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      startTime: banner.startDateTime
        ? banner.startDateTime.split('T')[1]?.substring(0, 5)
        : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
      endTime: banner.endDateTime
        ? banner.endDateTime.split('T')[1]?.substring(0, 5)
        : '',
      timezone:
        banner.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      recurring: banner.recurring || false,
      recurringPattern: banner.recurringPattern || 'none'
    });
    setShowSchedulingModal(true);
  };

  const closeSchedulingModal = () => {
    setSchedulingBanner(null);
    setShowSchedulingModal(false);
    setScheduleForm({
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      recurring: false,
      recurringPattern: 'none'
    });
  };

  const saveSchedule = async () => {
    if (!schedulingBanner) return;

    try {
      const startDateTime =
        scheduleForm.startDate && scheduleForm.startTime
          ? `${scheduleForm.startDate}T${scheduleForm.startTime}:00`
          : undefined;
      const endDateTime =
        scheduleForm.endDate && scheduleForm.endTime
          ? `${scheduleForm.endDate}T${scheduleForm.endTime}:00`
          : undefined;

      const scheduleData = {
        startDateTime,
        endDateTime,
        timezone: scheduleForm.timezone,
        recurring: scheduleForm.recurring,
        recurringPattern: scheduleForm.recurringPattern,
        status: 'scheduled'
      };

      await bannerAPI.updateBanner(schedulingBanner._id, scheduleData);

      setBanners(prev =>
        prev.map(banner =>
          banner._id === schedulingBanner._id
            ? {
                ...banner,
                ...scheduleData,
                status: 'scheduled',
                updatedAt: new Date().toISOString()
              }
            : banner
        )
      );

      closeSchedulingModal();
      toast.success('Banner schedule updated successfully');
    } catch (error) {
      console.error('Error updating banner schedule:', error);
      toast.error('Failed to update banner schedule');
    }
  };

  const getTimezoneOptions = () => {
    const timezones = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Kolkata',
      'Australia/Sydney',
      'Pacific/Auckland'
    ];
    return timezones;
  };

  const formatScheduleInfo = (banner: Banner) => {
    if (!banner.startDateTime && !banner.endDateTime) return null;

    const start = banner.startDateTime
      ? new Date(banner.startDateTime).toLocaleString()
      : 'Not set';
    const end = banner.endDateTime
      ? new Date(banner.endDateTime).toLocaleString()
      : 'Not set';
    const timezone = banner.timezone || 'UTC';

    return {
      start,
      end,
      timezone,
      recurring: banner.recurring ? ` (${banner.recurringPattern})` : ''
    };
  };

  // Categories and Tags functions
  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const response = await bannerCategoryAPI.createCategory({
        name: newCategory.trim(),
        description: '',
        color: '#3B82F6'
      });

      setCategories(prev => [...prev, response.data]);
      setNewCategory('');
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const removeCategory = async (categoryId: string) => {
    try {
      await bannerCategoryAPI.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c._id !== categoryId));
      toast.success('Category removed successfully');
    } catch (error) {
      console.error('Error removing category:', error);
      toast.error('Failed to remove category');
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    try {
      const response = await bannerTagAPI.createTag({
        name: newTag.trim(),
        description: '',
        color: '#6B7280'
      });

      setAvailableTags(prev => [...prev, response.data]);
      setNewTag('');
      toast.success('Tag added successfully');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      await bannerTagAPI.deleteTag(tagId);
      setAvailableTags(prev => prev.filter(t => t._id !== tagId));
      toast.success('Tag removed successfully');
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    if (category?.color) {
      return `bg-[${category.color}]20 text-[${category.color}]`;
    }
    return 'bg-blue-100 text-blue-700';
  };

  // Duplication and Versioning functions
  const duplicateBanner = async (banner: Banner) => {
    try {
      const duplicatedData = {
        title: `${banner.title} (Copy)`,
        description: banner.description,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        position: banner.position,
        priority: banner.priority,
        startDate: banner.startDate,
        endDate: banner.endDate,
        startDateTime: banner.startDateTime,
        endDateTime: banner.endDateTime,
        timezone: banner.timezone,
        recurring: banner.recurring,
        recurringPattern: banner.recurringPattern,
        category: banner.category,
        tags: banner.tags,
        targetAudience: banner.targetAudience,
        status: 'inactive' // Duplicated banners start as inactive
      };

      const response = await bannerAPI.createBanner(duplicatedData);
      setBanners(prev => [response.data, ...prev]);
      setShowDuplicateModal(false);
      setDuplicatingBanner(null);
      toast.success('Banner duplicated successfully');
    } catch (error) {
      console.error('Error duplicating banner:', error);
      toast.error('Failed to duplicate banner');
    }
  };

  const openDuplicateModal = (banner: Banner) => {
    setDuplicatingBanner(banner);
    setShowDuplicateModal(true);
  };

  const closeDuplicateModal = () => {
    setDuplicatingBanner(null);
    setShowDuplicateModal(false);
  };

  const openVersionModal = async (banner: Banner) => {
    setVersioningBanner(banner);
    try {
      // In a real app, you would fetch versions from the API
      // For now, we'll simulate with the current banner
      setBannerVersions([banner]);
      setShowVersionModal(true);
    } catch (error) {
      console.error('Error fetching banner versions:', error);
      toast.error('Failed to load banner versions');
    }
  };

  const closeVersionModal = () => {
    setVersioningBanner(null);
    setBannerVersions([]);
    setShowVersionModal(false);
  };

  const restoreVersion = async (version: Banner) => {
    if (!versioningBanner) return;

    try {
      const restoreData = {
        title: version.title,
        description: version.description,
        imageUrl: version.imageUrl,
        linkUrl: version.linkUrl,
        position: version.position,
        priority: version.priority,
        startDate: version.startDate,
        endDate: version.endDate,
        startDateTime: version.startDateTime,
        endDateTime: version.endDateTime,
        timezone: version.timezone,
        recurring: version.recurring,
        recurringPattern: version.recurringPattern,
        category: version.category,
        tags: version.tags,
        targetAudience: version.targetAudience
      };

      await bannerAPI.updateBanner(versioningBanner._id, restoreData);

      setBanners(prev =>
        prev.map(banner =>
          banner._id === versioningBanner._id
            ? { ...banner, ...restoreData, updatedAt: new Date().toISOString() }
            : banner
        )
      );

      closeVersionModal();
      toast.success('Banner version restored successfully');
    } catch (error) {
      console.error('Error restoring banner version:', error);
      toast.error('Failed to restore banner version');
    }
  };

  // Preview function
  const previewBanner = () => {
    const previewData = {
      _id: 'preview',
      title: watchedValues.title,
      description: watchedValues.description,
      imageUrl: watchedValues.imageUrl || '/api/placeholder/800/200',
      linkUrl: watchedValues.linkUrl,
      position: watchedValues.position,
      priority: watchedValues.priority,
      targetAudience: watchedValues.targetAudience,
      category: watchedValues.category,
      tags: watchedValues.tags,
      status: 'active' as any,
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPreviewBannerData(previewData);
    setShowPreviewModal(true);
  };

  const getVersionStatus = (version: Banner) => {
    if (version._id === versioningBanner?._id) return 'current';
    return 'archived';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'top':
        return <Monitor className="h-4 w-4" />;
      case 'middle':
        return <Tablet className="h-4 w-4" />;
      case 'bottom':
        return <Smartphone className="h-4 w-4" />;
      case 'sidebar':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}></div>
          <div
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading banner data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg relative z-10">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Banner Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage and oversee all promotional banners
              </p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            onClick={() => setActiveTab('create')}>
            <Plus className="mr-2 h-4 w-4" /> Create Banner
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative z-10">
        <div className="container px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Banners
                </CardTitle>
                <Image className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {banners.length}
                </div>
                <p className="text-xs text-blue-600">All banners</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Active Banners
                </CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {banners.filter(b => b.status === 'active').length}
                </div>
                <p className="text-xs text-green-600">Currently showing</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Clicks
                </CardTitle>
                <Target className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {banners.reduce((sum, b) => sum + b.clicks, 0)}
                </div>
                <p className="text-xs text-purple-600">All time clicks</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Avg CTR
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {(() => {
                    const totalClicks = banners.reduce(
                      (sum, b) => sum + b.clicks,
                      0
                    );
                    const totalImpressions = banners.reduce(
                      (sum, b) => sum + b.impressions,
                      0
                    );
                    return calculateCTR(totalClicks, totalImpressions);
                  })()}
                  %
                </div>
                <p className="text-xs text-orange-600">Click-through rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Banner Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm border border-white/50">
              <TabsTrigger
                value="manage"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Manage
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Create
              </TabsTrigger>
              {/* <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Analytics
              </TabsTrigger> */}
            </TabsList>

            {/* Manage Tab */}
            <TabsContent value="manage" className="space-y-6">
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-blue-600" />
                    Manage Banners
                  </CardTitle>
                  <CardDescription>
                    Create, edit, and manage promotional banners for the
                    platform.{' '}
                    <span className="font-semibold text-blue-600">
                      Total: {banners.length} banners
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col gap-4 mb-8">
                    {/* Search and Actions */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search banners..."
                          className="w-full pl-8 rounded-xl border border-white/50 bg-white/60 backdrop-blur-sm shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus:bg-white/80 transition-all duration-300"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-white/50">
                          <Button
                            variant={viewMode === 'cards' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('cards')}
                            className={`p-2 h-auto ${
                              viewMode === 'cards'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'hover:bg-white/80'
                            }`}>
                            <div className="grid grid-cols-2 gap-0.5">
                              <div className="w-1 h-1 bg-current rounded-sm"></div>
                              <div className="w-1 h-1 bg-current rounded-sm"></div>
                              <div className="w-1 h-1 bg-current rounded-sm"></div>
                              <div className="w-1 h-1 bg-current rounded-sm"></div>
                            </div>
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`p-2 h-auto ${
                              viewMode === 'list'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'hover:bg-white/80'
                            }`}>
                            <div className="flex flex-col gap-0.5">
                              <div className="w-3 h-0.5 bg-current rounded-sm"></div>
                              <div className="w-3 h-0.5 bg-current rounded-sm"></div>
                              <div className="w-3 h-0.5 bg-current rounded-sm"></div>
                            </div>
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchBannerData}
                          className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowTemplateModal(true)}
                          className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                          <FileText className="mr-2 h-4 w-4" />
                          Templates
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCategoryModal(true)}
                          className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Categories
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowTagModal(true)}
                          className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                          <Target className="mr-2 h-4 w-4" />
                          Tags
                        </Button>
                      </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-4 items-center rounded-xl bg-white/40 backdrop-blur-sm p-4 border border-white/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Filters:
                        </span>
                      </div>

                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-[150px] px-3 py-2 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm text-sm hover:bg-white/80 transition-all duration-300">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="inactive">Inactive</option>
                      </select>

                      <select
                        value={positionFilter}
                        onChange={e => setPositionFilter(e.target.value)}
                        className="w-[150px] px-3 py-2 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm text-sm hover:bg-white/80 transition-all duration-300">
                        <option value="">All Positions</option>
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                        <option value="sidebar">Sidebar</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-[180px] px-3 py-2 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm text-sm hover:bg-white/80 transition-all duration-300">
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={tagFilter}
                        onChange={e => setTagFilter(e.target.value)}
                        className="w-[150px] px-3 py-2 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm text-sm hover:bg-white/80 transition-all duration-300">
                        <option value="">All Tags</option>
                        {availableTags.map(tag => (
                          <option key={tag._id} value={tag.name}>
                            {tag.name}
                          </option>
                        ))}
                      </select>

                      {/* Clear Filters */}
                      {(statusFilter ||
                        positionFilter ||
                        categoryFilter ||
                        tagFilter) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setStatusFilter('');
                            setPositionFilter('');
                            setCategoryFilter('');
                            setTagFilter('');
                          }}
                          className="text-gray-500 hover:text-gray-700">
                          <X className="h-4 w-4 mr-1" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Banner List */}
                  <div className="space-y-4">
                    {filteredBanners.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-white/50 shadow-lg">
                          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <Image className="h-12 w-12 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No banners found
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {searchTerm ||
                            statusFilter ||
                            positionFilter ||
                            categoryFilter ||
                            tagFilter
                              ? 'Try adjusting your filters or search terms'
                              : 'Create your first banner to get started'}
                          </p>
                          {!searchTerm &&
                            !statusFilter &&
                            !positionFilter &&
                            !categoryFilter &&
                            !tagFilter && (
                              <Button
                                onClick={() => setActiveTab('create')}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Banner
                              </Button>
                            )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Bulk Actions */}
                        {selectedBanners.length > 0 && (
                          <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/80 backdrop-blur-sm">
                            <span className="text-sm font-medium text-blue-900">
                              {selectedBanners.length} banner
                              {selectedBanners.length > 1 ? 's' : ''} selected
                            </span>
                            <select
                              value={bulkAction}
                              onChange={e => setBulkAction(e.target.value)}
                              className="px-3 py-1 rounded-lg border border-blue-300 bg-white text-sm">
                              <option value="">Select Action</option>
                              <option value="activate">Activate</option>
                              <option value="deactivate">Deactivate</option>
                              <option value="delete">Delete</option>
                            </select>
                            <Button
                              size="sm"
                              onClick={handleBulkAction}
                              disabled={!bulkAction}
                              className="bg-blue-600 hover:bg-blue-700">
                              Apply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBanners([])}
                              className="border-blue-300 text-blue-700">
                              Cancel
                            </Button>
                          </div>
                        )}

                        {/* Select All */}
                        <div className="flex items-center gap-2 pb-2 border-b border-white/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectAllBanners}
                            className="p-1 h-auto">
                            {selectedBanners.length ===
                            filteredBanners.length ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <span className="text-sm text-gray-600">
                            Select all ({filteredBanners.length})
                          </span>
                        </div>

                        {/* Cards View */}
                        {viewMode === 'cards' && (
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredBanners.map(banner => (
                              <Card
                                key={banner._id}
                                className="group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-2 overflow-hidden">
                                {/* Selection Checkbox */}
                                <div className="absolute top-3 left-3 z-10">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      toggleBannerSelection(banner._id)
                                    }
                                    className="p-1 h-auto bg-white/80 backdrop-blur-sm hover:bg-white/90">
                                    {selectedBanners.includes(banner._id) ? (
                                      <CheckSquare className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <Square className="h-4 w-4 text-gray-400" />
                                    )}
                                  </Button>
                                </div>

                                {/* Banner Image */}
                                <div className="relative h-48 overflow-hidden">
                                  <img
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  {/* Gradient Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                  {/* Status Badge */}
                                  <div className="absolute top-3 right-3">
                                    <Badge
                                      className={`text-xs px-3 py-1 backdrop-blur-sm ${getStatusColor(
                                        banner.status
                                      )}`}>
                                      {getStatusIcon(banner.status)}
                                      {banner.status.charAt(0).toUpperCase() +
                                        banner.status.slice(1)}
                                    </Badge>
                                  </div>

                                  {/* Position Badge */}
                                  <div className="absolute bottom-3 left-3">
                                    <Badge className="bg-blue-500/90 text-white text-xs px-3 py-1 backdrop-blur-sm">
                                      {getPositionIcon(banner.position)}
                                      {banner.position}
                                    </Badge>
                                  </div>

                                  {/* Quick Actions Overlay */}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openPreview(banner)}
                                      className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white">
                                      <Eye className="h-4 w-4 mr-1" />
                                      Preview
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditModal(banner)}
                                      className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white">
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        toggleBannerStatus(banner._id)
                                      }
                                      className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {banner.status === 'active'
                                        ? 'Deactivate'
                                        : 'Activate'}
                                    </Button>
                                  </div>
                                </div>

                                {/* Card Content */}
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    {/* Title and Description */}
                                    <div>
                                      <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                        {banner.title}
                                      </h4>
                                      <p className="text-sm text-gray-600 line-clamp-3">
                                        {banner.description}
                                      </p>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                          <Target className="h-4 w-4 text-purple-600" />
                                          <span className="text-gray-600">
                                            {banner.clicks}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Eye className="h-4 w-4 text-blue-600" />
                                          <span className="text-gray-600">
                                            {banner.impressions}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <TrendingUp className="h-4 w-4 text-green-600" />
                                          <span className="text-gray-600">
                                            {calculateCTR(
                                              banner.clicks,
                                              banner.impressions
                                            )}
                                            %
                                          </span>
                                        </div>
                                      </div>
                                      <Badge className="bg-gray-100 text-gray-700 text-xs">
                                        Priority {banner.priority}
                                      </Badge>
                                    </div>

                                    {/* Tags */}
                                    {banner.tags && banner.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {banner.tags.slice(0, 3).map(tag => (
                                          <Badge
                                            key={tag}
                                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {banner.tags.length > 3 && (
                                          <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-1">
                                            +{banner.tags.length - 3}
                                          </Badge>
                                        )}
                                      </div>
                                    )}

                                    {/* Category */}
                                    {banner.category && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                          Category:
                                        </span>
                                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                                          {banner.category}
                                        </Badge>
                                      </div>
                                    )}

                                    {/* Schedule Info */}
                                    {banner.status === 'scheduled' &&
                                      (() => {
                                        const scheduleInfo =
                                          formatScheduleInfo(banner);
                                        return scheduleInfo ? (
                                          <div className="bg-blue-50/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Calendar className="h-4 w-4 text-blue-600" />
                                              <span className="text-sm font-medium text-blue-900">
                                                Scheduled
                                              </span>
                                            </div>
                                            <div className="text-xs text-blue-700">
                                              <div>
                                                Start: {scheduleInfo.start}
                                              </div>
                                              <div>End: {scheduleInfo.end}</div>
                                              {scheduleInfo.recurring && (
                                                <div>
                                                  Recurring:{' '}
                                                  {scheduleInfo.recurring}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ) : null;
                                      })()}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                      <div className="text-xs text-gray-500">
                                        Created {formatDate(banner.createdAt)}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            openSchedulingModal(banner)
                                          }
                                          className="p-1 h-auto hover:bg-blue-50">
                                          <Calendar className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            openDuplicateModal(banner)
                                          }
                                          className="p-1 h-auto hover:bg-green-50">
                                          <Copy className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            openVersionModal(banner)
                                          }
                                          className="p-1 h-auto hover:bg-purple-50">
                                          <History className="h-4 w-4 text-purple-600" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            deleteBanner(banner._id)
                                          }
                                          className="p-1 h-auto hover:bg-red-50">
                                          <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                          <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/50 shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50/50 border-b border-white/50">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={selectAllBanners}
                                        className="p-1 h-auto">
                                        {selectedBanners.length ===
                                        filteredBanners.length ? (
                                          <CheckSquare className="h-4 w-4 text-blue-600" />
                                        ) : (
                                          <Square className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Banner
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Position
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Performance
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Priority
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Created
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/50">
                                  {filteredBanners.map(banner => (
                                    <tr
                                      key={banner._id}
                                      className="hover:bg-white/60 transition-colors duration-200">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            toggleBannerSelection(banner._id)
                                          }
                                          className="p-1 h-auto">
                                          {selectedBanners.includes(
                                            banner._id
                                          ) ? (
                                            <CheckSquare className="h-4 w-4 text-blue-600" />
                                          ) : (
                                            <Square className="h-4 w-4 text-gray-400" />
                                          )}
                                        </Button>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                                            <img
                                              src={banner.imageUrl}
                                              alt={banner.title}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                              {banner.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 truncate max-w-xs">
                                              {banner.description}
                                            </p>
                                            {banner.category && (
                                              <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">
                                                {banner.category}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                          className={`text-xs ${getStatusColor(
                                            banner.status
                                          )}`}>
                                          {getStatusIcon(banner.status)}
                                          {banner.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            banner.status.slice(1)}
                                        </Badge>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                                          {getPositionIcon(banner.position)}
                                          {banner.position}
                                        </Badge>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4 text-sm">
                                          <div className="flex items-center gap-1">
                                            <Target className="h-4 w-4 text-purple-600" />
                                            <span className="text-gray-600">
                                              {banner.clicks}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                            <span className="text-gray-600">
                                              {banner.impressions}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                            <span className="text-gray-600">
                                              {calculateCTR(
                                                banner.clicks,
                                                banner.impressions
                                              )}
                                              %
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                                          {banner.priority}
                                        </Badge>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(banner.createdAt)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openPreview(banner)}
                                            className="p-1 h-auto hover:bg-blue-50">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              openSchedulingModal(banner)
                                            }
                                            className="p-1 h-auto hover:bg-blue-50">
                                            <Calendar className="h-4 w-4 text-blue-600" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              openDuplicateModal(banner)
                                            }
                                            className="p-1 h-auto hover:bg-green-50">
                                            <Copy className="h-4 w-4 text-green-600" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              openEditModal(banner)
                                            }
                                            className="p-1 h-auto hover:bg-blue-50">
                                            <Edit className="h-4 w-4 text-blue-600" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              toggleBannerStatus(banner._id)
                                            }
                                            className="p-1 h-auto hover:bg-yellow-50">
                                            <CheckCircle className="h-4 w-4 text-yellow-600" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              deleteBanner(banner._id)
                                            }
                                            className="p-1 h-auto hover:bg-red-50">
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-blue-600" />
                    New Banner
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below to create a new promotional banner.
                    All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          Banner Title <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name="title"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter banner title"
                              className={
                                errors.title
                                  ? 'border-red-500 focus:border-red-500'
                                  : ''
                              }
                            />
                          )}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkUrl">Link URL</Label>
                        <Controller
                          name="linkUrl"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="https://example.com"
                              className={
                                errors.linkUrl
                                  ? 'border-red-500 focus:border-red-500'
                                  : ''
                              }
                            />
                          )}
                        />
                        {errors.linkUrl && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.linkUrl.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            placeholder="Enter banner description"
                            className={
                              errors.description
                                ? 'border-red-500 focus:border-red-500'
                                : ''
                            }
                            rows={3}
                          />
                        )}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">
                        Banner Image <span className="text-red-500">*</span>
                      </Label>
                      <div className="space-y-3">
                        <Controller
                          name="imageUrl"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="https://example.com/image.jpg"
                              className={
                                errors.imageUrl
                                  ? 'border-red-500 focus:border-red-500'
                                  : ''
                              }
                            />
                          )}
                        />
                        {errors.imageUrl && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.imageUrl.message}
                          </p>
                        )}
                        <div className="text-center text-sm text-gray-500">
                          OR
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                          {uploadingImage && (
                            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                          )}
                        </div>
                        {imageFile && (
                          <div className="text-sm text-green-600">
                            Selected: {imageFile.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Controller
                          name="position"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}>
                              <SelectTrigger id="position">
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Top</SelectItem>
                                <SelectItem value="middle">Middle</SelectItem>
                                <SelectItem value="bottom">Bottom</SelectItem>
                                <SelectItem value="sidebar">Sidebar</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Controller
                          name="priority"
                          control={control}
                          render={({ field }) => {
                            // Get used priorities from existing banners
                            const usedPriorities = banners.map(
                              banner => banner.priority
                            );
                            const availablePriorities = Array.from(
                              { length: 10 },
                              (_, i) => i + 1
                            ).filter(
                              priority => !usedPriorities.includes(priority)
                            );

                            return (
                              <Select
                                value={field.value.toString()}
                                onValueChange={value =>
                                  field.onChange(parseInt(value))
                                }>
                                <SelectTrigger id="priority">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from(
                                    { length: 10 },
                                    (_, i) => i + 1
                                  ).map(priority => (
                                    <SelectItem
                                      key={priority}
                                      value={priority.toString()}
                                      disabled={usedPriorities.includes(
                                        priority
                                      )}>
                                      <div className="flex items-center justify-between w-full">
                                        <span>Priority {priority}</span>
                                        {priority === 1 && (
                                          <span className="text-xs text-green-600 ml-2">
                                            (Highest)
                                          </span>
                                        )}
                                        {priority === 10 && (
                                          <span className="text-xs text-gray-500 ml-2">
                                            (Lowest)
                                          </span>
                                        )}
                                        {usedPriorities.includes(priority) && (
                                          <span className="text-xs text-red-500 ml-2">
                                            (Taken)
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            );
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetAudience">Target Audience</Label>
                        <Controller
                          name="targetAudience"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}>
                              <SelectTrigger id="targetAudience">
                                <SelectValue placeholder="Select target audience" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="applicants">
                                  Applicants
                                </SelectItem>
                                <SelectItem value="employers">
                                  Employers
                                </SelectItem>
                                <SelectItem value="admin">
                                  Admin Only
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem
                                  key={category._id}
                                  value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            placeholder="Enter tags (comma separated)"
                            className="min-h-[80px]"
                            value={field.value.join(', ')}
                            onChange={e => {
                              const tagsArray = e.target.value
                                .split(',')
                                .map(tag => tag.trim())
                                .filter(tag => tag);
                              field.onChange(tagsArray);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date (Optional)</Label>
                        <Controller
                          name="startDate"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} type="date" />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Controller
                          name="endDate"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} type="date" />
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleSubmit(createBanner)}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Banner
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={previewBanner}
                        className="bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Banner Templates
                    </CardTitle>
                    <CardDescription>
                      Pre-built banner templates for common use cases
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {templates.map(template => (
                    <div
                      key={template._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                          <img
                            src={
                              template.templateData?.imageUrl ||
                              '/api/placeholder/400/200'
                            }
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              {template.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Created: {formatDate(template.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/60 backdrop-blur-sm border-white/50">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/60 backdrop-blur-sm border-white/50">
                          <Edit className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <BannerAnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Banner Templates
                  </h2>
                  <p className="text-gray-600">
                    Choose a template to create a new banner
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No templates available</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map(template => (
                    <div
                      key={template._id}
                      className="p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => createBannerFromTemplate(template)}>
                      <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden mb-3">
                        <img
                          src={
                            template.templateData?.imageUrl ||
                            '/api/placeholder/400/200'
                          }
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          {template.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Used {template.usageCount || 0} times
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Banner Scheduling Modal */}
      {showSchedulingModal && schedulingBanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-2xl w-full overflow-hidden">
            <div className="p-6 border-b border-white/50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Schedule Banner
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSchedulingModal}
                className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {schedulingBanner.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {schedulingBanner.description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={scheduleForm.startDate}
                      onChange={e =>
                        setScheduleForm(prev => ({
                          ...prev,
                          startDate: e.target.value
                        }))
                      }
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={scheduleForm.startTime}
                      onChange={e =>
                        setScheduleForm(prev => ({
                          ...prev,
                          startTime: e.target.value
                        }))
                      }
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={scheduleForm.endDate}
                      onChange={e =>
                        setScheduleForm(prev => ({
                          ...prev,
                          endDate: e.target.value
                        }))
                      }
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={scheduleForm.endTime}
                      onChange={e =>
                        setScheduleForm(prev => ({
                          ...prev,
                          endTime: e.target.value
                        }))
                      }
                      className="bg-white/60 backdrop-blur-sm border-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={scheduleForm.timezone}
                    onChange={e =>
                      setScheduleForm(prev => ({
                        ...prev,
                        timezone: e.target.value
                      }))
                    }
                    className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                    {getTimezoneOptions().map(timezone => (
                      <option key={timezone} value={timezone}>
                        {timezone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={scheduleForm.recurring}
                      onChange={e =>
                        setScheduleForm(prev => ({
                          ...prev,
                          recurring: e.target.checked
                        }))
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="recurring">
                      Make this banner recurring
                    </Label>
                  </div>

                  {scheduleForm.recurring && (
                    <div className="space-y-2">
                      <Label htmlFor="recurringPattern">
                        Recurring Pattern
                      </Label>
                      <select
                        id="recurringPattern"
                        value={scheduleForm.recurringPattern}
                        onChange={e =>
                          setScheduleForm(prev => ({
                            ...prev,
                            recurringPattern: e.target.value as any
                          }))
                        }
                        className="w-full p-3 rounded-lg border border-white/50 bg-white/60 backdrop-blur-sm">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={saveSchedule}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Save Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={closeSchedulingModal}
                  className="bg-white/60 backdrop-blur-sm border-white/50">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-white/50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Categories
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCategoryModal(false)}
                className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="bg-white/60 backdrop-blur-sm border-white/50"
                  onKeyPress={e => e.key === 'Enter' && addCategory()}
                />
                <Button
                  onClick={addCategory}
                  className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  Existing Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category._id}
                      className="cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: category.color + '20',
                        color: category.color
                      }}
                      onClick={() => removeCategory(category._id)}>
                      {category.name} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Management Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-white/50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Manage Tags</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTagModal(false)}
                className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Enter new tag"
                  className="bg-white/60 backdrop-blur-sm border-white/50"
                  onKeyPress={e => e.key === 'Enter' && addTag()}
                />
                <Button
                  onClick={addTag}
                  className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Existing Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag._id}
                      className="cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color
                      }}
                      onClick={() => removeTag(tag._id)}>
                      {tag.name} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Duplication Modal */}
      {showDuplicateModal && duplicatingBanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-white/50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Duplicate Banner
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDuplicateModal}
                className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 overflow-hidden mx-auto mb-4">
                  <img
                    src={duplicatingBanner.imageUrl}
                    alt={duplicatingBanner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {duplicatingBanner.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {duplicatingBanner.description}
                </p>
                <p className="text-sm text-gray-500">
                  This will create a copy of the banner with "(Copy)" added to
                  the title. The duplicated banner will be inactive by default.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => duplicateBanner(duplicatingBanner)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Banner
                </Button>
                <Button
                  variant="outline"
                  onClick={closeDuplicateModal}
                  className="bg-white/60 backdrop-blur-sm border-white/50">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Version History Modal */}
      {showVersionModal && versioningBanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Banner Version History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeVersionModal}
                className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {versioningBanner.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {versioningBanner.description}
                  </p>
                </div>

                {bannerVersions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No version history available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bannerVersions.map((version, index) => (
                      <div
                        key={version._id}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                            <img
                              src={version.imageUrl}
                              alt={version.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {version.title}
                              </h4>
                              <Badge
                                className={
                                  getVersionStatus(version) === 'current'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }>
                                {getVersionStatus(version)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {version.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Version {index + 1}</span>
                              <span>•</span>
                              <span>
                                Updated: {formatDate(version.updatedAt)}
                              </span>
                              <span>•</span>
                              <span>Status: {version.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPreview(version)}
                            className="bg-white/60 backdrop-blur-sm border-white/50">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          {getVersionStatus(version) !== 'current' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreVersion(version)}
                              className="bg-white/60 backdrop-blur-sm border-white/50">
                              <History className="h-4 w-4 mr-2" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      {showEditModal && editingBanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Banner
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Update banner information and settings
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeEditModal}
                  className="hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title}
                    onChange={e =>
                      setEditFormData(prev => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    placeholder="Enter banner title"
                    className="border border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-priority"
                    className="text-sm font-medium">
                    Priority
                  </Label>
                  <Select
                    value={editFormData.priority.toString()}
                    onValueChange={value =>
                      setEditFormData(prev => ({
                        ...prev,
                        priority: parseInt(value)
                      }))
                    }>
                    <SelectTrigger className="border border-input">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        priority => {
                          // Get used priorities from other banners (excluding current banner being edited)
                          const usedPriorities = banners
                            .filter(banner => banner._id !== editingBanner?._id)
                            .map(banner => banner.priority);

                          return (
                            <SelectItem
                              key={priority}
                              value={priority.toString()}
                              disabled={usedPriorities.includes(priority)}>
                              <div className="flex items-center justify-between w-full">
                                <span>Priority {priority}</span>
                                {priority === 1 && (
                                  <span className="text-xs text-green-600 ml-2">
                                    (Highest)
                                  </span>
                                )}
                                {priority === 10 && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    (Lowest)
                                  </span>
                                )}
                                {usedPriorities.includes(priority) && (
                                  <span className="text-xs text-red-500 ml-2">
                                    (Taken)
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="edit-description"
                  className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={e =>
                    setEditFormData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  placeholder="Enter banner description"
                  rows={3}
                  className="border border-input"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Banner Image</Label>
                <div className="flex items-center gap-4">
                  {editFormData.imageUrl && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={editFormData.imageUrl}
                        alt="Banner preview"
                        width={128}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      value={editFormData.imageUrl}
                      onChange={e =>
                        setEditFormData(prev => ({
                          ...prev,
                          imageUrl: e.target.value
                        }))
                      }
                      placeholder="Image URL or upload new image"
                      className="border border-input"
                    />
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleEditImageUpload(file);
                        }}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <Label
                        htmlFor="edit-image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md cursor-pointer transition-colors">
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Link URL */}
              <div className="space-y-2">
                <Label htmlFor="edit-linkUrl" className="text-sm font-medium">
                  Link URL
                </Label>
                <Input
                  id="edit-linkUrl"
                  value={editFormData.linkUrl}
                  onChange={e =>
                    setEditFormData(prev => ({
                      ...prev,
                      linkUrl: e.target.value
                    }))
                  }
                  placeholder="https://example.com"
                  className="border border-input"
                />
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Position</Label>
                  <Select
                    value={editFormData.position}
                    onValueChange={value =>
                      setEditFormData(prev => ({
                        ...prev,
                        position: value as any
                      }))
                    }>
                    <SelectTrigger className="border border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={value =>
                      setEditFormData(prev => ({
                        ...prev,
                        status: value as any
                      }))
                    }>
                    <SelectTrigger className="border border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Target Audience</Label>
                  <Select
                    value={editFormData.targetAudience}
                    onValueChange={value =>
                      setEditFormData(prev => ({
                        ...prev,
                        targetAudience: value as any
                      }))
                    }>
                    <SelectTrigger className="border border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="applicants">Applicants</SelectItem>
                      <SelectItem value="employers">Employers</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select
                    value={editFormData.category}
                    onValueChange={value =>
                      setEditFormData(prev => ({ ...prev, category: value }))
                    }>
                    <SelectTrigger className="border border-input">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-tags" className="text-sm font-medium">
                    Tags
                  </Label>
                  <Textarea
                    id="edit-tags"
                    value={editTagsInput}
                    onChange={e => setEditTagsInput(e.target.value)}
                    placeholder="Enter tags separated by commas"
                    rows={2}
                    className="border border-input"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-white/50 bg-gray-50/50 backdrop-blur-sm">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={closeEditModal}
                  className="border-gray-300 hover:bg-gray-50">
                  Cancel
                </Button>
                <Button
                  onClick={updateBanner}
                  className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Banner
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewBannerData && (
        <BannerPreview
          banner={previewBannerData}
          isModal={true}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewBannerData(null);
          }}
        />
      )}
    </div>
  );
}
