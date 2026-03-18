"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { ref, set, onValue, off } from "firebase/database";
import { db } from "@/utils/firebase";
import { useAuth } from "./auth-context";
import { ITask, THistory } from "@/models";
import { INITIAL_TASKS } from "@/constants";
import { getEffectiveBDDateStr } from "@/utils/time";
import { sanitizeForFirebase } from "@/utils/sanitize";

interface IAppState {
  tasks: readonly ITask[];
  history: THistory;
  lastResetTime: string | null;
  isLoaded: boolean;
  theme:
    | "default"
    | "sakura"
    | "ocean"
    | "earth"
    | "mint"
    | "aurora"
    | "sunset"
    | "forest"
    | "nordic"
    | "lavender";
  loadedFor: string | "guest" | null;
}

type TAppAction =
  | { type: "RESET_STATE" }
  | { type: "LOAD_STATE"; payload: Partial<IAppState> & { loadedFor: string | "guest" } }
  | { type: "ADD_TASK"; payload: ITask }
  | {
      type: "EDIT_TASK";
      payload: Pick<
        ITask,
        | "id"
        | "name"
        | "desc"
        | "targetTime"
        | "targetStr"
        | "icon"
        | "repeatDaily"
      >;
    }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "COMPLETE_TASK"; payload: { id: string; timeSpent: number } }
  | { type: "UNDO_TASK"; payload: string }
  | { type: "RUN_DAILY_RESET"; payload: string }
  | { type: "SET_THEME"; payload: IAppState["theme"] }
  | { type: "REORDER_TASKS"; payload: { sourceId: string; targetId: string } };

const initialState: IAppState = {
  tasks: [],
  history: [],
  lastResetTime: null,
  isLoaded: false,
  theme: "default",
  loadedFor: null,
};

function appReducer(state: IAppState, action: TAppAction): IAppState {
  switch (action.type) {
    case "RESET_STATE":
      return { ...initialState };

    case "LOAD_STATE": {
      const payload = action.payload;
      // If it's a completely fresh user (no tasks, no history, no last reset), give them initial tasks
      const isNewUser =
        !payload.lastResetTime &&
        (!payload.tasks || payload.tasks.length === 0) &&
        (!payload.history || payload.history.length === 0);

      const tasks = isNewUser
        ? INITIAL_TASKS.map((t) => ({
            ...t,
            status: "TODO" as const,
            actualTime: 0,
            completedAt: undefined,
          }))
        : payload.tasks || [];

      return {
        ...state,
        ...payload,
        tasks,
        loadedFor: payload.loadedFor,
        isLoaded: true,
      };
    }

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t,
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case "COMPLETE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                status: "DONE",
                actualTime: action.payload.timeSpent,
                completedAt: Date.now(),
              }
            : t,
        ),
      };

    case "UNDO_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: "TODO", actualTime: 0, completedAt: undefined }
            : t,
        ),
      };

    case "RUN_DAILY_RESET": {
      const todayStr = action.payload;
      if (state.lastResetTime === todayStr) return state;

      const newHistory = [...state.history];
      if (state.tasks.length > 0 && state.lastResetTime) {
        const totalTime = state.tasks.reduce(
          (sum, t) => sum + (t.status === "DONE" ? t.actualTime || 0 : 0),
          0,
        );
        newHistory.push({
          date: state.lastResetTime,
          timeSpent: totalTime,
        });
      }

      return {
        ...state,
        history: newHistory,
        tasks: state.tasks.map((t) =>
          t.repeatDaily
            ? { ...t, status: "TODO", actualTime: 0, completedAt: undefined }
            : t,
        ),
        lastResetTime: todayStr,
      };
    }

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "REORDER_TASKS": {
      const { sourceId, targetId } = action.payload;
      const tasks = [...state.tasks];
      const sourceIndex = tasks.findIndex((t) => t.id === sourceId);
      const targetIndex = tasks.findIndex((t) => t.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return state;

      const [movedTask] = tasks.splice(sourceIndex, 1);
      tasks.splice(targetIndex, 0, movedTask);

      return { ...state, tasks };
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isGuest } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load Initial State
  useEffect(() => {
    // CRITICAL: Reset loaded status and state immediately whenever user identity changes
    // to prevent Guest data from leaking into and overwriting User data in Firebase.
    dispatch({ type: "RESET_STATE" });

    if (isGuest) {
      const saved = localStorage.getItem("guestTrackerState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          dispatch({
            type: "LOAD_STATE",
            payload: { ...parsed, loadedFor: "guest" },
          });
        } catch (e) {
          console.error("Failed to parse guest state", e);
          dispatch({ type: "LOAD_STATE", payload: { loadedFor: "guest" } });
        }
      } else {
        dispatch({ type: "LOAD_STATE", payload: { loadedFor: "guest" } });
      }
      return;
    }

    if (user) {
      const stateRef = ref(db, `users/${user.uid}/trackerState`);
      onValue(stateRef, (snapshot) => {
        if (snapshot.exists()) {
          const parsed = snapshot.val();
          // PRIORITIZE GOOGLE DATA: Load existing cloud data
          dispatch({
            type: "LOAD_STATE",
            payload: { ...parsed, loadedFor: user.uid },
          });
        } else {
          // If a new user just upgraded from Guest, migrating guest data
          const saved = localStorage.getItem("guestTrackerState");
          if (saved) {
            try {
              const guestData = JSON.parse(saved);
              dispatch({
                type: "LOAD_STATE",
                payload: { ...guestData, loadedFor: user.uid },
              });
            } catch {
              console.error("Error migrating guest");
              dispatch({ type: "LOAD_STATE", payload: { loadedFor: user.uid } });
            }
            localStorage.removeItem("guestTrackerState");
          } else {
            dispatch({
              type: "LOAD_STATE",
              payload: { loadedFor: user.uid },
            });
          }
        }
      });
      return () => off(stateRef);
    }
  }, [user?.uid, isGuest, user]);

  // Apply Theme to DOM
  useEffect(() => {
    if (state.theme && state.isLoaded) {
      document.documentElement.setAttribute("data-theme", state.theme);
    }
  }, [state.theme, state.isLoaded]);

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
    // DO NOT SYNC if state is not loaded or if user identity is in transition
    if (!state.isLoaded || !state.loadedFor) return;

    const currentIdentity = isGuest ? "guest" : user?.uid;
    // CRITICAL: Prevent syncing if the state in memory belongs to a different user/context
    if (state.loadedFor !== currentIdentity) {
      console.warn("Sync blocked: identity mismatch");
      return;
    }

    if (isGuest) {
      localStorage.setItem(
        "guestTrackerState",
        JSON.stringify({
          tasks: state.tasks,
          history: state.history,
          lastResetTime: state.lastResetTime,
          theme: state.theme,
        }),
      );
    } else if (user) {
      const stateRef = ref(db, `users/${user.uid}/trackerState`);
      set(
        stateRef,
        sanitizeForFirebase({
          tasks: state.tasks,
          history: state.history,
          lastResetTime: state.lastResetTime,
          theme: state.theme,
        }),
      );
    }
  }, [
    state.tasks,
    state.history,
    state.lastResetTime,
    state.theme,
    isGuest,
    user?.uid,
    state.isLoaded,
    state.loadedFor,
    user,
  ]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
