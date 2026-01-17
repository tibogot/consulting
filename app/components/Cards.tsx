"use client";

import { Plus } from "lucide-react";

export default function Cards() {
  return (
    <div className="w-full bg-black px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row">
        <div
          className="relative flex h-96 max-w-md flex-col justify-between overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat p-6 text-white md:h-128"
          style={{ backgroundImage: "url(/img-1.jpg)" }}
        >
          <div className="absolute inset-0 z-0 bg-black/10"></div>
          <h3 className="relative z-10 font-pp-neue-montreal text-2xl">
            Innovation
          </h3>
          <div className="relative z-10 flex items-end justify-between">
            <p className="max-w-xs text-left font-pp-neue-montreal text-base opacity-90">
              Driving cutting-edge solutions that transform industries and
              redefine possibilities.
            </p>
            <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              <Plus className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
        <div
          className="relative flex h-96 max-w-md flex-col justify-between overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat p-6 text-white md:h-128"
          style={{ backgroundImage: "url(/img-2.jpg)" }}
        >
          <div className="absolute inset-0 z-0 bg-black/10"></div>
          <h3 className="relative z-10 font-pp-neue-montreal text-2xl">
            Excellence
          </h3>
          <div className="relative z-10 flex items-end justify-between">
            <p className="max-w-xs text-left font-pp-neue-montreal text-base opacity-90">
              Delivering unmatched quality and precision in every project we
              undertake.
            </p>
            <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              <Plus className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
        <div
          className="relative flex h-96 max-w-md flex-col justify-between overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat p-6 text-white md:h-128"
          style={{ backgroundImage: "url(/img-3.jpg)" }}
        >
          <div className="absolute inset-0 z-0 bg-black/10"></div>
          <h3 className="relative z-10 font-pp-neue-montreal text-2xl">
            Impact
          </h3>
          <div className="relative z-10 flex items-end justify-between">
            <p className="max-w-xs text-left font-pp-neue-montreal text-base opacity-90">
              Creating meaningful change that resonates with audiences and
              drives results.
            </p>
            <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              <Plus className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
