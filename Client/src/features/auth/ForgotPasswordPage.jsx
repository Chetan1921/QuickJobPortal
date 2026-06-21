import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Mail, Send, MailCheck, ArrowLeft } from 'lucide-react';

import { forgotPasswordSchema } from '@/schemas/authSchemas';
import { forgotPassword } from './authApi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async ({ email }) => {
    try {
      setLoading(true);
      const res = await forgotPassword(email);
      toast.success(res.data.message || 'Reset link sent');
      setSent(true);
    } catch (err) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We'll email you a link to reset it"
      footer={
        <Link to="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center py-4">
          <div className="h-14 w-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
            <MailCheck className="h-6 w-6 text-green-700 dark:text-green-400" />
          </div>
          <p className="text-[var(--text-primary)] font-medium mb-1.5">Check your inbox</p>
          <p className="text-[var(--text-secondary)] text-sm">
            We sent a reset link to <span className="text-[var(--text-secondary)]">{getValues('email')}</span>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" loading={loading} icon={Send} className="mt-2">
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
