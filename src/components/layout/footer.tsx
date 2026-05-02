import { APP_COPYRIGHT_TEXT, APP_VERSION } from "@/constants";
import { Code2, Github, Linkedin, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 pb-4 pt-6 border-t border-border_color flex flex-col md:flex-row items-center justify-between gap-6 px-4 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-base_color/50 flex items-center justify-center border border-border_color shadow-sm shrink-0">
            <Code2 className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h4 className="font-extrabold tracking-tight text-sm text-heading_color leading-none">
              Mohammad Ibrahim Khalil
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-heading_color_secondary font-bold uppercase tracking-wider">
                Software Engineer
              </span>
              <div className="w-0.5 h-0.5 rounded-full bg-border_color"></div>
              <div className="flex items-center gap-1 text-xs text-heading_color_secondary font-medium">
                <MapPin className="w-2.5 h-2.5" />
                <span>Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://www.linkedin.com/in/ibrahim-khalil-js/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-xl bg-base_color/50 text-heading_color_secondary hover:text-[#0077b5] hover:bg-[#0077b5]/5 border border-border_color hover:border-[#0077b5]/20 flex items-center justify-center transition-all shadow-xs shrink-0"
            title="Linkedin Profile"
          >
            <Linkedin className="w-4 h-4 fill-current" />
          </Link>
          <Link
            href="https://github.com/iksagor0/Daily-Practice-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-[6.75px] rounded-xl bg-base_color/50 text-heading_color_secondary hover:text-brand-600 hover:bg-brand-50 border border-border_color hover:border-brand-200 transition-all text-xs font-bold shadow-xs shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>Open Source</span>
          </Link>
        </div>
      </div>

      <div className="text-center md:text-right text-heading_color_secondary opacity-60">
        <p className="text-[10px] font-bold tracking-wider uppercase">
          {APP_COPYRIGHT_TEXT}
        </p>
        <p className="text-[9px] font-medium leading-none mt-1">
          {APP_VERSION} • Built with Passion
        </p>
      </div>
    </footer>
  );
};

export default Footer;
