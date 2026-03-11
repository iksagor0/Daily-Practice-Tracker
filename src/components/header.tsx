import React from "react";
import { LogOut, Target, Music } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { getBDTime } from "@/utils/time";

export const Header: React.FC = () => {
  const { user, isGuest, isLoading, loginWithGoogle, logout } = useAuth();
  const currentBdDate = getBDTime();
  const dateString = format(currentBdDate, "EEEE, MMMM d, yyyy");

  return (
    <header className="pt-10 pb-6 px-4 text-center animate-fade-in">
      <h1 className="text-[28px] md:text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 tracking-tight mb-4">
        <div className="inline-flex items-center justify-center p-1.5 md:p-3 md:mr-3 rounded-2xl bg-gradient-to-br from-brand-100 to-indigo-100 text-brand-600 shadow-sm border border-white">
          <Target className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        Daily Practice Tracker
      </h1>
      <p className="text-slate-500 font-medium text-sm md:text-base mb-6 tracking-wide">
        Build consistency. Track progress. Achieve mastery.
      </p>

      {/* Auth State & Tools */}
      <div className="flex flex-wrap justify-center items-center gap-3">
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-slate-600 font-medium text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {dateString}
        </div>

        {/* Auth Section */}
        {!isLoading && (
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center">
            {user ? (
              <div className="flex items-center gap-2 pl-2 pr-1">
                <img src={user.photoURL || ""} alt="Profile" className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" />
                <span className="text-sm font-bold text-slate-700 max-w-[120px] truncate">{user.displayName}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isGuest ? (
              <div className="flex items-center gap-2 pl-2 pr-1">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-400">G</span>
                </div>
                <span className="text-sm font-bold text-slate-600 italic">Guest</span>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="px-2 py-1 ml-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                >
                  Sync Data
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Clear Guest Data & Exit"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
};
