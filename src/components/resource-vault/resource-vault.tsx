import { useAppContext } from "@/context/app-context";
import { IResource } from "@/models";
import React, { useCallback, useMemo, useState } from "react";
import AddResourceModal from "./add-resource-modal";
import VaultFilters from "./vault-filters";
import VaultGrid from "./vault-grid";
import VaultHeader from "./vault-header";

const ResourceVault: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<IResource | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    state?.resources?.forEach((r) => r?.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [state?.resources]);

  const filteredResources = useMemo(() => {
    return state?.resources?.filter((r) => {
      const matchesSearch =
        r?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r?.url?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || r?.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [state?.resources, searchQuery, selectedTag]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingResource(null);
  }, []);

  const handleAddResource = useCallback(
    (data: Partial<IResource>) => {
      if (editingResource) {
        const updatedResource: IResource = {
          ...editingResource,
          ...data,
          updatedAt: Date.now(),
        } as IResource;
        dispatch({ type: "UPDATE_RESOURCE", payload: updatedResource });
      } else {
        const newResource: IResource = {
          id: crypto.randomUUID(),
          title: data.title || "Untitled",
          url: data.url || "",
          tags: data.tags || [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        dispatch({ type: "ADD_RESOURCE", payload: newResource });
      }
      handleCloseModal();
    },
    [dispatch, editingResource, handleCloseModal],
  );

  const handleEditResource = useCallback((resource: IResource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  }, []);

  const handleDeleteResource = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this resource?")) {
        dispatch({ type: "DELETE_RESOURCE", payload: id });
      }
    },
    [dispatch],
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-12">
      <VaultHeader
        totalResources={state?.resources.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsModalOpen(true)}
      />

      <VaultFilters
        allTags={allTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      <VaultGrid
        resources={filteredResources}
        onDelete={handleDeleteResource}
        onEdit={handleEditResource}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
      />

      <AddResourceModal
        key={isModalOpen ? (editingResource ? `edit-${editingResource.id}` : "add") : "closed"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddResource}
        allTags={allTags}
        initialResource={editingResource || undefined}
      />
    </div>
  );
};

export default ResourceVault;
