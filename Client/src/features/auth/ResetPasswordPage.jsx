import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Lock, KeyRound } from 'lucide-react';

import { resetPasswordSchema } from '@/schemas/authSchemas';
import { resetPassword } from './authApi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async ({ password }) => {
    try {
      setLoading(true);
      const res = await resetPassword(token, password);
      toast.success(res.data.message || 'Password reset successful');
      navigate('/login');
    } catch (err) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Make sure it's something memorable">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="New Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={loading} icon={KeyRound} className="mt-2">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
