import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2, Globe, UploadCloud, X, ArrowLeft } from 'lucide-react';
import { createCompany } from './companyApi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewCompanyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', website: '' });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logo) {
      toast.error('Company logo is required');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('file', logo);

      await createCompany(formData);
      toast.success('Company created');
      navigate('/dashboard/companies');
    } catch (err) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">New Company</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">Add a company you'll post jobs under</p>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
        <Input label="Company Name" icon={Building2} placeholder="Acme Inc." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Website" icon={Globe} placeholder="https://acme.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="What does this company do?"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[3px] focus:ring-primary/30 focus:border-primary/60 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Logo <span className="text-red-600 dark:text-red-400">*</span></label>
          {logo ? (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              <span className="text-sm text-[var(--text-primary)] truncate">{logo.name}</span>
              <button type="button" onClick={() => setLogo(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-1.5 py-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-primary/50 hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-all">
              <UploadCloud className="h-6 w-6 text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-secondary)]">Click to upload logo</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files[0])} />
            </label>
          )}
        </div>

        <Button type="submit" loading={loading}>Create Company</Button>
      </form>
    </div>
  );
}
