"use client";
import React from "react";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import { sliderType } from "@/types/types";

function Slider({ slider }: { slider: sliderType | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      className="container pb-14 px-0 mb-[-30px]"
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {slider?.img.map((img, i) => (
          <SwiperSlide
            key={i}
            className=" aspect-video inline-block overflow-hidden"
          >
            <Image
              className="select-none w-full h-full"
              draggable={false}
              src={img}
              alt="slider-1"
              width="2000"
              height="2000"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}

export default Slider;
