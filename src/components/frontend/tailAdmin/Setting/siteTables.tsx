"use client"
import { settingType } from "@/types/types";
import Link from "next/link";
import React from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { siteDeleteHandler } from "./siteForm";

function SiteTable({ settings }: { settings: settingType[] }) {
  return (
    <div className="relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting: settingType) => (
            <tr key={setting.id} className="bg-white border-b border-black/20">
              <td className="px-6 py-4 capitalize">{setting.name}</td>
              <td className="px-6 py-4">{setting.description}</td>
              <td className="px-6 py-4 text-end flex items-center justify-end gap-2">
                <Link
                  href={`/admin/site/${setting.id}`}
                  className="inline-flex items-center justify-center text-xl rounded bg-black p-1.5 text-white hover:bg-black/85"
                >
                  <MdOutlineEdit />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-xl rounded bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                  onClick={()=>{siteDeleteHandler(setting.id)}}
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

export default SiteTable;
