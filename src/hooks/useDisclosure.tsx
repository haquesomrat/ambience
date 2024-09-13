import React, { useState } from "react";

function useDisclosure() {
  const [Show, setShow] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  function showMenu(): any {
    if (!Show) {
      setShow(true);
    } else {
      setShow(false);
    }
  }
  return { Show, showMenu, sidebarOpen, setSidebarOpen };
}

export default useDisclosure;
