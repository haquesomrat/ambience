"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { portfolioType } from "@/types/types";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { deletePortfolio } from "./porfolioUpdateForm";

function portfolioTable({ portfolio }: { portfolio: portfolioType[] }) {
  return (
    <div className="rounded border border-stroke shadow-default overflow-x-auto mt-5 bg-black/20 p-5">
      <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-base text-gray-700 uppercase bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Thumbnail
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Gallery
            </th>
            <th scope="col" className="px-6 py-3 text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item) => (
            <tr key={item.id} className="bg-white border-b border-black/20">
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4">{item.description}</td>
              <td
                scope="row"
                className="px-6 py-4 lg:w-40 font-medium text-gray-900"
              >
                <div className="aspect-square lg:w-40 w-20 inline-block overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    width={200}
                    height={200}
                    alt={`portfolio image`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>
              <td
                scope="row"
                className="py-4 font-medium text-gray-900 lg:w-[12rem]"
              >
                <div className="flex flex-wrap justify-center lg:w-full w-[6rem]">
                  {item.gallery.map((img, index) =>
                    index < 4 ? (
                      <div
                        key={img}
                        className="aspect-square lg:w-20 w-10 lg:p-[2px] p-[1px]"
                      >
                        <Image
                          src={img}
                          width={100}
                          height={100}
                          alt={`portfolio image`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span key={img}></span>
                    )
                  )}
                </div>
              </td>
              <td className="px-6 py-4 w-full lg:h-56 h-32 text-end inline-flex items-center justify-end gap-2">
                <Link
                  href={`/admin/portfolio/${item.id}`}
                  className="inline-flex items-center justify-center text-xl rounded bg-black p-1.5 text-white hover:bg-black/85"
                >
                  <MdOutlineEdit />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-xl rounded bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                  onClick={() => {
                    deletePortfolio(item);
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

export default portfolioTable;
