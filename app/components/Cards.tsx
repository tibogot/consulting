"use client";

import { Plus } from "lucide-react";

export default function Cards() {
  return (
    <div className="w-full bg-black px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl mx-auto">
        <div 
          className="max-w-md h-96 md:h-128 p-6 flex flex-col justify-between text-white relative bg-cover bg-center bg-no-repeat rounded-sm overflow-hidden"
          style={{ backgroundImage: 'url(/img-1.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/20 z-0"></div>
          <h3 className="relative z-10 text-2xl font-pp-neue-montreal font-semibold">Innovation</h3>
          <div className="relative z-10 flex items-end justify-between">
            <p className="text-base font-pp-neue-montreal text-left opacity-90 max-w-xs">
              Driving cutting-edge solutions that transform industries and redefine possibilities.
            </p>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 ml-4">
              <Plus className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
        <div 
          className="max-w-md h-96 md:h-128 p-6 flex flex-col justify-between text-white relative bg-cover bg-center bg-no-repeat rounded-sm overflow-hidden"
          style={{ backgroundImage: 'url(/img-2.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <h3 className="relative z-10 text-2xl font-pp-neue-montreal font-semibold">Excellence</h3>
          <div className="relative z-10 flex items-end justify-between">
            <p className="text-base font-pp-neue-montreal text-left opacity-90 max-w-xs">
              Delivering unmatched quality and precision in every project we undertake.
            </p>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 ml-4">
              <Plus className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
        <div 
          className="max-w-md h-96 md:h-128 p-6 flex flex-col justify-between text-white relative bg-cover bg-center bg-no-repeat rounded-sm overflow-hidden"
          style={{ backgroundImage: 'url(/img-3.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <h3 className="relative z-10 text-2xl font-pp-neue-montreal font-semibold">Impact</h3>
          <div className="relative z-10 flex items-end justify-between">
            <p className="text-base font-pp-neue-montreal text-left opacity-90 max-w-xs">
              Creating meaningful change that resonates with audiences and drives results.
            </p>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 ml-4">
              <Plus className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
