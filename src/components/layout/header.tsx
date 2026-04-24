"use client";

import { APP_DESCRIPTION, APP_NAME } from "@/constants";
import { format } from "date-fns";
import Image from "next/image";
import React, { useMemo } from "react";
import { CalendarIcon } from "../atoms/custom-icons";
import AuthSection from "./header-auth-section";
import TabNavigation from "./tab-navigation";

const Header: React.FC = () => {
  const getDateString = useMemo(() => {
    const currentDate = new Date();
    return format(currentDate, "EEEE, MMMM d, yyyy");
  }, []);

  return (
    <header className="pt-2 pb-1 px-4 lg:px-8 animate-fade-in flex flex-col gap-4 lg:gap-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain rounded-lg"
          />
          <div className="text-left">
            <h1 className="text-xl md:text-xl font-display font-extrabold text-heading_color tracking-tight leading-none">
              {APP_NAME}
            </h1>
            <p className="text-heading_color_secondary font-medium text-[10px] tracking-wide mt-px">
              {APP_DESCRIPTION}
            </p>
          </div>
        </div>

        {/* Auth State & Tools */}
        <div className="flex items-center gap-1 md:gap-3">
          <div className="bg-base_color px-3 py-[7px] rounded-xl shadow-xs border border-border_color text-heading_color_secondary font-bold text-xs md:text-xs flex items-center gap-2 truncate whitespace-nowrap">
            <CalendarIcon className="w-5 h-5 text-brand-500" />
            {getDateString}
          </div>

          <AuthSection />
        </div>
      </div>

      <TabNavigation />
    </header>
  );
};

export default Header;
