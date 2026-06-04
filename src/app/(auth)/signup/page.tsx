import { SignupForm } from "@/features/auth/components/SignupForm";
import Image from "next/image";
import LanLogo from "../../../assets/lan.png";

const SignupPage = () => (
  <div className="flex flex-col items-center w-full max-w-sm">
    <Image src={LanLogo} alt="lan logo" height={88} />

    <h1 className="text-2xl font-bold text-text mb-1 text-center">
      Criar sua conta
    </h1>
    <p className="text-sm text-text-muted mb-4 text-center">
      Preencha os dados abaixo para começar
    </p>
    <div className="bg-surface rounded-2xl p-7 w-full shadow-sm border border-border">
      <SignupForm />
    </div>
  </div>
);

export default SignupPage;
