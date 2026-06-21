import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { createJob } from './jobApi';
import { getAllCompanies } from '@/features/companies/companyApi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const WORK_LOCATIONS = ['Remote', 'On-site', 'Hybrid'];

const selectClass =
  'w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-[3px] focus:ring-primary/30 focus:border-primary/60';

export default function NewJobPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', role: '', salary: '', location: '',
    job_type: JOB_TYPES[0], work_location: WORK_LOCATIONS[0], openings: 1, company_id: '',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getAllCompanies({ page: 1, limit: 50 });
        setCompanies(res.data.companies || []);
        if (res.data.companies?.length) {
          setForm((f) => ({ ...f, company_id: res.data.companies[0].company_id }));
        }
      } catch (err) {
        // handled globally
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createJob({ ...form, salary: Number(form.salary), openings: Number(form.openings) });
      toast.success('Job posted');
      navigate('/dashboard/jobs');
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

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">Post a Job</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">Fill in the details to publish a new opening</p>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Company</label>
          <select className={selectClass} value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })} required>
            <option value="" disabled>Select company</option>
            {companies.map((c) => <option key={c.company_id} value={c.company_id}>{c.name}</option>)}
          </select>
        </div>

        <Input label="Job Title" placeholder="Senior Frontend Engineer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input label="Role" placeholder="Engineering" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Describe the role, responsibilities, and requirements"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[3px] focus:ring-primary/30 focus:border-primary/60 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Salary (₹/yr)" type="number" placeholder="1200000" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
          <Input label="Openings" type="number" placeholder="2" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} required />
        </div>

        <Input label="Location" placeholder="Bengaluru, India" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Job Type</label>
            <select className={selectClass} value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Work Location</label>
            <select className={selectClass} value={form.work_location} onChange={(e) => setForm({ ...form, work_location: e.target.value })}>
              {WORK_LOCATIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <Button type="submit" loading={loading}>Post Job</Button>
      </form>
    </div>
  );
}
