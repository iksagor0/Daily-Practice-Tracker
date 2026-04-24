"use client";

import { useAppContext } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { EActiveTab } from "@/types";
import { LogOut } from "lucide-react";
import Image from "next/image";
import React from "react";
import Button from "../atoms/button";

const AuthSection: React.FC = () => {
  const { user, isGuest, isLoading, loginWithGoogle, logout } = useAuth();
  const { dispatch } = useAppContext();

  const handleLogout = () => {
    logout();
    dispatch({ type: "SET_ACTIVE_TAB", payload: EActiveTab.TRACKER });
  };

  if (isLoading) return null;

  return (
    <div className="bg-base_color p-1 rounded-xl shadow-xs border border-border_color flex items-center">
      {user ? (
        <div className="flex items-center gap-2 pl-2 pr-1">
          <Image
            src={user?.photoURL || "/default-avatar.png"}
            alt="Profile"
            width={20}
            height={20}
            className="rounded-full border border-border_color shadow-xs"
          />
          <span className="text-xs font-bold text-heading_color max-w-[100px] truncate">
            {user?.displayName}
          </span>
          <Button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : isGuest ? (
        <div className="flex items-center gap-1.5 pl-2 pr-1">
          <div className="w-5 h-5 rounded-full bg-base_color/50 border border-border_color flex items-center justify-center">
            <span className="text-[10px] font-bold text-disable_color">G</span>
          </div>
          <span className="text-xs font-bold text-heading_color_secondary italic hidden sm:inline-block">
            Guest
          </span>
          <Button
            onClick={loginWithGoogle}
            className="px-2 py-1 ml-1 rounded-lg text-[10px] font-bold bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
          >
            Sync
          </Button>
          <Button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            title="Clear Guest Data & Exit"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default AuthSection;
