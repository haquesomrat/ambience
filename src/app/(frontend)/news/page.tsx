import React from "react";
import type { Metadata } from "next";
import Slider from "@/components/frontend/home/slider";
import Heading from "@/components/frontend/news/heading";
import Gallery from "@/components/frontend/news/gallery";
import { fakeSliderData } from "@/lib/fake-data";

export const metadata: Metadata = {
  title: "News",
};

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const slider = fakeSliderData;

  return (
    <div className="container flex flex-col items-center justify-center pt-5">
      <Slider slider={slider} />
      <Heading />
      <Gallery searchParams={searchParams} />
    </div>
  );
};

export default Page;
