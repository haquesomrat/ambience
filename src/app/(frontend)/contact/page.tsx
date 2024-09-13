import React from "react";
import type { Metadata } from "next";
import Slider from "@/components/frontend/home/slider";
import ContactBox from "@/components/frontend/contact/contactBox";
import Form from "@/components/frontend/contact/form";
import { fakeSliderData } from "@/lib/fake-data";

export const metadata: Metadata = {
  title: "Contact",
};

// async function getData() {
//   try {
//     const res = await fetch(`${process.env.NEXTAUTH_URL}/api/slider/contact`);
//     // The return value is *not* serialized
//     // You can return Date, Map, Set, etc.

//     if (!res.ok) {
//       // This will activate the closest `error.js` Error Boundary
//       throw new Error("Failed to fetch data");
//     }

//     return res.json();
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

async function Page() {
  // const slider = await getData();
  const slider = fakeSliderData;
  return (
    <div className="container">
      <Slider slider={slider} />
      <div className="lg:flex justify-between items-start min-w-[59.6%] gap-5 pt-3">
        <ContactBox />
        <Form />
      </div>
    </div>
  );
}

export default Page;
