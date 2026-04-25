import { useAppContext } from "@/context/app-context";
import { IResource } from "@/models";
import { IDragState, IVaultGridProps } from "@/types";
import { Library } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ResourceCard from "./resource-card";

const VaultGrid: React.FC<IVaultGridProps> = ({
  resources,
  onDelete,
  onEdit,
  searchQuery,
  selectedTag,
}) => {
  const { dispatch } = useAppContext();
  const [dragState, setDragState] = useState<IDragState<IResource> | null>(
    null,
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePointerDown = (
    e: React.PointerEvent,
    id: string,
    resource: IResource,
  ) => {
    if (e.button !== 0) return; // Only allow left clicks

    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const card = target.closest("[data-resource-id]") as HTMLElement;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    setDragState({
      id,
      task: resource,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      isDragging: false,
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const isDragging =
        dragState.isDragging ||
        Math.abs(e.clientX - dragState.startX) > 3 ||
        Math.abs(e.clientY - dragState.startY) > 3;

      if (isDragging) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const hoveredResourceEl = elements.find((el) =>
          el.getAttribute("data-resource-id"),
        );

        if (hoveredResourceEl) {
          const targetId = hoveredResourceEl.getAttribute("data-resource-id");
          if (targetId && targetId !== dragState.id) {
            const rect = hoveredResourceEl.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const isDraggingRight = e.clientX > dragState.currentX;
            const isDraggingLeft = e.clientX < dragState.currentX;
            const isDraggingDown = e.clientY > dragState.currentY;
            const isDraggingUp = e.clientY < dragState.currentY;

            if (
              (isDraggingRight && e.clientX > centerX) ||
              (isDraggingLeft && e.clientX < centerX) ||
              (isDraggingDown && e.clientY > centerY) ||
              (isDraggingUp && e.clientY < centerY) ||
              (!isDraggingRight &&
                !isDraggingLeft &&
                !isDraggingDown &&
                !isDraggingUp)
            ) {
              dispatch({
                type: "REORDER_RESOURCES",
                payload: { sourceId: dragState.id, targetId },
              });
            }
          }
        }
      }

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              currentX: e.clientX,
              currentY: e.clientY,
              isDragging,
            }
          : null,
      );
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState, dispatch, resources]);

  if (resources.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onDelete={onDelete}
            onEdit={onEdit}
            onCustomDragStart={(e) =>
              handlePointerDown(e, resource.id, resource)
            }
            isHidden={dragState?.id === resource.id && dragState.isDragging}
          />
        ))}

        {isMounted &&
          dragState?.isDragging &&
          createPortal(
            <div
              className="fixed z-[9999] pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl bg-base_color border border-border_color"
              style={{
                width: dragState.width,
                height: dragState.height,
                left: dragState.currentX - dragState.offsetX,
                top: dragState.currentY - dragState.offsetY,
                maxWidth: "400px",
                minWidth: "200px",
              }}
            >
              <div className="absolute -inset-[3px] border-[3px] border-dashed border-primary_color/50 rounded-2xl pointer-events-none z-[10000]" />
              <div className="opacity-80">
                <ResourceCard
                  resource={dragState.task}
                  onDelete={() => {}}
                  onEdit={() => {}}
                />
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-base_color/30 backdrop-blur-sm rounded-4xl border border-dashed border-border_color text-center">
      <div className="w-16 h-16 rounded-3xl bg-primary_color/5 flex items-center justify-center text-disable_color mb-4">
        <Library className="w-8 h-8 opacity-20" />
      </div>
      <h3 className="text-lg font-bold text-heading_color">
        No resources found
      </h3>
      <p className="text-sm text-disable_color mt-1 max-w-[250px]">
        {searchQuery || selectedTag
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Start building your knowledge vault by adding links and study materials."}
      </p>
    </div>
  );
};

export default VaultGrid;
