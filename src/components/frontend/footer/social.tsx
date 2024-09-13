"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { socialIcons } from '../contact/contactBox';
import axios from 'axios';
import { menuType } from '@/types/types';

function Social({className}:{className?:string}) {
  const [social, setSocial] = useState<menuType | null>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const res2 = await axios.get(`/api/menu/social`);
        setSocial(res2.data);
      } catch (err) {
        console.log("Error fetching slider data");
      }
    };
    getData();
  }, []);
  
  return (
    <div className={`flex justify-center items-center gap-5 pt-3 px-5 ${className}`}>
          {social?.items?.map((item:{name:string;link:string}) => (
          <Link key={item.name} className="icon-link" href={`${item.link}`}>
            {item.name === "facebook" ? (
              socialIcons.facebook
            ) : item.name == "instagram" ? (
              socialIcons.instagram
            ) : item.name === "google business" ? (
              socialIcons.googleBusiness
            ) : (
              <span></span>
            )}
          </Link>
        ))}
          
        </div>
  )
}

export default Social