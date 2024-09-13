import React from "react";
import { LuLoader2 } from "react-icons/lu";

function Loading() {
  return (
    <div>
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <LuLoader2 className="animate-spin text-6xl" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
