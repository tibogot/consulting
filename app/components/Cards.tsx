"use client";

import { Plus } from "lucide-react";

export default function Cards() {
  return (
    <div className="w-full bg-black">
      <div className="flex w-full flex-col md:flex-row">
        <div
          className="relative flex h-[560px] w-full flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat p-6 text-white md:flex-1 md:h-[640px]"
          style={{ backgroundImage: "url(/img-1.jpg)" }}
        >
          <div className="absolute inset-0 z-0 bg-black/10"></div>
          <h3 className="relative z-10 max-w-[26ch] wrap-break-word font-pp-neue-montreal text-xl leading-tight">
            Innovation and Cutting-Edge Technology Solutions
          </h3>
          <div className="relative z-10 flex items-end justify-between">
            {/* <p className="max-w-xs text-left font-pp-neue-montreal text-base opacity-90">
              Driving cutting-edge solutions that transform industries and
              redefine possibilities.
            </p> */}
            <div className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              <Plus className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
        <div
          className="relative flex h-[560px] w-full flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat p-6 text-white md:flex-1 md:h-[640px]"
          style={{ backgroundImage: "url(/img-2.jpg)" }}
        >
          <div className="absolute inset-0 z-0 bg-black/10"></div>
          <h3 className="relative z-10 max-w-[26ch] wrap-break-word font-pp-neue-montreal text-xl leading-tight">
            Excellence and Unmatched Quality Delivery
          </h3>
          <div className="relative z-10 flex items-end justify-between">
            {/* <p className="max-w-xs text-left font-pp-neue-montreal text-base opacity-90">
              Delivering unmatched quality and precision in every project we
              undertake.
            </p> */}
            <div className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              <Plus className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
        <div
          className="relative flex h-[560px] w-full flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat p-6 text-white md:flex-1 md:h-[640px]"
          style={{ backgroundImage: "url(/img-3.jpg)" }}
        >
          <div className="absolute inset-0 z-0 bg-black/10"></div>
          <h3 className="relative z-10 max-w-[26ch] wrap-break-word font-pp-neue-montreal text-xl leading-tight">
            Impact and Meaningful Change Creation
          </h3>
          <div className="relative z-10 flex items-end justify-between">
            {/* <p className="max-w-xs text-left font-pp-neue-montreal text-base opacity-90">
              Creating meaningful change that resonates with audiences and
              drives results.
            </p> */}
            <div className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              <Plus className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
