import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CopyRight = () => {
  return (
    <div className='container mx-auto'>
        <div className="flex justify-center items-center">
        <div className="h-[1px] w-full bg-slate-600"></div>
        <Image
          src={"/images/logo-sm.png"}
          width={70}
          height={100}
          alt="company logo"
          className="mx-4"
        />
        <div className="h-[1px] w-full bg-slate-600"></div>
      </div>
      <div className="mt-4 mb-8 text-[#a7a1a4]">
        <Link
          className="font-sans tracking-[2px] lg:text-lg text-xs text-center font-bold pt-5 uppercase"
          href={"https://www.instagram.com/ambiance.home"}
        >
          JOIN THE CONVERSATION @ Ambiance
        </Link>
      </div>
      <div className="h-[1px] w-full bg-slate-600"></div>
    </div>
  )
}

export default CopyRight