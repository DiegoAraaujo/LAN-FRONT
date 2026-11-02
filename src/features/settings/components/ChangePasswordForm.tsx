'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { extractValidationErrors } from '@/lib/api';
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validation';
import { useAuthStore } from '@/stores/auth.store';
import { userApi } from '../api/user.api';

export function ChangePasswordForm() {
  const t = useTranslations('settings');
  const e = useTranslations('experience');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const change = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      reset();
      queryClient.clear();
      useAuthStore.getState().clearSession();
      localStorage.setItem(
        'lan-session-event',
        JSON.stringify({ type: 'logout', id: crypto.randomUUID() }),
      );
      toast.success(t('passwordChanged'));
      router.replace('/login');
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.code === 'CURRENT_PASSWORD_INVALID') {
        setError(
          'currentPassword',
          { message: t('currentPasswordInvalid') },
          { shouldFocus: true },
        );
        return;
      }
      const fields = extractValidationErrors(error);
      for (const field of ['currentPassword', 'newPassword', 'confirmPassword'] as const) {
        if (fields[field]) setError(field, { message: fields[field] });
      }
      setError('root', { message: t('passwordChangeFailed') });
    },
  });
  return (
    <Card className="p-5">
      <h2 className="mb-2 flex items-center gap-2 font-semibold">
        <LockKeyhole size={17} />
        {t('changePassword')}
      </h2>
      <p className="mb-4 text-sm text-text-muted">{t('changePasswordHint')}</p>
      <form noValidate onSubmit={handleSubmit((data) => change.mutate(data))} className="space-y-4">
        <fieldset disabled={change.isPending} className="min-w-0 space-y-4">
          {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
            <Input
              key={field}
              required
              label={t(field === 'confirmPassword' ? 'confirmNewPassword' : field)}
              type={visible ? 'text' : 'password'}
              autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'}
              error={errors[field]?.message}
              {...register(field)}
            />
          ))}
        </fieldset>
        <button
          type="button"
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="flex min-h-11 items-center gap-2 text-sm text-text-muted"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}{' '}
          {e(visible ? 'hidePassword' : 'showPassword')}
        </button>
        {errors.root && (
          <p role="alert" className="text-sm text-danger">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" variant="primary" disabled={change.isPending}>
          {t(change.isPending ? 'changingPassword' : 'changePassword')}
        </Button>
      </form>
    </Card>
  );
}
