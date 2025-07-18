
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, getAuth, signOut, User } from 'firebase/auth';
import { app as firebaseApp } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { YinYang } from '@/components/icons';

const auth = getAuth(firebaseApp);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        router.push('/');
      })
      .catch(error => console.error("Logout failed:", error));
  };

  const value = { user, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


export const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isAuthRoute = pathname === '/login' || pathname === '/signup';

    useEffect(() => {
        if (!loading && user && isAuthRoute) {
            router.push('/');
        }
    }, [user, loading, router, pathname, isAuthRoute]);

    if (loading) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <YinYang className="w-12 h-12 animate-pulse text-primary" />
            </div>
        );
    }
    
    return <>{children}</>;
};

    