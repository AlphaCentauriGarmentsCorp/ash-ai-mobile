import { useState } from 'react';

interface UseDropdownMenuReturn {
  activeIndex: number | null;
  isOpen: (index: number) => boolean;
  toggle: (index: number) => void;
  open: (index: number) => void;
  close: () => void;
  closeAll: () => void;
}

export function useDropdownMenu(): UseDropdownMenuReturn {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isOpen = (index: number): boolean => {
    return activeIndex === index;
  };

  const toggle = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close if clicking the same one
    } else {
      setActiveIndex(index); // Open the new one
    }
  };

  const open = (index: number) => {
    setActiveIndex(index);
  };

  const close = () => {
    setActiveIndex(null);
  };

  const closeAll = () => {
    setActiveIndex(null);
  };

  return {
    activeIndex,
    isOpen,
    toggle,
    open,
    close,
    closeAll,
  };
}

export default useDropdownMenu;
