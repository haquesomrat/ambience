import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useDisclosure from "@/hooks/useDisclosure";

const SidebarDropdown = ({ item ,sidebarOpen,setSidebarOpen }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
        {item.map((item: any, index: number) => (
          <li key={index}>
            <Link
            onClick={()=> setSidebarOpen(!sidebarOpen)}
              href={item.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black duration-300 ease-in-out hover:text-white ${
                pathname === item.route ? "text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
