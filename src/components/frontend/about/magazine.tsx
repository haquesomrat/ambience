import React, { useEffect, useState } from "react";
import { GalleryType } from "@/types/types";
import ImagePreviewer from "../portfolio/imagePreviewer";
import LinkOverLogo from "../linkOverLogo";

async function getData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/gallery`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

function Magazine() {
  const [imgs, setImgs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gallery = await getData();
        const activeImgs = gallery
          .filter((item: GalleryType) => item.status === "active")
          .flatMap((item: GalleryType) => item.imgs);
        setImgs(activeImgs);
      } catch (err) {
        setError("Failed to load gallery.");
        console.error(err);
      }
    };
    fetchData();
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
