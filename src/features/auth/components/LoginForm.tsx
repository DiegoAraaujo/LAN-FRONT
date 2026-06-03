"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { useLogin } from "../hooks/useLogin";
import { extractValidationErrors } from "@/lib/api";
import { loginSchema, type LoginInput } from "../schemas/auth.schemas";
import { ROUTES } from "@/constants";

export const LoginForm = () => {
  const t = useTranslations("auth");
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginInput) => {
    login.mutate(data, {
      onError: (err) => {
        const fe = extractValidationErrors(err);
        Object.entries(fe).forEach(([f, m]) =>
          setError(f as keyof LoginInput, { message: m }),
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <EmailField register={register} error={errors.email} />
      <div className="flex flex-col gap-1.5">
        <PasswordField
          register={register}
          error={errors.password}
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-gold-btn"
          {...register("remember")}
        />
        {t("rememberMe")}
      </label>
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={handleSubmit(onSubmit)}
        disabled={login.isPending}
      >
        {login.isPending ? t("signingIn") : t("signIn")}
      </Button>
      <p className="text-sm text-center text-text-muted">
        {t("noAccount")}{" "}
        <Link
          href={ROUTES.signup}
          className="text-gold font-semibold hover:underline"
        >
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
};
