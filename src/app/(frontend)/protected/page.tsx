import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LinkOverLogo from "@/components/frontend/linkOverLogo";

export const metadata: Metadata = {
  title: "Portfolio-Private",
};

function Page() {
  return (
    <div className="container mx-auto">
      <div className=" grid lg:grid-cols-2 px-10 py-10 lg:px-40 text-[16px]">
        <div className="flex flex-col items-center justify-center">
          <Link className=" pb-8" href="/beverly-drive">
            <Image
              className="mx-1"
              width="500"
              height="10"
              src="/protected.webp"
              alt="protected"
            />
          </Link>
          <Link
            href="/beverly-drive"
            className="font-palatino text-lg tracking-[5px] opacity-70 hover:opacity-90 transition-all ease-in-out duration-200"
          >
            BEVERLY DRIVE
          </Link>
        </div>
      </div>
      <div className="grid py-10">
        <LinkOverLogo link="/contact" linkHeader="CONTACT US" />
      </div>
    </div>
  );
}

export default Page;
