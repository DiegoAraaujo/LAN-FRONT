import Image from "next/image";
import { LoginForm } from "@/features/auth/components/LoginForm";
import LanLogo from "../../../assets/lan.png";

const LoginPage = () => (
  <div className="flex flex-col items-center w-full max-w-sm">
    <Image src={LanLogo} alt="lan logo"  height={88} />
    <h1 className="text-2xl font-bold text-text mb-1 text-center">
      Bem-vindo de volta
    </h1>
    <p className="text-sm text-text-muted mb-4 text-center">
      Acesse sua conta para gerenciar os serviços
    </p>
    <div className="bg-surface rounded-2xl p-7 w-full shadow-sm border border-border">
      <LoginForm />
    </div>
  </div>
);

export default LoginPage;
