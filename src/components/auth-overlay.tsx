"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { Target } from "lucide-react";
import { Button } from "./atoms";

export const AuthOverlay: React.FC = () => {
  const { user, isGuest, isLoading, loginWithGoogle, continueAsGuest } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[200] flex flex-col items-center justify-center transition-opacity duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-500 mb-6 relative">
          <div className="absolute inset-0 rounded-full border-2 border-brand-100 -m-1"></div>
        </div>
        <h2 className="text-xl font-display font-bold text-slate-800 animate-pulse">Loading Tracker...</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Preparing your workspace</p>
      </div>
    );
  }

  if (user || isGuest) return null;

  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col items-center justify-center transition-opacity duration-300 p-4">
      <div className="mb-10 text-center animate-fade-in relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-10 w-32 h-32 bg-sky-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-indigo-100 rounded-3xl mx-auto flex items-center justify-center shadow-lg border-4 border-white mb-6">
            <Target className="w-12 h-12 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-3 tracking-tight">
            Daily Practice Tracker
          </h1>
          <p className="hidden md:block text-slate-500 text-lg font-medium max-w-md mx-auto">
            Build consistency, track progress, and achieve mastery in your daily goals.
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 w-full max-w-sm text-center transform transition-all animate-slide-up relative">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          Access Your Tracker
        </p>

        <Button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-brand-200 font-semibold py-3.5 px-6 rounded-2xl shadow-sm mb-4 group focus:ring-4 focus:ring-brand-100"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-[15px]">Sign in with Google</span>
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white/80 px-3 text-slate-400 font-bold tracking-wide">OR</span>
          </div>
        </div>

        <Button
          onClick={continueAsGuest}
          className="w-full text-slate-500 hover:text-slate-800 font-semibold py-3 text-[15px] flex items-center justify-center gap-2 group hover:bg-slate-50 rounded-2xl"
        >
          Continue as Guest
          <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>

      <div className="absolute bottom-8 text-center animate-fade-in opacity-60">
        <p className="text-xs text-slate-400 font-medium">Your data is safe and synced securely.</p>
        <p className="text-xs text-slate-400">Design built with ❤️ for daily practitioners.</p>
      </div>
    </div>
  );
};
