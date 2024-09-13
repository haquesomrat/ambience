"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { aboutType } from "@/types/types";
import { deleteAbout } from "./aboutForm";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import ToggleSwitch from "@/components/toggleSwitch";
import axios from "axios";
import { revalidateAbout } from "@/constants/revalidate/route";
import { toast } from "react-toastify";

function AboutInfo({ about }: { about: aboutType[] }) {
  async function updateStatus(id: string) {
    // Show loading toast
    const loadingToast = toast.loading("Updating status...");

    try {
      // Await the axios patch request
      await axios.patch(`/api/about/${id}`, {
        status: "active",
      });

      // Revalidate the data
      revalidateAbout();

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
    <div className="rounded border border-stroke shadow-default bg-black/20 p-5 mt-5 overflow-auto">
      <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-base text-gray-700 uppercase bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3">
              Avatar
            </th>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Sub Title
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {about.map((item) => (
            <tr key={item.id} className="bg-white border-b border-black/20">
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                <Image
                  src={item.avatar[0]}
                  width={100}
                  height={100}
                  alt={`about image`}
                />
              </td>
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4">{item.subTitle}</td>
              <td className="px-6 py-4 w-0.8">
                {item.description.slice(0, 50)}...
              </td>
              <td className="px-6 py-4">
                {item.status === "active" ? (
                  <ToggleSwitch isChecked />
                ) : (
                  <ToggleSwitch
                    handleCheckboxChange={() => updateStatus(item.id)}
                  />
                )}
              </td>
              <td className="px-6 py-4 h-36 text-end flex items-center justify-end gap-2">
                <Link
                  href={`/admin/about/${item.id}`}
                  className="inline-flex items-center justify-center text-xl rounded bg-black p-1.5 text-white hover:bg-black/85"
                >
                  <MdOutlineEdit />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-xl rounded bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                  onClick={() => deleteAbout(item)}
                >
                  <MdOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AboutInfo;
