import React from "react";
import type { Metadata } from "next";
import PortfolioGallery from "@/components/frontend/portfolio/portfolioGallery";
import PaginationControls from "@/components/frontend/paginationControl";
import LinkOverLogo from "@/components/frontend/linkOverLogo";

export const metadata: Metadata = {
  title: "Portfolio",
};

const staticPortfolioData = [
  {
    id: "1",
    title: "Project One",
    imageUrl: "/images/project1.jpg",
    description: "Description of project one",
    status: "active",
  },
  {
    id: "2",
    title: "Project Two",
    imageUrl: "/images/project2.jpg",
    description: "Description of project two",
    status: "active",
  },
];

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const portfolio = staticPortfolioData; // Use the static data

  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "6";

  const start = (Number(page) - 1) * Number(per_page); // 0, 6, 12 ...
  const end = start + Number(per_page); // 6, 12, 18 ...

  const entries = portfolio.slice(start, end);

  return (
    <div className="container pt-5 lg:px-0">
      <PortfolioGallery entries={entries} />
      {portfolio.length <= 6 ? (
        <></>
      ) : (
        <div className="flex justify-center pt-10">
          <PaginationControls
            hasNextPage={end < portfolio.length}
            hasPrevPage={start > 0}
            totalData={portfolio.length}
            route={"portfolio"}
          />
        </div>
      )}

      <div className="lg:my-28 my-10">
        <LinkOverLogo link="/contact" linkHeader="CONTACT US" />
      </div>
    </div>
  );
}

export default Page;
