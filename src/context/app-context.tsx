"use client";

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import { ref, set, onValue, off } from "firebase/database";
import { db } from "@/utils/firebase";
import { useAuth } from "./auth-context";
import { ITask, THistory } from "@/models";
import { INITIAL_TASKS } from "@/constants";
import { getEffectiveBDDateStr } from "@/utils/time";

interface IAppState {
  tasks: readonly ITask[];
  history: THistory;
  lastResetTime: string | null;
  isLoaded: boolean;
}

type TAppAction =
  | { type: "LOAD_STATE"; payload: Partial<IAppState> }
  | { type: "ADD_TASK"; payload: ITask }
  | { type: "EDIT_TASK"; payload: Pick<ITask, "id" | "name" | "desc" | "targetTime" | "targetStr" | "icon" | "repeatDaily"> }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "COMPLETE_TASK"; payload: { id: string; timeSpent: number } }
  | { type: "UNDO_TASK"; payload: string }
  | { type: "RUN_DAILY_RESET"; payload: string };

const initialState: IAppState = {
  tasks: INITIAL_TASKS.map(t => ({ ...t, status: "TODO", actualTime: 0, completedAt: undefined })),
  history: [],
  lastResetTime: null,
  isLoaded: false,
};

function appReducer(state: IAppState, action: TAppAction): IAppState {
  switch (action.type) {
    case "LOAD_STATE":
      return { ...state, ...action.payload, isLoaded: true };

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    case "COMPLETE_TASK":
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, status: "DONE", actualTime: action.payload.timeSpent, completedAt: Date.now() }
            : t
        ),
      };

    case "UNDO_TASK":
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload
            ? { ...t, status: "TODO", actualTime: 0, completedAt: undefined }
            : t
        ),
      };

    case "RUN_DAILY_RESET": {
      const todayStr = action.payload;
      if (state.lastResetTime === todayStr) return state;

      const newHistory = [...state.history];
      if (state.tasks.length > 0 && state.lastResetTime) {
        const totalTime = state.tasks.reduce((sum, t) => sum + (t.status === "DONE" ? t.actualTime || 0 : 0), 0);
        newHistory.push({
          date: state.lastResetTime,
          timeSpent: totalTime,
        });
      }

      return {
        ...state,
        history: newHistory,
        tasks: state.tasks.map(t => 
          t.repeatDaily 
            ? { ...t, status: "TODO", actualTime: 0, completedAt: undefined } 
            : t
        ),
        lastResetTime: todayStr,
      };
    }

    default:
      return state;
  }
}

interface IAppContextProps {
  state: IAppState;
  dispatch: React.Dispatch<TAppAction>;
}

const AppContext = createContext<IAppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load Initial State
  useEffect(() => {
    if (isGuest) {
      const saved = localStorage.getItem("guestTrackerState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch({ type: "LOAD_STATE", payload: parsed });
        } catch (e) {
          console.error("Failed to parse guest state", e);
        }
      } else {
        dispatch({ type: "LOAD_STATE", payload: initialState });
      }
      return;
    }

    if (user) {
      const stateRef = ref(db, `users/${user.uid}/trackerState`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onValue(stateRef, (snapshot: any) => {
        if (snapshot.exists()) {
          const parsed = snapshot.val();
          dispatch({ type: "LOAD_STATE", payload: parsed });
        } else {
          // If a user just upgraded from Guest, migrating guest data
          const saved = localStorage.getItem("guestTrackerState");
          if (saved) {
            try {
              dispatch({ type: "LOAD_STATE", payload: JSON.parse(saved) });
            } catch { console.error("Error migrating guest"); }
            localStorage.removeItem("guestTrackerState");
          } else {
            dispatch({ type: "LOAD_STATE", payload: initialState });
          }
        }
      });
      return () => off(stateRef);
    }
  }, [user, isGuest]);

  // Handle Daily Reset dynamically
  useEffect(() => {
    if (!state.isLoaded) return;
    const currentStr = getEffectiveBDDateStr();
    if (state.lastResetTime !== currentStr) {
      dispatch({ type: "RUN_DAILY_RESET", payload: currentStr });
    }
  }, [state.isLoaded, state.lastResetTime]);

  // Sync to Data Source on specific changes
  useEffect(() => {
    if (!state.isLoaded) return;

    if (isGuest) {
      localStorage.setItem("guestTrackerState", JSON.stringify({
         tasks: state.tasks,
         history: state.history,
         lastResetTime: state.lastResetTime
      }));
    } else if (user) {
      const stateRef = ref(db, `users/${user.uid}/trackerState`);
      set(stateRef, {
        tasks: state.tasks,
        history: state.history,
        lastResetTime: state.lastResetTime
      });
    }
  }, [state.tasks, state.history, state.lastResetTime, isGuest, user, state.isLoaded]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
