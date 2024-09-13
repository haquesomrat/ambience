"use client";
import React, { useEffect, useState } from "react";
import { GalleryType } from "@/types/types";
import ImagePreviewer from "../portfolio/imagePreviewer";
import LinkOverLogo from "../linkOverLogo";
import { fakeGalleryData } from "@/lib/fake-data"; // Adjust the path as needed

function Magazine() {
  const [imgs, setImgs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const gallery = fakeGalleryData; // Use the dummy data here
      const activeImgs = gallery
        .filter((item: GalleryType) => item.status === "active")
        .flatMap((item: GalleryType) => item.imgs);
      setImgs(activeImgs);
    } catch (err) {
      setError("Failed to load gallery.");
      console.error(err);
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="h-[1px] w-full bg-gray-300 mt-8"></div>
      <h1 className="text-lightText text-center font-palatino text-[20px] lg:tracking-[5px] tracking-[3px] py-8">
        GALLERY
      </h1>
      {/* magazine */}
      <ImagePreviewer images={imgs} />

      <div className="my-8">
        <LinkOverLogo link="/portfolio" linkHeader="OUR PORTFOLIO" />
      </div>
    </div>
  );
}

export default Magazine;
