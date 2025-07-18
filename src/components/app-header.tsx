
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { YinYang } from "@/components/icons";
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="relative text-center border-b pb-6">
      <h1 className="font-headline text-4xl font-black tracking-tight flex items-center justify-center gap-3">
        <YinYang className="w-8 h-8 text-primary" />
        DAO OF BENEFITS
      </h1>
      <p className="text-muted-foreground mt-1">
        Every action is a transaction. Calculate your gains.
      </p>
      <div className="absolute top-0 right-0 flex items-center gap-2">
        {user ? (
            <UserNav />
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

    
