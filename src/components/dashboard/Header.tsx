import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="pl-9 w-[250px] bg-white/50 border-slate-200 focus:bg-white transition-all"
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-full bg-white/50 border-slate-200">
          <Bell className="h-5 w-5 text-slate-600" />
        </Button>
      </div>
    </header>
  );
}
