import Image from "next/image";
import Link from "next/link";
import React from "react";

function LinkOverLogo({
  link,
  linkHeader,
}: {
  link: string;
  linkHeader: string;
}) {
  return (
    <div className="group flex justify-center items-center mt-7 mb-5">
 
        <Image
          className="absolute opacity-10 lg:w-[120px] w-[70px]"
          height="10"
          width="120"
          src="/images/logo-sm-2.png"
          alt="logo"
        />
      
      <Link
        href={link}
        className="relative text-lightText lg:text-[15px] text-sm tracking-[3px] opacity-60 py-5 group-hover:opacity-90 transition-all ease-in-out duration-300 font-semibold uppercase"
      >
        {linkHeader}
      </Link>
    </div>
  );
}

export default LinkOverLogo;
