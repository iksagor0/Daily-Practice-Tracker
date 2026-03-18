import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { ModalProps } from "@/types";

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  overlayClassName = "",
  overlayStyle = {},
  closeOnOutsideClick = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center animate-fade-in",
        overlayClassName,
      )}
      style={overlayStyle}
    >
      {children}
    </div>
  );
};
