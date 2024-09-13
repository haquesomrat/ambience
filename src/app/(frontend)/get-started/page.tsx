import React from "react";
import type { Metadata } from "next";
import AccordionComponent from "@/components/frontend/getStarted/accordion";

export const metadata: Metadata = {
  title: "Get Started",
};

async function Page() {
  return (
    <div className="container">
      <h1 className="header font-palatino text-lightText text-[24px] tracking-[5px] text-center py-5">
        F.A.Q
      </h1>
      <AccordionComponent />
    </div>
  );
}

export default Page;
