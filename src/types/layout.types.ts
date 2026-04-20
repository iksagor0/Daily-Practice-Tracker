export enum EActiveTab {
  TRACKER = "TRACKER",
  NOTEBOOK = "NOTEBOOK",
}

export interface IHeaderProps {
  activeTab?: EActiveTab;
  onTabChange?: (tab: EActiveTab) => void;
}
