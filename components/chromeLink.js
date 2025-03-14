"use client";
import React from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import ChromeStore from "../public/assets/images/chrome-download.svg";
import ArrowSvg from "../public/assets/images/arrow2.svg";

function chromeLink() {
  const linkRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (linkRef.current) {
        gsap.fromTo(
          linkRef.current,
          { scale: 1 },
          {
            scale: 1.2,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
            overwrite: "auto",
          }
        );
      }
    };
    // Wait for content load and DOM stabilization
    setTimeout(animate, 500);
  }, []);

  return (
    <div className="relative mx-auto w-fit h-[140px] mt-8 mb-8">
      <div
        className="absolute"
        style={{
          left: "560px",
          top: "-160px",
          width: "200px",
          textAlign: "center",
          transform: "rotate(-5deg)",
          zIndex: 10,
        }}
      >
        <p
          ref={linkRef}
          className="description jersey-20-regular font-bold text-2xl"
          style={{
            transformOrigin: "center",
            display: "inline-block",
          }}
        >
          Download here!
        </p>
      </div>
      <div
        className="absolute z-[-1]"
        style={{ top: "-435px", right: "-660px" }}
      >
        <Image src={ArrowSvg} alt="Arrow" />
      </div>
      <div>
        <a href="" className="">
          <Image src={ChromeStore} alt="Chrome Store Link" />
        </a>
      </div>
    </div>
  );
}

export default chromeLink;
