import React from "react";

export interface IProgressRingProps {
  percentage: number;
  className?: string;
}

export interface TogglerProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  closeOnOutsideClick?: boolean;
}

export interface ProgressSvgProps {
  radius: number;
  circumference: number;
  offset: number;
  mounted: boolean;
  className?: string;
}
