"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { aboutType } from "@/types/types";

function ClientInfo({ about }: { about: aboutType[] }) {
  return (
    <motion.div
      initial={{ y: 150 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.5,
      }}
    >
      {about?.map((item) => (
       item.status==='active' && <div
          key={item.id}
          className="flex lg:flex-row justify-between lg:items-start items-center flex-col pt-5 gap-8 "
        >
          <div className="aspect-auto lg:w-[40%] w-full inline-block overflow-hidden ">
            <Image
              src={item.avatar[0]}
              width="440"
              height="440"
              alt="about"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-content-center lg:w-[60%] text-justify [text-align-last:center] font-semibold tracking-[2px] leading-7 lg:mt-0 mt-5 text-[13px] text-lightText">
            <h1 className="header font-palatino text-[17px] lg:text-[20px] lg:tracking-[5px] tracking-[3px] uppercase">
              {item.title}
            </h1>
            <p className="semi-header pt-2 font-dipotic text-[17px] lg:text-[20px] font-medium">
              {item.subTitle}
            </p>

            <div className="flex justify-center p-8 ">
              <Image width="80" height="10" src="/divider.png" alt="divder" />
            </div>
            <div>
              <p className="primary-text description [word-spacing:2px] text-[16px] pb-5">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default ClientInfo;
