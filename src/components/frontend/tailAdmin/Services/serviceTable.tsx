"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { serviceType } from "@/types/types";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { deleteService } from "./serviceForm";

function ServiceTable({ service = [] }: { service: serviceType[] }) {
  return (
    <div className="rounded border border-stroke shadow-default bg-black/20 p-5 mt-5 overflow-x-auto">
      <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-base text-gray-700 uppercase bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3">
              Thumbnail
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
              Link Title
            </th>
            <th scope="col" className="px-6 py-3">
              Link
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {service.map((item) => (
            <tr key={item.id} className="bg-white border-b border-black/20">
              <td scope="row" className="px-6 py-4 font-medium text-gray-900">
                {item?.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    width={100}
                    height={100}
                    alt={`service image`}
                  />
                ) : (
                  <div className="inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded">
                    {item.title.charAt(0)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4">
                {item?.subTitle?.length > 50
                  ? `${item.subTitle.slice(0, 50)}...`
                  : item.subTitle}
              </td>
              <td scope="row" className="px-6 py-4 text-gray-900">
                {item?.description.length > 50
                  ? `${item.description.slice(0, 50)}...`
                  : item.description}
              </td>
              <td className="px-6 py-4">
                {item?.link.text.length > 50
                  ? `${item.link.text.slice(0, 50)}...`
                  : item.link.text}
              </td>
              <td className="px-6 py-4">
                {item?.link.plainUrl.length > 50
                  ? `${item.link.plainUrl.slice(0, 50)}...`
                  : item.link.plainUrl}
              </td>

              <td className="px-6 py-4 h-32 text-end inline-flex items-center justify-end gap-2">
                <Link
                  href={`/admin/services/${item.id}`}
                  className="inline-flex items-center justify-center text-xl rounded bg-black p-1.5 text-white hover:bg-black/85"
                >
                  <MdOutlineEdit />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-xl rounded bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                  onClick={() => {
                    deleteService(item);
                  }}
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

export default ServiceTable;
