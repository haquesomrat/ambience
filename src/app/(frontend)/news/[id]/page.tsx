"use client";
import { useEffect, useState } from "react";
import { getNewsDataWithId } from "@/constants/admin/newsDataWithID";
import { ParamsType } from "@/types/types";
import Image from "next/image";
import React from "react";
import LinkOverLogo from "@/components/frontend/linkOverLogo";

function NewsId({ params }: { params: ParamsType }) {
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch news data client-side
    const fetchNewsData = async () => {
      try {
        const newsData = await getNewsDataWithId(params.id || "");
        setNews(newsData);
      } catch (error) {
        console.error("Failed to fetch news data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while fetching data
  }

  if (!news) {
    return <p>No news found.</p>; // Handle case when no news data is available
  }

  return (
    <div className="container">
      <div className="py-5">
        <LinkOverLogo link="/news" linkHeader="BACK TO News" />
      </div>
      <h1 className="text-lightText lg:text-start text-center font-palatino text-2xl tracking-[5px] uppercase">
        {news.title}
      </h1>
      <div className="pt-5 flex md:flex-row flex-col md:justify-between items-center text-lightText">
        <p>
          <i>Author:</i> {news.author}
        </p>
        <p>
          <i>Date:</i> {news.formattedDate}, <i>Time:</i> {news.formattedTime}
        </p>
      </div>
      <div className="flex justify-center bg-black pt-[1px] mb-10"></div>
      <div className="flex justify-center items-center">
        <div className="aspect-4/3 lg:w-[50%] overflow-hidden inline-block">
          <Image
            width={1000}
            height={500}
            alt="News Image"
            src={news?.thumbnail}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <p
        className="mt-10 prose max-w-none prose-headings:text-lightText prose-headings:font-normal prose-headings:uppercase text-justify text-[16px] font-openSans leading-8 tracking-[2px] font-semibold text-lightText opacity-80"
        dangerouslySetInnerHTML={{ __html: news?.description }}
      />
    </div>
  );
}

export default NewsId;
