"use client";

import { APP_NAME } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import Button from "../atoms/button";
import { GoogleIcon } from "../atoms/custom-icons";

const LandingOverlay: React.FC = () => {
  const { user, isGuest, isLoading, loginWithGoogle, continueAsGuest } =
    useAuth();

  useEffect(() => {
    // Lock scroll when overlay is visible
    if (!user && !isGuest && !isLoading) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [user, isGuest, isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[200] flex flex-col items-center justify-center transition-opacity duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-500 mb-6 relative">
          <div className="absolute inset-0 rounded-full border-2 border-brand-100 -m-1"></div>
        </div>
        <h2 className="text-xl font-display font-bold text-slate-800 animate-pulse">
          Loading Tracker...
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Preparing your workspace
        </p>
      </div>
    );
  }

  if (user || isGuest) return null;

  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col items-center justify-center transition-opacity duration-300 p-4 overflow-hidden">
      <div className="mb-10 text-center animate-fade-in relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-10 w-32 h-32 bg-sky-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-lg border-4 border-white mb-6 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-3 tracking-tight">
            {APP_NAME}
          </h1>
          <p className="hidden md:block text-slate-500 text-lg font-medium max-w-md mx-auto">
            Build consistency, track progress, and achieve mastery in your daily
            goals.
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-300 md:shadow-lg w-full max-w-sm text-center transform transition-all animate-slide-up relative">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          Access Your App
        </p>

        <Button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-brand-200 font-semibold py-3.5 px-6 rounded-2xl shadow-sm mb-4 group focus:ring-4 focus:ring-brand-100"
        >
          <GoogleIcon />
          <span className="text-[15px]">Sign in with Google</span>
        </Button>

        <div className="relative mt-6 mb-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white/80 px-3 text-slate-400 font-bold tracking-wide">
              OR
            </span>
          </div>
        </div>

        <Button
          onClick={continueAsGuest}
          className="w-full text-slate-500 hover:text-slate-800 font-semibold py-3 text-[15px] flex items-center justify-center gap-2 group hover:bg-slate-50 rounded-2xl"
        >
          <UserIcon />
          Continue as Guest
        </Button>
      </div>

      <div className="absolute bottom-8 text-center animate-fade-in opacity-60">
        <p className="text-xs text-slate-400 font-medium">
          Your data is safe and synced securely by Google Firebase.
        </p>
        <p className="text-xs text-slate-400">
          Build with ❤️ for daily practitioners, students, and learners.
        </p>
      </div>
    </div>
  );
};

export default LandingOverlay;
