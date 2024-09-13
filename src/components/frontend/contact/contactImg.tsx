"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function ContactImg() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
        className="pt-5"
      >
        <Image
          src={"/images/contact/contact.webp"}
          width="1430"
          height={100}
          alt="contact"
        />
      </motion.div>
    </div>
  );
}

export default ContactImg;
