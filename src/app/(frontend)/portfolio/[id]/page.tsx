import LinkOverLogo from "@/components/frontend/linkOverLogo";
import ImagePreviewer from "@/components/frontend/portfolio/imagePreviewer";
import { ParamsType } from "@/types/types";
import axios from "axios";
import Image from "next/image";
import React from "react";

async function PortfolioId({ params }: { params: ParamsType }) {
  const res = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/portfolio/${params.id}`
  );
  let porfolio = res.data;
  return (
    <div className="container">
      <div className="py-5">
        <LinkOverLogo link="/portfolio" linkHeader="BACK TO GALLERIES" />
      </div>
      <h1 className="header text-center text-lightText font-palatino text-[17px] tracking-[5px] uppercase">
        {porfolio?.title}
      </h1>
      <div className="flex justify-center">
        <p className="text-center w-[50%] my-2">{porfolio?.description}</p>
      </div>
      <div className="flex justify-center p-8 mb-10">
        <Image width="80" height="10" src="/divider.png" alt="divder" />
      </div>
      <ImagePreviewer images={porfolio?.gallery} />
      <div className="py-5">
        <LinkOverLogo link="/portfolio" linkHeader="BACK TO GALLERIES" />
      </div>
    </div>
  );
}

export default PortfolioId;
