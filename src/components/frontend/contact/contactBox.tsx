"use client";
import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";
import { motion } from "framer-motion";
import { SiGooglemybusiness } from "react-icons/si";
import Social from "../footer/social";
import ContactInfo from "./contactInfo";

export const socialIcons = {
  facebook: <FaFacebookF className=" text-2xl"/>,
  instagram: <ImInstagram className=" text-2xl"/>,
  googleBusiness: <SiGooglemybusiness className=" text-2xl"/>,
};

function ContactBox() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      viewport={{ once: true, amount: 0.01 }}
      className="flex flex-col items-center bg-primary font-openSans text-[16px] tracking-[2px] font-semibold text-[#a7a1a4] p-4 min-w-[50%]"
    >
      <ContactInfo />
      <h2 className="footer-header font-palatino text-lightText mt-5 py-1 uppercase">
        Connect With Us
      </h2>
      <div className="flex justify-center items-center gap-2 py-1">
        <Social/>
      </div>
    </motion.div>
  );
}

export default ContactBox;
