
import { YinYang } from "@/components/icons";

export function AppHeader() {
  return (
    <header className="text-center border-b pb-6">
      <h1 className="font-headline text-4xl font-black tracking-tight flex items-center justify-center gap-3">
        <YinYang className="w-8 h-8 text-primary" />
        DAO OF BENEFITS
      </h1>
      <p className="text-muted-foreground mt-1">
        Every action is a transaction. Calculate your gains.
      </p>
    </header>
  );
}

    