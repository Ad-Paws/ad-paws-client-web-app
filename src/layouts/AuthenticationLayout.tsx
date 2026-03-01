import { Outlet } from "react-router-dom";

export default function AuthenticationLayout() {
  return (
    <div className="fixed inset-0 w-full bg-background overflow-y-auto">
      <div className="min-h-full w-full flex items-center justify-center py-6">
        <Outlet />
      </div>
    </div>
  );
}
