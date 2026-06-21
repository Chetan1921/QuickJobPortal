import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Building2, Trash2, Globe } from 'lucide-react';
import { getAllCompanies, deleteCompany } from './companyApi';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompanies({ page: 1, limit: 20 });
      setCompanies(res.data.companies || []);
    } catch (err) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleDelete = async (companyId) => {
    if (!confirm('Delete this company? This cannot be undone.')) return;
    try {
      await deleteCompany(companyId);
      setCompanies((c) => c.filter((co) => co.company_id !== companyId));
      toast.success('Company deleted');
    } catch (err) {
      // handled globally
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">Companies</h1>
          <p className="text-[var(--text-secondary)] text-sm">Manage the companies you're hiring for</p>
        </div>
        <Link to="/dashboard/companies/new">
          <Button icon={Plus} className="w-auto px-5">New Company</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Add your first company to start posting jobs."
          action={
            <Link to="/dashboard/companies/new">
              <Button className="w-auto px-5">Add Company</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div key={c.company_id} className="group relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 hover:border-[var(--border-strong)] transition-all">
              <Link to={`/dashboard/companies/${c.company_id}`} className="block">
                <div className="flex items-start gap-3 pr-8">
                  <div className="h-11 w-11 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center shrink-0">
                    {c.logo ? <img src={c.logo} alt={c.name} className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-[var(--text-muted)]" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--text-primary)] font-semibold truncate group-hover:text-primary transition-colors">{c.name}</p>
                    {c.website && (
                      <span className="text-xs text-[var(--text-muted)] inline-flex items-center gap-1">
                        <Globe className="h-3 w-3" /> Website
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-2">{c.description}</p>
              </Link>
              <button
                onClick={() => handleDelete(c.company_id)}
                className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
