import { IResource } from "@/models";

export interface IResourceCardProps {
  resource: IResource;
  onDelete: (id: string) => void;
  onEdit: (resource: IResource) => void;
}

export interface IAddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resource: Partial<IResource>) => void;
  allTags: string[];
  initialResource?: IResource;
}

export interface IVaultHeaderProps {
  totalResources: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export interface IVaultFiltersProps {
  allTags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export interface IVaultGridProps {
  resources: IResource[];
  onDelete: (id: string) => void;
  onEdit: (resource: IResource) => void;
  searchQuery: string;
  selectedTag: string | null;
}
