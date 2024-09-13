import React from "react";
import type { Metadata } from "next";
// import { getPrivacyData } from "@/constants/admin/privacyData";

export const dummyTermData = {
  description: `
    <h1>Terms and Conditions</h1>
    <p>Welcome to our website. These terms and conditions outline the rules and regulations for the use of our website.</p>
    <h2>Use of the Website</h2>
    <p>By accessing this website, you agree to abide by these terms and conditions. If you do not agree with any part of these terms, you must not use our website.</p>
    <h2>Intellectual Property</h2>
    <p>The content, layout, design, data, and graphics on this website are protected by intellectual property laws.</p>
    <h2>Limitation of Liability</h2>
    <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits.</p>
    <h2>Governing Law</h2>
    <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which we operate.</p>
  `,
};

export const metadata: Metadata = {
  title: "Privacy Information",
};

async function Page() {
  // const privacy = await getPrivacyData();
  const privacy = dummyTermData;
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
