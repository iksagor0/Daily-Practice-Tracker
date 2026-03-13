import React from "react";
import { Github, Linkedin, MapPin, Code2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 pb-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 px-4 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100 shadow-sm shrink-0">
            <Code2 className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h4 className="font-extrabold tracking-tight text-sm text-slate-800 leading-none">
              Mohammad Ibrahim Khalil
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Software Engineer
              </span>
              <div className="w-0.5 h-0.5 rounded-full bg-slate-300"></div>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <MapPin className="w-2.5 h-2.5" />
                <span>Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/iksagor0/Daily-Practice-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-[6.75px] rounded-xl bg-slate-50 text-slate-600 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 transition-all text-xs font-bold shadow-xs shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>Open Source</span>
          </a>
          <a
            href="https://www.linkedin.com/in/ibrahim-khalil-js/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:text-[#0077b5] hover:bg-[#0077b5]/5 border border-slate-200 hover:border-[#0077b5]/20 flex items-center justify-center transition-all shadow-xs shrink-0"
            title="Linkedin Profile"
          >
            <Linkedin className="w-4 h-4 fill-current" />
          </a>
        </div>
      </div>

      <div className="text-right">
        <p className="text-slate-300 text-[10px] font-bold tracking-wider uppercase">
          © {new Date().getFullYear()} Daily Practice Tracker
        </p>
        <p className="text-slate-300 text-[9px] font-medium leading-none mt-1">
          v1.0.0 • Built with Passion
        </p>
      </div>
    </footer>
  );
};
