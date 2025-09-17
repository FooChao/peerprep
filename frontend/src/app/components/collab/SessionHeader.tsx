"use client";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import Image from "next/image";

export default function SessionHeader() {
  return (
    <header
      className="flex 
        justify-end
        items-center 
        gap-3
        bg-stone-800 
        w-full 
        h-15 
        text-white 
        border-b-2 
        border-stone-700"
    >
      <Button>
        <Mic />
      </Button>
      <Button className="bg-red-500 text-black mr-3">Leave Session</Button>
    </header>
  );
}
