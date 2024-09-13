"use client";

import Image from "next/image";
import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

function ImagePreviewer({ images }: { images: string[] }) {
  return (
    <PhotoProvider maskClassName="white" maskOpacity={0.9}>
      <div className="grid lg:flex lg:flex-wrap justify-center lg:grid-cols-4 grid-cols-2 md:grid-cols-3">
        {images.map((item, index) => (
          <PhotoView key={index} src={item}>
            <div className="aspect-square lg:w-1/4 md:1/3 1/2 overflow-hidden md:p-3 p-1">
              <Image
                src={item}
                width="450"
                height="100"
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}

export default ImagePreviewer;
