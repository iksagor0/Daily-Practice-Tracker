"use client";

import { FirebaseError } from "firebase/app";
import {
  User,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, googleProvider } from "@/utils/firebase";

enum EAuthErrorCode {
  POPUP_BLOCKED = "auth/popup-blocked",
}

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
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === EAuthErrorCode.POPUP_BLOCKED
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect Auth Error:", redirectError);
          setIsLoading(false);
        }
      } else {
        console.error("Auth Error:", error);
        setIsLoading(false);
      }
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

    const handleRedirect = async (): Promise<void> => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
          setIsGuest(false);
          localStorage.removeItem("isGuestTracker");
        }
      } catch (error) {
        console.error("Redirect Result Error:", error);
      }
    };

    handleRedirect();

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
