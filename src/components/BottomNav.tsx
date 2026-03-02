import { NavLink } from "react-router-dom";
import {
  HouseIcon,
  PawPrintIcon,
  CalendarIcon,
  UserIcon,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/inicio", icon: <HouseIcon className="w-5 h-5" />, label: "Inicio" },
  {
    to: "/visitantes-perrunos",
    icon: <PawPrintIcon className="w-5 h-5" />,
    label: "Visitantes",
  },
];

const navItemsRight: NavItem[] = [
  {
    to: "/propietarios",
    icon: <CalendarIcon className="w-5 h-5" />,
    label: "Agenda",
  },
  {
    to: "/perfil",
    icon: <UserIcon className="w-5 h-5" />,
    label: "Perfil",
  },
];

export default function BottomNav({
  onCenterPress,
}: {
  onCenterPress?: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <nav className="relative flex items-center justify-around bg-white dark:bg-card rounded-2xl shadow-lg shadow-black/10 border border-border px-2">
        {/* Left items */}
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {/* Center CTA */}
        <button
          type="button"
          onClick={onCenterPress}
          aria-label="Acción principal"
          className="relative -top-5 flex items-center justify-center w-14 h-14 rounded-full bg-secondary shadow-lg shadow-secondary/40 text-white transition-transform active:scale-95 hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Right items */}
        {navItemsRight.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: NavItem) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-colors",
          isActive
            ? "text-accent"
            : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      {icon}
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </NavLink>
  );
}
