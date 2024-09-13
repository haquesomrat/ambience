import React from "react";
import type { Metadata } from "next";
import { getPrivacyData } from "@/constants/admin/privacyData";

export const metadata: Metadata = {
  title: "Privacy Information",
};

async function Page() {
  const privacy = await getPrivacyData();
  if (!privacy) {
    return <div>Loading...</div>;
  } else {
    return (
      <article
        className="container prose max-w-none prose-headings:text-lightText prose-headings:font-normal prose-headings:uppercase mx-auto lg:px-48 text-justify text-[16px] [text-align-last:center] font-openSans leading-8 tracking-[2px] font-semibold text-lightText opacity-80 px-10"
        dangerouslySetInnerHTML={{ __html: privacy.description }}
      ></article>
    );
  }
}

export default Page;
