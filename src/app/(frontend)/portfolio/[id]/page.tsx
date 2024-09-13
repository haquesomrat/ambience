import LinkOverLogo from "@/components/frontend/linkOverLogo";
import ImagePreviewer from "@/components/frontend/portfolio/imagePreviewer";
import { ParamsType } from "@/types/types";
import Image from "next/image";
import React from "react";

// Static portfolio data
const staticPortfolioData = [
  {
    id: "1",
    title: "Portfolio One",
    description: "This is the description for Portfolio One.",
    gallery: ["/images/portfolio1-1.jpg", "/images/portfolio1-2.jpg"],
  },
  {
    id: "2",
    title: "Portfolio Two",
    description: "This is the description for Portfolio Two.",
    gallery: ["/images/portfolio2-1.jpg", "/images/portfolio2-2.jpg"],
  },
  // Add more portfolio items as needed
];

function PortfolioId({ params }: { params: ParamsType }) {
  // Find the portfolio item based on the id from params
  const portfolio = staticPortfolioData.find((item) => item.id === params.id);

  if (!portfolio) {
    return <div>Portfolio not found</div>;
  }

  return (
    <div className="container">
      <div className="py-5">
        <LinkOverLogo link="/portfolio" linkHeader="BACK TO GALLERIES" />
      </div>
      <h1 className="header text-center text-lightText font-palatino text-[17px] tracking-[5px] uppercase">
        {portfolio.title}
      </h1>
      <div className="flex justify-center">
        <p className="text-center w-[50%] my-2">{portfolio.description}</p>
      </div>
      <div className="flex justify-center p-8 mb-10">
        <Image width="80" height="10" src="/divider.png" alt="divider" />
      </div>
      <ImagePreviewer images={portfolio.gallery} />
      <div className="py-5">
        <LinkOverLogo link="/portfolio" linkHeader="BACK TO GALLERIES" />
      </div>
    </div>
  );
}

export default PortfolioId;
