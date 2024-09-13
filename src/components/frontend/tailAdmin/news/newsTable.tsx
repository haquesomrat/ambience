"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { newsType } from "@/types/types";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { deleteNews } from "./newsForm"; // Assuming `getNewsData` fetches the news data
import { getNewsData } from "@/constants/admin/newsData";

function NewsTable() {
  const [news, setNews] = useState<newsType[]>([]);
  const [loading, setLoadin] = useState<boolean>(false);
  // Fetch news data on component mount using useEffect
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const newsData = await getNewsData();
        setNews(newsData);
      } catch (error) {
        console.error("Failed to fetch news data:", error);
      }
    };

    fetchNewsData();
  },);

  return (
    <div className="rounded border border-stroke shadow-default bg-black/20 p-5 mt-5 overflow-auto">
      <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-base text-gray-700 uppercase bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3">
              Thumbnail
            </th>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Author
            </th>
            <th scope="col" className="px-6 py-3">
              Time
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id} className="bg-white border-b border-black/20">
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                <Image
                  src={item.thumbnail}
                  width={100}
                  height={100}
                  alt={`Thumbnail for ${item.title}`}
                />
              </td>
              <td className="px-6 py-4">{item.title}</td>
              {item.description && (
                <td
                  className="px-6 py-4 w-0.8"
                  dangerouslySetInnerHTML={{
                    __html: item.description.slice(0, 50) + "...",
                  }}
                ></td>
              )}
              <td className="px-6 py-4">{item.author}</td>
              <td className="px-6 py-4">{item.time.split("T")[0]}</td>
              <td className="px-6 py-4 h-32 text-end inline-flex items-center justify-end gap-2">
                <Link
                  href={`/admin/news/${item.id}`}
                  className="inline-flex items-center justify-center text-xl rounded bg-black p-1.5 text-white hover:bg-black/85"
                >
                  <MdOutlineEdit />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center text-xl rounded bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                  onClick={() => deleteNews(item)}
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

export default NewsTable;
