'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { authAPI, userAPI } from '@/lib/api-service';
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
  Plus
} from 'lucide-react';

const DEFAULT_AVATAR = '/avatar-placeholder.png';

const SAMPLE_EXPERIENCE = [];

const SAMPLE_EDUCATION = [];

export default function ApplicantProfilePage() {
  const user = authAPI.getCurrentUser();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [expDeleteIdx, setExpDeleteIdx] = useState<number | null>(null);

  const [education, setEducation] = useState<any[]>([]);
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [eduForm, setEduForm] = useState<any>({
    degree: '',
    school: '',
    start: '',
    end: ''
  });
  const [eduDeleteIdx, setEduDeleteIdx] = useState<number | null>(null);

  const [certification, setCertification] = useState<any[]>([]);
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [certForm, setCertForm] = useState<any>({
    name: '',
    issuer: '',
    date: ''
  });
  const [certDeleteIdx, setCertDeleteIdx] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await userAPI.getUserById(user.id);
        setProfile(data);
        setAvatar(data.profilePicture || DEFAULT_AVATAR);
        setExperience(data.experience || SAMPLE_EXPERIENCE);
        setEducation(data.education || SAMPLE_EDUCATION);
        setCertification(data.certification || []);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-muted-foreground">Loading profile...</div>
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
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setAvatar(profile?.profilePicture || DEFAULT_AVATAR);
    setAvatarFile(null);
  };

  const handleSave = async () => {
    // TODO: Send updated profile to backend (including avatar upload)
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const age = profile.dob
    ? Math.max(
        0,
        new Date().getFullYear() - new Date(profile.dob).getFullYear()
      )
    : '-';

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

  const handleExpDelete = (idx: number) => {
    setExpDeleteIdx(idx);
  };

  const confirmExpDelete = async () => {
    if (expDeleteIdx !== null) {
      let newExp = experience.filter((_, i) => i !== expDeleteIdx);
      try {
        const updated = await userAPI.updateProfile({ experience: newExp });
        setExperience(updated.experience);
        toast.success('Experience deleted!');
      } catch (err) {
        toast.error('Failed to delete experience');
      }
      setExpDeleteIdx(null);
    }
  };

  const cancelExpDelete = () => setExpDeleteIdx(null);

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

  const handleEduDelete = (idx: number) => {
    setEduDeleteIdx(idx);
  };

  const confirmEduDelete = async () => {
    if (eduDeleteIdx !== null) {
      let newEdu = education.filter((_, i) => i !== eduDeleteIdx);
      try {
        const updated = await userAPI.updateProfile({ education: newEdu });
        setEducation(updated.education);
        toast.success('Education deleted!');
      } catch (err) {
        toast.error('Failed to delete education');
      }
      setEduDeleteIdx(null);
    }
  };

  const cancelEduDelete = () => setEduDeleteIdx(null);

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

  const handleCertDelete = (idx: number) => {
    setCertDeleteIdx(idx);
  };

  const confirmCertDelete = async () => {
    if (certDeleteIdx !== null) {
      let newCert = certification.filter((_, i) => i !== certDeleteIdx);
      try {
        const updated = await userAPI.updateProfile({ certification: newCert });
        setCertification(updated.certification);
        toast.success('Certification deleted!');
      } catch (err) {
        toast.error('Failed to delete certification');
      }
      setCertDeleteIdx(null);
    }
  };

  const cancelCertDelete = () => setCertDeleteIdx(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-8">
      {/* Left Sidebar */}
      <aside className="w-full md:w-1/3 bg-white rounded-xl shadow p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={avatar}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
          />
          {editMode && (
            <label className="absolute bottom-0 right-0 bg-brand-blue text-white rounded-full p-2 cursor-pointer shadow-lg">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>
        <div className="text-xl font-bold text-center">
          {editMode ? (
            <Input
              name="firstName"
              value={profile.firstName || ''}
              onChange={handleChange}
              className="w-32 inline-block mr-2"
              placeholder="First Name"
            />
          ) : (
            <span>{profile.firstName}</span>
          )}{' '}
          {editMode ? (
            <Input
              name="lastName"
              value={profile.lastName || ''}
              onChange={handleChange}
              className="w-32 inline-block"
              placeholder="Last Name"
            />
          ) : (
            <span>{profile.lastName}</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground mb-4 text-center">
          {editMode ? (
            <Input
              name="role"
              value={profile.role || 'Applicant'}
              onChange={handleChange}
              className="w-32 inline-block"
            />
          ) : (
            <span>{profile.role || 'Applicant'}</span>
          )}
        </div>
        <div className="w-full space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-brand-blue" />
            {editMode ? (
              <Input
                name="email"
                value={profile.email || ''}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-brand-blue" />
            {editMode ? (
              <Input
                name="phoneNumber"
                value={profile.phoneNumber || ''}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <span>
                {profile.phoneNumber || (
                  <span className="text-gray-400">—</span>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-brand-blue" />
            {editMode ? (
              <Input
                name="address"
                value={profile.address?.street || ''}
                onChange={e =>
                  setProfile({
                    ...profile,
                    address: { ...profile.address, street: e.target.value }
                  })
                }
                className="w-full"
              />
            ) : (
              <span>
                {profile.address?.street || (
                  <span className="text-gray-400">—</span>
                )}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 mb-4">
          <Download className="h-4 w-4" /> Download Resume
        </Button>
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-brand-blue" />
            <span>
              Gender:{' '}
              {editMode ? (
                <select
                  name="gender"
                  value={profile.gender || ''}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>
                  {profile.gender || <span className="text-gray-400">—</span>}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-brand-blue" />
            <span>
              Date of Birth:{' '}
              {editMode ? (
                <Input
                  name="dob"
                  type="date"
                  value={profile.dob ? profile.dob.slice(0, 10) : ''}
                  onChange={handleChange}
                  className="w-full"
                />
              ) : (
                <span>
                  {profile.dob ? (
                    new Date(profile.dob).toLocaleDateString()
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </span>
              )}
            </span>
            {!editMode && profile.dob && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({age} yrs old)
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
            </Button>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-white rounded-xl shadow p-6">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-blue mb-2">
            Professional Summary
          </h2>
          {editMode ? (
            <textarea
              name="summary"
              value={profile.summary || ''}
              onChange={handleTextAreaChange}
              className="w-full border rounded-md p-2 min-h-[80px]"
              placeholder="Write a short professional summary..."
            />
          ) : (
            <p className="text-muted-foreground">
              {profile.summary ||
                'Add a short summary about your professional background, skills, and goals.'}
            </p>
          )}
        </section>
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-brand-blue">
              Work Experience
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={openAddExp}
              className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <Card
                key={i}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between relative group">
                <div>
                  <div className="font-semibold">{exp.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {exp.company} • {exp.location}
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-1 mt-2 md:mt-0">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold rounded px-2 py-1 mb-1 w-fit">
                    {exp.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {exp.start} - {exp.end}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditExp(exp, i)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleExpDelete(i)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {/* Experience Modal */}
          {showExpModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  {editingExp ? 'Edit' : 'Add'} Experience
                </h3>
                <div className="space-y-3">
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
                  <div className="flex gap-2">
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
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowExpModal(false)}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button onClick={handleExpSave}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Confirmation */}
          {expDeleteIdx !== null && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Delete Experience?</h3>
                <p>Are you sure you want to delete this experience?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={cancelExpDelete}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmExpDelete}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-brand-blue">Education</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={openAddEdu}
              className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <Card
                key={i}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between relative group">
                <div>
                  <div className="font-semibold">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">
                    {edu.school}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 md:mt-0">
                  {edu.start} - {edu.end}
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditEdu(edu, i)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEduDelete(i)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {/* Education Modal */}
          {showEduModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  {editingEdu ? 'Edit' : 'Add'} Education
                </h3>
                <div className="space-y-3">
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
                  <div className="flex gap-2">
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
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowEduModal(false)}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button onClick={handleEduSave}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Confirmation */}
          {eduDeleteIdx !== null && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Delete Education?</h3>
                <p>Are you sure you want to delete this education entry?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={cancelEduDelete}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmEduDelete}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-brand-blue">
              Certifications
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={openAddCert}
              className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {certification.length === 0 && (
              <div className="text-muted-foreground text-sm">
                No certifications added yet.
              </div>
            )}
            {certification.map((cert, i) => (
              <Card
                key={i}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between relative group">
                <div>
                  <div className="font-semibold">{cert.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {cert.issuer}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 md:mt-0">
                  {cert.date}
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditCert(cert, i)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCertDelete(i)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {/* Certification Modal */}
          {showCertModal && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  {editingCert ? 'Edit' : 'Add'} Certification
                </h3>
                <div className="space-y-3">
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
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCertModal(false)}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button onClick={handleCertSave}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Confirmation */}
          {certDeleteIdx !== null && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">
                  Delete Certification?
                </h3>
                <p>Are you sure you want to delete this certification?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={cancelCertDelete}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmCertDelete}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
