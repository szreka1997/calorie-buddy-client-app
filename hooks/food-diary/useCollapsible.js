import { useState } from "react";

function useCollapsible() {
  const [isOpen, setIsOpen] = useState(false);

  function openCollapsible() {
    if (!isOpen) setIsOpen(true);
  }

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return {
    isOpen,
    openCollapsible,
    toggle,
  };
}

export default useCollapsible;
