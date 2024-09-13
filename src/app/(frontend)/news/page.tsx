import React from "react";
import type { Metadata } from "next";
import Slider from "@/components/frontend/home/slider";
import Heading from "@/components/frontend/news/heading";
import Gallery from "@/components/frontend/news/gallery";

export const metadata: Metadata = {
  title: "News",
};

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/slider/news`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // or provide fallback data
  }
}

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const slider = await getData();
  if (!slider) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="container flex flex-col items-center justify-center pt-5">
      <Slider slider={slider} />
      <Heading />
      <Gallery searchParams={searchParams} />
    </div>
  );
};

export default Page;
