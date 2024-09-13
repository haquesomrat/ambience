'use client'
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

function ScrollToTop() {
  const [showButton, setShowButton] = useState<boolean>(false);
  useEffect(() => {
    const handleButtonVisibility = () => {
      window.scrollY > 300 ? setShowButton(true) : setShowButton(false);
    };
    window.addEventListener("scroll", handleButtonVisibility);
    return () => {
      window.removeEventListener("scroll", handleButtonVisibility);
    };
  });
  const handleScrolltoTop=()=>{
    window.scrollTo({top:0, behavior:'smooth'})
  }
  return (
    showButton && (
      <div className="flex fixed bottom-10 right-10 text-lightText">
        <button className="bg-primary flex justify-center items-center w-10 h-10 rounded-full text-3xl border-lightText border-[1px]" onClick={handleScrolltoTop}>
          <MdOutlineKeyboardArrowUp/>
        </button>
      </div>
    )
  );
}

export default ScrollToTop;
