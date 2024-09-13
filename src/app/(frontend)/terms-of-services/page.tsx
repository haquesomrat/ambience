import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Services",
};

async function getTermData() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/privacy-term/terms`,
      {
        next: { tags: ["privacyTerms"] },
      }
    );
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function Page() {
  const terms = await getTermData();
  if (!terms) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="container mx-auto text-justify text-[16px] [text-align-last:center] font-openSans leading-8 tracking-[2px] font-semibold text-lightText opacity-80">
        {/* TERMS AND CONDITIONS  */}
        <article
          className="prose max-w-none prose-headings:text-lightText prose-headings:font-normal prose-headings:uppercase"
          dangerouslySetInnerHTML={{ __html: terms.description }}
        ></article>
      </div>
    );
  }
}

export default Page;
