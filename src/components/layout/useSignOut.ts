'use client';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { logoutSession } from '@/lib/api';
import { ROUTES } from '@/constants';

export function useSignOut() {
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);
  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await queryClient.cancelQueries();
      await logoutSession();
      queryClient.clear();
      window.location.replace(ROUTES.login);
    } catch {
      setSigningOut(false);
    }
  };
  return { signOut, signingOut };
}
