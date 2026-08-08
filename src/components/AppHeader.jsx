import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { avatarUrl } from "@/lib/avatar";

export function AppHeader({ projectsCount, userEmail, userName }) {
  return (
    <header className="flex items-center justify-between px-5 pt-2 pb-[18px] lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-gradient-to-br from-brand to-[#15A87E] font-mono text-sm font-bold text-brand-foreground">
          ▲
        </div>
        <div>
          <h1 className="text-[17px] font-semibold tracking-tight">Pulse</h1>
          <small className="mt-px block text-[11px] font-medium text-text-dim">
            {projectsCount} project{projectsCount === 1 ? "" : "s"}
          </small>
        </div>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl(userEmail || "pulse")} alt={userName} />
        <AvatarFallback className="bg-secondary text-[11px] text-secondary-foreground">
          {(userName || "U").slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
