import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/useAuth";
import { api } from "@/utils/axios";

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await api.post("/auth/signout");
      router.push("/");
    } catch (err) {
      alert("Logout gagal");
    } finally {
      setLoadingLogout(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-base-300 rounded w-1/3"></div>
          <div className="h-6 bg-base-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow px-6">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Hono Blog</a>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-base-content/80 font-medium">
            Hi, {user.username}
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleLogout}
            disabled={loadingLogout}
          >
            {loadingLogout ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
