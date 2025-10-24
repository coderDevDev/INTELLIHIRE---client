'use client';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { authAPI, userAPI, documentAPI } from '@/lib/api-service';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Edit2,
  Save,
  X,
  Upload,
  Download,
  Pencil,
  Trash2,
  Plus,
  CheckCircle,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Camera,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  Building,
  Clock,
  Globe,
  Shield,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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

const DEFAULT_AVATAR = '/avatar-placeholder.png';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getPdsDownloadUrl = (pdsFile: string) => {
  if (!pdsFile) return '#';
  const filePath = pdsFile.replace(/^\/+/, '');
  const baseUrl = API_URL.replace(/\/api$/, '');
  return `${baseUrl}/${filePath.replace(/\\/g, '/')}`;
};

export default function ApplicantProfilePage() {
  const user = authAPI.getCurrentUser();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [expForm, setExpForm] = useState<any>({
    title: '',
    company: '',
    location: '',
    type: 'Full Time',
    start: '',
    end: ''
  });

  const [education, setEducation] = useState<any[]>([]);
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [eduForm, setEduForm] = useState<any>({
    degree: '',
    school: '',
    start: '',
    end: ''
  });

  const [certification, setCertification] = useState<any[]>([]);
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [certForm, setCertForm] = useState<any>({
    name: '',
    issuer: '',
    date: ''
  });

  const pdsInputRef = useRef<HTMLInputElement>(null);
  const [pdsFile, setPdsFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [profileData, documentsData] = await Promise.all([
          userAPI.getUserById(user.id),
          documentAPI.getMyDocuments()
        ]);

        setProfile(profileData);
        // Set profile picture (either base64 or file path)
        if (profileData.profilePicture) {
          // Check if it's a base64 string
          if (profileData.profilePicture.startsWith('data:image')) {
            setAvatar(profileData.profilePicture);
          } else {
            // It's a file path, construct full URL
            const baseUrl = API_URL.replace(/\/api$/, '');
            const picturePath = profileData.profilePicture.replace(/^\\+/, '').replace(/\\/g, '/');
            setAvatar(`${baseUrl}/${picturePath}`);
          }
        } else {
          setAvatar(DEFAULT_AVATAR);
        }
        setExperience(
          Array.isArray(profileData.experience) ? profileData.experience : []
        );
        setEducation(
          Array.isArray(profileData.education) ? profileData.education : []
        );
        setCertification(
          Array.isArray(profileData.certification)
            ? profileData.certification
            : []
        );
        setDocuments(documentsData || []);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user?.id]);

  if (loading || !profile) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setAvatar(profile?.profilePicture || DEFAULT_AVATAR);
    setAvatarFile(null);
  };

  const handleSave = async () => {
    try {
      // Use the base64 avatar if a new file was selected
      const profilePicture = avatarFile ? avatar : profile.profilePicture;
      
      const updatePayload: any = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        gender: profile.gender,
        dob: profile.dob,
        summary: profile.summary,
        profilePicture
      };
      const updated = await userAPI.updateProfile(updatePayload);
      setProfile(updated);
      
      // Update avatar display with the new profile picture
      if (updated.profilePicture) {
        setAvatar(updated.profilePicture);
      }
      
      // Update localStorage so sidebar reflects changes immediately
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          firstName: updated.firstName,
          lastName: updated.lastName,
          profilePicture: updated.profilePicture
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch custom event to notify sidebar of profile update
        window.dispatchEvent(new Event('profileUpdated'));
      }
      
      setEditMode(false);
      setAvatarFile(null);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile.');
    }
  };

  const age = profile.dob
    ? Math.max(
        0,
        new Date().getFullYear() - new Date(profile.dob).getFullYear()
      )
    : '-';

  // Calculate profile completion percentage based on uploaded documents
  const hasPDS = documents.some(doc => doc.type === 'pds');
  const hasResume = documents.some(doc => doc.type === 'resume');

  const profileFields = [
    profile.firstName,
    profile.lastName,
    profile.phoneNumber,
    profile.address?.street,
    profile.gender,
    profile.dob,
    profile.summary,
    experience.length > 0,
    education.length > 0,
    certification.length > 0,
    hasPDS,
    hasResume
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const completionPercentage = Math.round(
    (completedFields / profileFields.length) * 100
  );

  // Experience handlers
  const openAddExp = () => {
    setEditingExp(null);
    setExpForm({
      title: '',
      company: '',
      location: '',
      type: 'Full Time',
      start: '',
      end: ''
    });
    setShowExpModal(true);
  };

  const openEditExp = (exp: any, idx: number) => {
    setEditingExp({ ...exp, idx });
    setExpForm({ ...exp });
    setShowExpModal(true);
  };

  const handleExpFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setExpForm({ ...expForm, [e.target.name]: e.target.value });
  };

  const handleExpSave = async () => {
    let newExp = [...experience];
    if (editingExp) {
      newExp[editingExp.idx] = { ...expForm };
    } else {
      newExp.push({ ...expForm });
    }
    try {
      const updated = await userAPI.updateProfile({ experience: newExp });
      setExperience(updated.experience);
      toast.success('Experience saved!');
    } catch (err) {
      toast.error('Failed to save experience');
    }
    setShowExpModal(false);
    setEditingExp(null);
  };

  // Education handlers
  const openAddEdu = () => {
    setEditingEdu(null);
    setEduForm({ degree: '', school: '', start: '', end: '' });
    setShowEduModal(true);
  };

  const openEditEdu = (edu: any, idx: number) => {
    setEditingEdu({ ...edu, idx });
    setEduForm({ ...edu });
    setShowEduModal(true);
  };

  const handleEduFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEduForm({ ...eduForm, [e.target.name]: e.target.value });
  };

  const handleEduSave = async () => {
    let newEdu = [...education];
    if (editingEdu) {
      newEdu[editingEdu.idx] = { ...eduForm };
    } else {
      newEdu.push({ ...eduForm });
    }
    try {
      const updated = await userAPI.updateProfile({ education: newEdu });
      setEducation(updated.education);
      toast.success('Education saved!');
    } catch (err) {
      toast.error('Failed to save education');
    }
    setShowEduModal(false);
    setEditingEdu(null);
  };

  // Certification handlers
  const openAddCert = () => {
    setEditingCert(null);
    setCertForm({ name: '', issuer: '', date: '' });
    setShowCertModal(true);
  };

  const openEditCert = (cert: any, idx: number) => {
    setEditingCert({ ...cert, idx });
    setCertForm({ ...cert });
    setShowCertModal(true);
  };

  const handleCertFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertForm({ ...certForm, [e.target.name]: e.target.value });
  };

  const handleCertSave = async () => {
    let newCert = [...certification];
    if (editingCert) {
      newCert[editingCert.idx] = { ...certForm };
    } else {
      newCert.push({ ...certForm });
    }
    try {
      const updated = await userAPI.updateProfile({ certification: newCert });
      setCertification(updated.certification);
      toast.success('Certification saved!');
    } catch (err) {
      toast.error('Failed to save certification');
    }
    setShowCertModal(false);
    setEditingCert(null);
  };

  // PDS handlers
  const handlePdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdsFile(e.target.files[0]);
    }
  };

  const handlePdsUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdsFile) return;
    try {
      await userAPI.uploadPds(pdsFile);
      toast.success('PDS uploaded successfully!');
      setPdsFile(null);
      if (pdsInputRef.current) pdsInputRef.current.value = '';
      const res = await userAPI.getUserById(user._id);
      setProfile(res);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload PDS.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setPdsFile(file);
        if (pdsInputRef.current) pdsInputRef.current.value = '';
      } else {
        toast.error('Only PDF files are allowed.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePds = () => {
    setProfile({ ...profile, pdsFile: undefined });
    toast('PDS removed (frontend only)');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-600">
              Manage your professional profile and information
            </p>
          </div>
          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container px-6 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Sidebar - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                        <img
                          src={avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {editMode && (
                        <label className="absolute bottom-0 right-0 bg-brand-blue text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-blue-600 transition-colors">
                          <Camera className="h-5 w-5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      )}
                    </div>

                    {/* Name */}
                    <div className="mb-2">
                      {editMode ? (
                        <div className="flex gap-2">
                          <Input
                            name="firstName"
                            value={profile.firstName || ''}
                            onChange={handleChange}
                            className="w-32 text-center"
                            placeholder="First"
                          />
                          <Input
                            name="lastName"
                            value={profile.lastName || ''}
                            onChange={handleChange}
                            className="w-32 text-center"
                            placeholder="Last"
                          />
                        </div>
                      ) : (
                        <h2 className="text-2xl font-bold text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </h2>
                      )}
                    </div>

                    {/* Role */}
                    <Badge variant="secondary" className="mb-4">
                      {profile.role || 'Applicant'}
                    </Badge>

                    {/* Profile Completion */}
                    <div className="w-full mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Profile Completion
                        </span>
                        <span className="text-sm text-gray-500">
                          {completionPercentage}%
                        </span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      {completionPercentage < 100 && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-800">
                              Complete your profile to improve job matches and increase your chances of being hired!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {editMode ? (
                        <Input
                          name="email"
                          value={profile.email || ''}
                          onChange={handleChange}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">
                          {profile.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {editMode ? (
                        <Input
                          name="phoneNumber"
                          value={profile.phoneNumber || ''}
                          onChange={handleChange}
                          className="flex-1"
                          placeholder="Phone number"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">
                          {profile.phoneNumber || (
                            <span className="text-gray-400">—</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {editMode ? (
                        <Input
                          name="address"
                          value={profile.address?.street || ''}
                          onChange={e =>
                            setProfile({
                              ...profile,
                              address: {
                                ...profile.address,
                                street: e.target.value
                              }
                            })
                          }
                          className="flex-1"
                          placeholder="Address"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">
                          {profile.address?.street || (
                            <span className="text-gray-400">—</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Personal Info */}
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Gender:{' '}
                        {editMode ? (
                          <select
                            name="gender"
                            value={profile.gender || ''}
                            onChange={handleChange}
                            className="ml-2 border rounded px-2 py-1">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <span className="ml-2">
                            {profile.gender || (
                              <span className="text-gray-400">—</span>
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Birthday:{' '}
                        {editMode ? (
                          <Input
                            name="dob"
                            type="date"
                            value={profile.dob ? profile.dob.slice(0, 10) : ''}
                            onChange={handleChange}
                            className="ml-2 w-32"
                          />
                        ) : (
                          <span className="ml-2">
                            {profile.dob ? (
                              new Date(profile.dob).toLocaleDateString()
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                            {profile.dob && (
                              <span className="ml-2 text-xs text-gray-400">
                                ({age} years old)
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Card */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Documents</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/applicant/documents">
                        <Upload className="h-4 w-4 mr-2" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Document Status Alert */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Upload Required Documents
                        </p>
                        <p className="text-xs text-blue-700 mb-3">
                          You need to upload both PDS and Resume to apply for
                          jobs. Government jobs require PDS, while private
                          sector jobs require Resume/CV.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-white">
                          <Link href="/dashboard/applicant/documents">
                            <ArrowRight className="h-3 w-3 mr-2" />
                            Go to Documents Page
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* PDS Templates */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">
                        PDS Templates
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/applicant/pds-template">
                          View All
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Link>
                      </Button>
                    </div>

                    {/* PDF Version */}
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            PDF Version
                          </p>
                          <p className="text-xs text-gray-500">
                            CS Form 212 (2017)
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://lto.gov.ph/wp-content/uploads/2023/11/CS_Form_No._212_Revised-2017_Personal-Data-Sheet.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    {/* Excel Version */}
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            Excel Version
                          </p>
                          <p className="text-xs text-gray-500">
                            CS Form 212 (2025)
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://csc.gov.ph/downloads/category/540-csc-form-212-revised-2025-personal-data-sheet?download=3404:cs-form-no-212-revised-2025-personal-data-sheet"
                          target="_blank"
                          rel="noopener noreferrer"
                          download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* PDS Upload */}
                  {/* <form onSubmit={handlePdsUpload} className="space-y-3">
                    <label className="text-sm font-medium">Upload PDS</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-brand-blue bg-blue-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => pdsInputRef.current?.click()}>
                      {pdsFile ? (
                        <span className="text-brand-blue font-medium">
                          {pdsFile.name}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          Drag & drop PDF here, or{' '}
                          <span className="underline text-brand-blue">
                            browse
                          </span>
                        </span>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdsChange}
                        ref={pdsInputRef}
                        className="hidden"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!pdsFile}>
                      Upload PDS
                    </Button>
                  </form> */}

                  {/* Uploaded PDS */}
                  {profile?.pdsFile && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            PDS Uploaded
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" asChild>
                                  <a
                                    href={getPdsDownloadUrl(profile.pdsFile)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download>
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download PDS</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleRemovePds}
                            className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Summary */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-brand-blue" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <textarea
                      name="summary"
                      value={profile.summary || ''}
                      onChange={handleTextAreaChange}
                      className="w-full border rounded-lg p-3 min-h-[120px] resize-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {profile.summary ||
                        'Add a compelling professional summary that highlights your key skills, experience, and career objectives. This will help employers understand your background and goals.'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-brand-blue" />
                      Work Experience
                    </CardTitle>
                    <Button size="sm" onClick={openAddExp}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experience.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No work experience added yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openAddExp}
                          className="mt-2">
                          Add Your First Experience
                        </Button>
                      </div>
                    ) : (
                      experience.map((exp, i) => (
                        <div
                          key={i}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {exp.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Building className="h-4 w-4" />
                                <span>{exp.company}</span>
                                <span>•</span>
                                <MapPin className="h-4 w-4" />
                                <span>{exp.location}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {exp.type}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {exp.start} - {exp.end}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditExp(exp, i)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  /* Handle delete */
                                }}
                                className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-brand-blue" />
                      Education
                    </CardTitle>
                    <Button size="sm" onClick={openAddEdu}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {education.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No education added yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openAddEdu}
                          className="mt-2">
                          Add Your Education
                        </Button>
                      </div>
                    ) : (
                      education.map((edu, i) => (
                        <div
                          key={i}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {edu.degree}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Building className="h-4 w-4" />
                                <span>{edu.school}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {edu.start} - {edu.end}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditEdu(edu, i)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  /* Handle delete */
                                }}
                                className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Award className="h-5 w-5 text-brand-blue" />
                      Certifications
                    </CardTitle>
                    <Button size="sm" onClick={openAddCert}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certification.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No certifications added yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openAddCert}
                          className="mt-2">
                          Add Your First Certification
                        </Button>
                      </div>
                    ) : (
                      certification.map((cert, i) => (
                        <div
                          key={i}
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {cert.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Shield className="h-4 w-4" />
                                <span>{cert.issuer}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {cert.date}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditCert(cert, i)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  /* Handle delete */
                                }}
                                className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Experience Modal */}
      <Dialog open={showExpModal} onOpenChange={setShowExpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingExp ? 'Edit' : 'Add'} Work Experience
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="title"
              value={expForm.title}
              onChange={handleExpFormChange}
              placeholder="Job Title"
            />
            <Input
              name="company"
              value={expForm.company}
              onChange={handleExpFormChange}
              placeholder="Company"
            />
            <Input
              name="location"
              value={expForm.location}
              onChange={handleExpFormChange}
              placeholder="Location"
            />
            <select
              name="type"
              value={expForm.type}
              onChange={handleExpFormChange}
              className="w-full border rounded-md p-2">
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="start"
                type="text"
                value={expForm.start}
                onChange={handleExpFormChange}
                placeholder="Start (e.g. Apr 2020)"
              />
              <Input
                name="end"
                type="text"
                value={expForm.end}
                onChange={handleExpFormChange}
                placeholder="End (e.g. Present)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowExpModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleExpSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={showEduModal} onOpenChange={setShowEduModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEdu ? 'Edit' : 'Add'} Education</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="degree"
              value={eduForm.degree}
              onChange={handleEduFormChange}
              placeholder="Degree"
            />
            <Input
              name="school"
              value={eduForm.school}
              onChange={handleEduFormChange}
              placeholder="School"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="start"
                type="text"
                value={eduForm.start}
                onChange={handleEduFormChange}
                placeholder="Start (e.g. 2014)"
              />
              <Input
                name="end"
                type="text"
                value={eduForm.end}
                onChange={handleEduFormChange}
                placeholder="End (e.g. 2016)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEduModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEduSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certification Modal */}
      <Dialog open={showCertModal} onOpenChange={setShowCertModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCert ? 'Edit' : 'Add'} Certification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="name"
              value={certForm.name}
              onChange={handleCertFormChange}
              placeholder="Certification Name"
            />
            <Input
              name="issuer"
              value={certForm.issuer}
              onChange={handleCertFormChange}
              placeholder="Issuer"
            />
            <Input
              name="date"
              type="text"
              value={certForm.date}
              onChange={handleCertFormChange}
              placeholder="Date (e.g. 2023)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCertModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCertSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
