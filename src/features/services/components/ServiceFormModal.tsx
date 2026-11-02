'use client';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  serviceFormSchema as schema,
  type ServiceFormInput as FormInput,
} from '../schemas/service.schemas';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { Service } from '../api/services.api';

interface Props {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  defaultValues?: Service | null;
  onSave: (data: { name: string; price: number; description?: string }) => void;
}

export const ServiceFormModal = ({ open, onClose, onSave, isLoading, defaultValues }: Props) => {
  const t = useTranslations('services');
  const tc = useTranslations('common');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset(
      defaultValues
        ? {
            name: defaultValues.name,
            price: String(defaultValues.price),
            description: defaultValues.description ?? '',
          }
        : { name: '', price: '', description: '' },
    );
  }, [defaultValues, reset, open]);

  const onSubmit = (d: FormInput) =>
    onSave({ name: d.name, price: parseFloat(d.price), description: d.description });

  return (
    <Modal
      busy={isLoading}
      open={open}
      onClose={onClose}
      title={defaultValues ? t('editService') : t('addService')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {tc('cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? tc('saving') : tc('save')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          required
          label={t('tableNameCol')}
          placeholder={t('serviceNamePlaceholder')}
          error={errors.name?.message}
          {...register('name')}
        />
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <MoneyInput
              required
              label={`${tc('price')} (R$)`}
              placeholder="0,00"
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value ?? ''}
              onValueChange={(value) => field.onChange(String(value))}
              error={errors.price?.message}
            />
          )}
        />
        <Textarea
          maxLength={300}
          label={`${t('descriptionLabel')} (${tc('optional')})`}
          placeholder={t('descriptionPlaceholder')}
          className="min-h-20"
          {...register('description')}
        />
      </div>
    </Modal>
  );
};
