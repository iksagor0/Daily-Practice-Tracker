import { useAuth } from "@/context/auth-context";
import { IHeaderProps } from "@/types";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { LogOut } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";
import Button from "../atoms/button";
import { CalendarIcon } from "../atoms/custom-icons";

const Header: React.FC<IHeaderProps> = ({
  activeTab = "TRACKER",
  onTabChange,
}) => {
  const { user, isGuest, isLoading, loginWithGoogle, logout } = useAuth();

  const getDateString = useMemo(() => {
    const currentDate = new Date();
    return format(currentDate, "EEEE, MMMM d, yyyy");
  }, []);

  return (
    <header className="pt-2 pb-1 px-4 lg:px-8 animate-fade-in flex flex-col gap-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
          <div className="text-left">
            <h1 className="text-xl md:text-xl font-display font-extrabold text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-brand-900 to-slate-900 tracking-tight leading-none">
              Daily Practice Tracker
            </h1>
            <p className="hidden md:block text-slate-500 font-medium text-[10px] tracking-wide mt-px">
              Build consistency. Track progress. Achieve mastery.
            </p>
          </div>
        </div>

        {/* Auth State & Tools */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-200 text-slate-600 font-bold text-[11px] md:text-xs flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-brand-500" />
            {getDateString}
          </div>

          {/* Auth Section */}
          {!isLoading && (
            <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200 flex items-center">
              {user ? (
                <div className="flex items-center gap-2 pl-2 pr-1">
                  <Image
                    src={user?.photoURL || "/default-avatar.png"}
                    alt="Profile"
                    width={20}
                    height={20}
                    className="rounded-full border border-slate-200 shadow-xs"
                  />
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate hidden sm:inline-block">
                    {user?.displayName}
                  </span>
                  <Button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : isGuest ? (
                <div className="flex items-center gap-1.5 pl-2 pr-1">
                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">
                      G
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 italic hidden sm:inline-block">
                    Guest
                  </span>
                  <Button
                    onClick={loginWithGoogle}
                    className="px-2 py-1 ml-1 rounded-lg text-[10px] font-bold bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                  >
                    Sync
                  </Button>
                  <Button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Clear Guest Data & Exit"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      {onTabChange && (
        <nav className="flex justify-center border-b border-solid border-black/5 pb-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTabChange("TRACKER")}
              className={cn(
                "px-5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out relative",
                {
                  "bg-brand-600/10 text-brand-600": activeTab === "TRACKER",
                  "text-slate-500 hover:text-slate-700 hover:bg-brand-600/10":
                    activeTab !== "TRACKER",
                },
              )}
            >
              Task Tracker
            </button>
            <button
              onClick={() => onTabChange("NOTEBOOK")}
              className={cn(
                "px-5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ease-out relative",
                {
                  "bg-brand-600/10 text-brand-600": activeTab === "NOTEBOOK",
                  "text-slate-500 hover:text-slate-700 hover:bg-brand-600/10":
                    activeTab !== "NOTEBOOK",
                },
              )}
            >
              Notebook
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
