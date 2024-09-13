"use client";
// import { settingType } from "@/types/types";
// import axios from "axios";
import Image from "next/image";
import Link from "next/link";
// import React, { useEffect, useState } from "react";

function ContactInfo({ footer }: { footer?: boolean }) {
  // const [settings, setSetting] = useState<settingType[] | null>(null);
  // const [phone, setPhone] = useState<string | null>(null);
  // const [email, setEmail] = useState<string | null>(null);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await axios.get(`/api/setting-key?key=contact`);
  //       setSetting(res.data);
  //     } catch (err) {
  //       console.log("Error fetching slider data");
  //     }
  //   };
  //   getData();
  // }, []);

  // useEffect(() => {
  //   if (settings) {
  //     settings.find((setting) => {
  //       if (setting.name === "phone") {
  //         setPhone(setting.description);
  //       }
  //       if (setting.name === "email") {
  //         setEmail(setting.description);
  //       }
  //     });
  //   }
  // }, [settings]);

  return (
    <div className="flex flex-col items-center text-center">
      {!footer && (
        <Image
          src={"/images/logo-sm.png"}
          width={70}
          height={100}
          alt="company logo"
          className="mx-4"
        />
      )}
      <h2 className="font-palatino py-1 text-lightText uppercase">
        CONTACT US
      </h2>

      <div className="space-y-2 grid">
        <Link
          className="footer-link-text footer-description"
          href={"#"}
          // href={`tel:+1${phone?.replaceAll("-", "")}`}
        >
          {/* {phone || (
            <div className="w-64 h-10 bg-black/25 animate-pulse rounded"></div>
          )} */}
          1-817-925-2478
        </Link>

        <Link
          className="email-link footer-link-text uppercase"
          href={"#"}
          // href={`mailto:${email}`}
        >
          {/* {email || (
            <div className="w-64 h-10 bg-black/25 animate-pulse rounded"></div>
          )} */}
          info@ambiancedesigns.biz
        </Link>
      </div>
    </div>
  );
}

export default ContactInfo;
