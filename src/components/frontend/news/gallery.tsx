"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaginationControls from "../paginationControl";
import { motion } from "framer-motion";
import { newsType } from "@/types/types";
import axios from "axios";

function Gallery({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [news, setNews] = useState<newsType[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/news`);
        setNews(res.data);
      } catch (err) {
        console.log("Error fetching slider data");
      }
    };
    getData();
  }, []);

  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "6";
  // mocked, skipped and limited in the real app
  const start = (Number(page) - 1) * Number(per_page); // 0, 7, 14 ...
  const end = start + Number(per_page); // 7, 14, 21 ...

  const entries = news?.slice(start, end);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div
        id="gallery"
        className="flex flex-wrap justify-center items-start lg:px-5"
      >
        {entries?.map((data: newsType) => (
          <Link
            href={`/news/${data?.id}`}
            key={data?.id}
            className="flex flex-col md:w-1/3 w-full md:px-5 px-0"
          >
            <div className="pb-5 aspect-4/3 w-auto overflow-hidden">
              <Image
                src={data?.thumbnail}
                width="320"
                height="220"
                alt="award"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pb-10 w-full ">
              <h1 className="font-palatino text-lg text-start tracking-[5px] opacity-70 hover:opacity-90 transition-all ease-in-out duration-200  uppercase mb-2">
                {data.title}
              </h1>
              <p dangerouslySetInnerHTML={{ __html: data.description.length > 100 ? `${data.description.slice(0, 100)}...`: data.description}}>
                
              </p>
            </div>
          </Link>
        ))}
      </div>
      {news && news?.length <= 6 ? (
        <></>
      ) : (
        <div className="flex justify-center pt-10">
          <PaginationControls
            hasNextPage={end < (news?.length || 0)}
            hasPrevPage={start > 0}
            totalData={news?.length || 0}
            route={"news"}
          />
        </div>
      )}
      <div />
    </motion.div>
  );
}

export default Gallery;
