import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";

export default function DashboardLayout() {
  return (
    <div className="h-dvh w-full bg-background dark:bg-background-dark">
      <main className={cn("h-full transition-all duration-300 ease-in-out")}>
        <div className="h-full flex flex-col pb-24">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
