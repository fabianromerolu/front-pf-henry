// import Image from "next/image";
import MenuBar from "@/components/MenuBar/MenuBar";
import React from "react";

export default function Home() {
  return (
    <div>
      <div className="bg-light-blue w-full h-50"></div>
      {/* <Image
        width={600}
        height={600}
        src="/public/homePic.png"
        alt="homePic"
        className="w-full object-contain transition-all duration-500 group-hover:scale-105"
      ></Image> */}
      <MenuBar />
    </div>
  );
}

