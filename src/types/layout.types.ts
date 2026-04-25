export enum EActiveTab {
  TRACKER = "TRACKER",
  NOTEBOOK = "NOTEBOOK",
  VAULT = "VAULT",
}

export interface IHeaderProps {
  activeTab?: EActiveTab;
  onTabChange?: (tab: EActiveTab) => void;
}

export interface INavItem {
  id: EActiveTab;
  label: string;
}
