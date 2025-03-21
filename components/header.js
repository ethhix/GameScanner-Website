"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const Header = () => {
  useEffect(() => {
    const subtext = document.getElementsByClassName("sub-text");
    gsap.to(subtext, {
      scale: 1.5,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="w-full px-4 sm:px-6">
      <header className="flex justify-center p-2 sm:p-4 md:p-6">
        <div className="relative flex flex-col justify-center max-w-fit">
          <Link href={"/"}>
            <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-8xl jersey-20-regular">
              GameScanner Extension
            </h1>
          </Link>
          <h3 className="sub-text absolute -right-2 sm:-right-4 md:-right-8 lg:-right-14 bottom-1 text-[#AC81FF] text-xl sm:text-2xl md:text-3xl lg:text-5xl jersey-10-regular transform translate-y-1/4 -rotate-25">
            For Twitch!
          </h3>
        </div>
      </header>
    </div>
  );
};

export default Header;
