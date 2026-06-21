import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Camera, FileText, Plus, X, Loader2, Pencil } from 'lucide-react';
import { getMyProfile, updateProfile, updateProfilePicture, updateResume, addSkill, deleteSkill } from './userApi';
import { updateUser } from '@/features/auth/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

// Backend may return skills as a native array (Postgres ARRAY_AGG), a comma string,
// or omit the field entirely (myprofileController returns req.user verbatim).
function normalizeSkills(skills) {
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === 'string') return skills.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phoneNo: '', bio: '' });
  const [skillInput, setSkillInput] = useState('');
  const [uploadingPic, setUploadingPic] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const picInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data.user);
        setForm({
          name: res.data.user.name || '',
          phoneNo: res.data.user.phone_number || '',
          bio: res.data.user.bio || '',
        });
      } catch (err) {
        // handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await updateProfile(form);
      setProfile((p) => ({ ...p, ...form }));
      dispatch(updateUser(form));
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      // handled globally
    } finally {
      setSaving(false);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingPic(true);
      const res = await updateProfilePicture(file);
      setProfile((p) => ({ ...p, profile_picture: res.data?.user?.profile_picture || URL.createObjectURL(file) }));
      toast.success('Profile picture updated');
    } catch (err) {
      // handled globally
    } finally {
      setUploadingPic(false);
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingResume(true);
      const res = await updateResume(file);
      const resumeUrl = res.data?.user?.resume || file.name;
      setProfile((p) => ({ ...p, resume: resumeUrl }));
      dispatch(updateUser({ resume: resumeUrl }));
      toast.success('Resume updated');
    } catch (err) {
      // handled globally
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    const skill = skillInput.trim();
    try {
      await addSkill(skill);
      setProfile((p) => ({
        ...p,
        skills: [...normalizeSkills(p?.skills), skill],
      }));
      setSkillInput('');
      toast.success('Skill added');
    } catch (err) {
      // handled globally
    }
  };

  const handleDeleteSkill = async (skill) => {
    try {
      await deleteSkill(skill);
      setProfile((p) => ({
        ...p,
        skills: normalizeSkills(p?.skills).filter((s) => s !== skill),
      }));
    } catch (err) {
      // handled globally
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const skillsList = normalizeSkills(profile?.skills);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">My Profile</h1>

      {/* Header card */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-2xl bg-primary/15 border border-primary/30 overflow-hidden flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300">
              {profile?.profile_picture ? (
                <img src={profile.profile_picture} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                profile?.name?.[0]?.toUpperCase()
              )}
            </div>
            <button
              onClick={() => picInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-primary border-2 border-dark-bg flex items-center justify-center text-[var(--text-primary)] hover:brightness-110"
            >
              {uploadingPic ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input ref={picInputRef} type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] truncate">{profile?.name}</h2>
            <p className="text-sm text-[var(--text-secondary)] truncate">{profile?.email}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>

          <Button variant="outline" icon={Pencil} onClick={() => setEditing((e) => !e)} className="sm:w-auto px-5">
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Editable fields */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
        <h3 className="text-[var(--text-primary)] font-semibold mb-4">Details</h3>
        {editing ? (
          <div>
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Phone Number" value={form.phoneNo} onChange={(e) => setForm({ ...form, phoneNo: e.target.value })} />
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[3px] focus:ring-primary/30 focus:border-primary/60 resize-none"
              />
            </div>
            <Button onClick={handleSaveProfile} loading={saving} className="sm:w-auto px-6">
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[var(--text-muted)]">Phone</span><span className="text-[var(--text-primary)]">{profile?.phone_number || '—'}</span></div>
            <div className="flex justify-between gap-4"><span className="text-[var(--text-muted)] shrink-0">Bio</span><span className="text-[var(--text-primary)] text-right">{profile?.bio || '—'}</span></div>
          </div>
        )}
      </div>

      {/* Resume (job seeker only) */}
      {user?.role === 'job_seeker' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
          <h3 className="text-[var(--text-primary)] font-semibold mb-4">Resume</h3>
          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm text-[var(--text-secondary)] truncate">
                {profile?.resume ? 'Resume uploaded' : 'No resume uploaded yet'}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => resumeInputRef.current?.click()}
              loading={uploadingResume}
              className="w-auto px-4 shrink-0"
            >
              {profile?.resume ? 'Replace' : 'Upload'}
            </Button>
            <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
        <h3 className="text-[var(--text-primary)] font-semibold mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {skillsList.length === 0 && <p className="text-[var(--text-muted)] text-sm">No skills added yet.</p>}
          {skillsList.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-indigo-600 dark:text-indigo-300 border border-primary/20">
              {skill}
              <button onClick={() => handleDeleteSkill(skill)} className="hover:text-[var(--text-primary)]">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. React, Node.js"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[3px] focus:ring-primary/30 focus:border-primary/60"
          />
          <Button type="submit" icon={Plus} className="w-auto px-4">Add</Button>
        </form>
      </div>
    </div>
  );
}
