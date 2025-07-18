
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { YinYang } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const isSupabaseConfigured = !!supabase;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
        toast({
            variant: "destructive",
            title: "Authentication Not Configured",
            description: "Please configure Supabase credentials in your .env file.",
        });
        return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
       if (error.message.includes("Email not confirmed")) {
         toast({
            variant: "destructive",
            title: "Verification Required",
            description: "Please check your email and click the confirmation link before logging in.",
          });
       } else {
         toast({
           variant: "destructive",
           title: "Login Failed",
           description: error.message || "An unexpected error occurred.",
         });
       }
    } else {
      toast({ title: "Login Successful", description: "Welcome back to your cultivation." });
      router.push('/');
      router.refresh(); // Force a refresh to update auth state across components
    }
    setIsLoading(false);
  };

  if (!loading && user) {
      router.push('/');
      return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <YinYang className="w-12 h-12 mx-auto text-primary mb-4" />
          <CardTitle className="text-2xl">Welcome Back, Cultivator</CardTitle>
          <CardDescription>Login to continue your journey on the Dao of Benefits.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="venerable@heaven.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !isSupabaseConfigured}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !isSupabaseConfigured}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !isSupabaseConfigured}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
            {!isSupabaseConfigured && (
                <p className="text-xs text-destructive text-center mt-4">Authentication is not configured. Please add your Supabase credentials to the .env file.</p>
            )}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPageWithAuth() {
    return <LoginPage />;
}
