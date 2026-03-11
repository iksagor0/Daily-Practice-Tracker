import React, { useState, useEffect } from "react";
import { Target, X } from "lucide-react";
import { ITimeInputModalProps } from "@/types";
import { Modal, Button } from "./atoms";

export const TimeInputModal: React.FC<ITimeInputModalProps> = ({ task, onClose, onSubmit }) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    /* eslint-disable */
    if (task) {
      if (task.targetTime) {
        setTime(String(task.targetTime));
      } else {
        setTime("");
      }
    }
    /* eslint-enable */
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const timeSpent = parseInt(time, 10) || 0;
    onSubmit(task.id, timeSpent);
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={!!task}
      onClose={onClose}
      overlayClassName="z-[100]"
      overlayStyle={{ backgroundColor: 'rgba(241, 245, 249, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm border border-white relative overflow-hidden animate-scale-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10"></div>
        
        <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <span className="text-emerald-600 font-bold text-[10px] tracking-widest uppercase mb-2 block">
              Complete Task
            </span>
            <h2 className="text-xl font-display font-black text-slate-800 tracking-tight leading-tight line-clamp-2 pr-4">
              {task.name}
            </h2>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -mr-2 -mt-2 shrink-0 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:ring-4 focus:ring-slate-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <label className="block text-sm font-extrabold tracking-tight text-slate-700 mb-2">
            Time Spent
          </label>
          <div className="relative mb-3">
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="0"
              min="0"
              required
              autoFocus
              className="w-full text-center px-4 py-4 text-2xl font-display font-black tracking-tight bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 outline-none transition-all placeholder:text-slate-300 text-emerald-600"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-slate-400 font-bold text-sm bg-gradient-to-l from-slate-50 via-slate-50 rounded-r-2xl pl-2">
              min
            </div>
          </div>
          
          <p className="text-xs font-medium text-slate-500 mb-8 flex items-center">
            {task.targetTime ? (
              <>
                <Target className="w-3 h-3 inline mr-1 -mt-0.5" /> Target was {task.targetTime} minutes.
              </>
            ) : (
              "No specific time target. Enter your actual time."
            )}
          </p>
          
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-emerald-500/25 focus:ring-4 focus:ring-emerald-100 flex items-center justify-center gap-2"
          >
            <span>Done</span>
          </Button>
        </form>
      </div>
    </Modal>
  );
};
