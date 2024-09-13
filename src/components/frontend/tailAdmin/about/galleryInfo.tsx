"use client";
import ToggleSwitch from "@/components/toggleSwitch";
import { revalidateGallery } from "@/constants/revalidate/route";
import { GalleryType } from "@/types/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdModeEditOutline } from "react-icons/md";
import { toast } from "react-toastify";

function GalleryInfo({ gallery }: { gallery: GalleryType }) {
  async function updateStatus(id: string) {
    // Show loading toast
    const loadingToast = toast.loading("Updating status...");

    try {
      // Await the axios patch request
      await axios.patch(`/api/gallery/${id}`, {
        status: "active",
      });

      // Revalidate the data
      revalidateGallery();

      // Update the toast on success
      toast.update(loadingToast, {
        render: "Status updated successfully 👌",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Auto close after 3 seconds
      });
    } catch (error) {
      // Update the toast on error
      toast.update(loadingToast, {
        render: "Failed to update status 🤯",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      console.error("Error updating status", error);
    }
  }

  return (
    <div className="border border-stroke bg-black/20 p-5 shadow-default mt-8">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold text-black capitalize">
          Gallery
        </h1>
        <div className="flex gap-5">
          {gallery.status === "active" ? (
            <ToggleSwitch isChecked />
          ) : (
            <ToggleSwitch
              handleCheckboxChange={() => updateStatus(gallery.id)}
            />
          )}
          <Link
            href={`/admin/gallery/${gallery.id}`}
            className="inline-flex items-center justify-center bg-black p-2 text-center font-medium text-white hover:bg-opacity-90 rounded "
          >
            <MdModeEditOutline className="text-2xl" />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap justify-center lg:justify-start gap-5 h-[20rem] overflow-y-auto">
        {gallery.imgs.map((image) => (
          <div
            key={image}
            className="aspect-square w-40 h-40 inline-block overflow-hidden"
          >
            <Image
              src={image}
              alt="img-home"
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryInfo;
