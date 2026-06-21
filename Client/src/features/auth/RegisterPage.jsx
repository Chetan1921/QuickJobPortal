import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, UserPlus, UploadCloud, FileText, X, Briefcase, Search } from 'lucide-react';

import { registerSchema } from '@/schemas/authSchemas';
import { registerUser } from './authApi';
import { setCredentials } from './authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('job_seeker');
  const [resumeFile, setResumeFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'job_seeker' },
  });

  const selectRole = (r) => {
    setRole(r);
    setValue('role', r);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      if (data.role === 'job_seeker' && resumeFile) {
        formData.append('file', resumeFile);
      }

      const res = await registerUser(formData);
      const { user, token } = res.data;
      dispatch(setCredentials({ user, token }));
      toast.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join as a job seeker or recruiter"
      footer={
        <p className="text-[var(--text-secondary)] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => selectRole('job_seeker')}
            className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border transition-all ${
              role === 'job_seeker'
                ? 'bg-primary/15 border-primary/60 text-[var(--text-primary)] shadow-sm shadow-primary/20'
                : 'border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium">Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => selectRole('recruiter')}
            className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border transition-all ${
              role === 'recruiter'
                ? 'bg-primary/15 border-primary/60 text-[var(--text-primary)] shadow-sm shadow-primary/20'
                : 'border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-sm font-medium">Recruiter</span>
          </button>
        </div>
        <input type="hidden" {...register('role')} />

        <Input label="Full Name" icon={User} placeholder="John Doe" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" autoComplete="email" error={errors.email?.message} {...register('email')} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Password" type="password" icon={Lock} placeholder="••••••••" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
          <Input label="Phone" icon={Phone} placeholder="9876543210" autoComplete="tel" error={errors.phoneNo?.message} {...register('phoneNo')} />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Bio</label>
          <textarea
            {...register('bio')}
            rows={3}
            placeholder="Tell us a little about yourself"
            className={`w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border ${
              errors.bio ? 'border-red-500/70 focus:ring-red-500/20' : 'border-[var(--border-subtle)] focus:ring-primary/30'
            } text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[3px] focus:border-primary/60 hover:border-[var(--border-strong)] transition-all resize-none`}
          />
          {errors.bio && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.bio.message}</p>}
        </div>

        {role === 'job_seeker' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Resume</label>
            {resumeFile ? (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span className="text-sm text-[var(--text-primary)] truncate">{resumeFile.name}</span>
                </div>
                <button type="button" onClick={() => setResumeFile(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1.5 py-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-primary/50 hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-all">
                <UploadCloud className="h-6 w-6 text-[var(--text-muted)]" />
                <span className="text-sm text-[var(--text-secondary)]">Click to upload your resume</span>
                <span className="text-xs text-[var(--text-muted)]">PDF, DOC, DOCX</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        <Button type="submit" loading={loading} icon={UserPlus}>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
}
