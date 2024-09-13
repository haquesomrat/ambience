import React from "react";
import type { Metadata } from "next";
import Loading from "../loading";
import { getAboutData } from "@/constants/admin/aboutData";
import Magazine from "@/components/frontend/about/magazine";
import ClientInfo from "@/components/frontend/about/clientInfo";

export const metadata: Metadata = {
  title: "About",
};

async function Page() {
  const about = await getAboutData();

  if (!about) {
    return <Loading />;
  }

  return (
    <div className="container">
      <ClientInfo about={about} />
      <Magazine />
    </div>
  );
}

export default Page;
