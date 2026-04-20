import { TActiveTab } from "@/app/page";

export interface IHeaderProps {
  activeTab?: TActiveTab;
  onTabChange?: (tab: TActiveTab) => void;
}
