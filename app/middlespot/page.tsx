"use client";

import { useState } from "react";
import { useDemoModal } from "@/components/home/demo-modal";
import Popover from "@/components/shared/popover";
import Tooltip from "@/components/shared/tooltip";
import { ChevronDown } from "lucide-react";

export default function MiddleSpot(){
    const { DemoModal, setShowDemoModal } = useDemoModal();
    const [openPopover, setOpenPopover] = useState(false);
    return(
        <div className="z-10 w-full max-w-xl px-5 xl:px-0">
          <div className="relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md "><div class="flex h-60 items-center justify-center"><div class="relative h-full w-full"><svg class="absolute inset-0 m-auto" viewBox="0 0 100 100" width="140" height="140"><circle stroke-width="7" stroke-dasharray="1px 1px" stroke-linecap="round" transform="rotate(-90 50 50)" cx="50" cy="50" r="45" fill="#DCFCE7" stroke="#22C55E" pathLength="1" stroke-dashoffset="0px"></circle></svg><p class="absolute inset-0 mx-auto flex items-center justify-center font-display text-5xl text-green-500">100</p></div></div><div class="mx-auto max-w-md text-center"><h2 class="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">Performance first</h2><div class="prose-sm mt-3 leading-normal text-gray-500 [text-wrap:balance] md:prose"><p>Built on <a target="_blank" rel="noopener noreferrer" href="https://nextjs.org/" class="font-medium text-gray-800 underline transition-colors">Next.js</a> primitives like <code inline="true" class="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800">@next/font</code> and <code inline="true" class="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800">next/image</code> for stellar performance.</p></div></div></div>
            <h2>중간지점 찾아볼까요?</h2>
        
         <DemoModal /> 
        
         <button className="flex w-36 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100">
            <p className="text-gray-600">Modal</p>
            </button>
         <Popover
           content={
             <div className="w-full rounded-md bg-white p-2 sm:w-40">
               <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
                 강남역
               </button>
               <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
                 역삼역
               </button>
               <button className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
                 선릉역
               </button>
             </div>
           }
           openPopover={openPopover}
           setOpenPopover={setOpenPopover}
         >
           <button
             onClick={() => setOpenPopover(!openPopover)}
             className="flex w-36 items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
           >
             <p className="text-gray-600">Popover</p>
             <ChevronDown
               className={`h-4 w-4 text-gray-600 transition-all ${openPopover ? "rotate-180" : ""
                 }`}
             />
           </button>
         </Popover> 
         </div>
    )
}