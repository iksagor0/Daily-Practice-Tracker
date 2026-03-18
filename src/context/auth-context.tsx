"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";

interface IAuthContext {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem("isGuestTracker", "true");
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsGuest(false);
      localStorage.removeItem("isGuestTracker");
      localStorage.removeItem("guestTrackerState"); // Option to wipe guest data on logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    // Check initial guest state from local storage
    const storedGuest = localStorage.getItem("isGuestTracker") === "true";
    if (storedGuest) {
      // eslint-disable-next-line
      setIsGuest(true);
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          setIsGuest(false);
          localStorage.removeItem("isGuestTracker");
        }
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isGuest,
    isLoading,
    loginWithGoogle,
    continueAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
