import { Logo } from "@/components/docubrain/logo";

export function Header() {
  return (
    <header className="border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold font-headline tracking-tight text-foreground">
            DocuBrain API
          </h1>
        </div>
      </div>
    </header>
  );
}
