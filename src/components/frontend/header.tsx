import Image from "next/image";
// import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import useDisclosure from "@/hooks/useDisclosure";
import Social from "./footer/social";
// import { settingType } from "@/types/types";
// import axios from "axios";

type navItemType = { name: string; link: string }[];

function Header({ navItems }: { navItems: navItemType | undefined }) {
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

  const { Show, showMenu } = useDisclosure();
  return (
    <div className="">
      <div className="bg-primary text-end lg:relative fixed top-0 w-full z-10">
        <div className="flex justify-between items-center p-3 lg:hidden">
          <Link
            href={"/"}
            className=" aspect-square w-12 inline-block overflow-hidden lg:hidden"
          >
            <Image
              src={"/images/logo-sm.png"}
              width={120}
              height={120}
              alt="company logo"
              className="w-full h-full object-cover"
            />
          </Link>
          <button className="" onClick={showMenu}>
            <GiHamburgerMenu className="text-3xl" />
          </button>
        </div>

        <div className="container mx-auto font-openSans py-3 text-[13px] lg:block hidden">
          <Link
            className="tracking-[2px]"
            href={"#"}
            // href={`tel:+1${phone?.replaceAll("-", "")}`}
          >
            {/* {phone || "phone"} */}
            1-817-925-2478
          </Link>
          <span className="px-5">.</span>

          <Link
            className="tracking-[2px] uppercase"
            href={"#"}
            // href={`mailto:${email}`}
          >
            {/* {email || "email"} */}
            info@ambiancedesigns.biz
          </Link>
        </div>
        <div
          className={`pb-5 ${
            Show ? "visible" : "hidden"
          } flex flex-col items-center uppercase`}
        >
          {navItems?.map((navItem, i) => (
            <Link
              key={i}
              href={navItem.link}
              onClick={showMenu}
              className="font-openSans tracking-[2px] p-2 text-center"
            >
              {navItem.name}
            </Link>
          ))}
          <Social />
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <Link
          href={"/"}
          className="inline-flex items-center justify-center aspect-[220/244] w-55"
        >
          <Image
            src={"/images/logo.png"}
            width={220}
            height={330}
            alt="company logo"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
}

export default Header;
