"use client";

export default function Cards() {
  return (
    <div className="w-full bg-black px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div 
          className="flex-1 h-96 md:h-128 p-6 flex flex-col justify-end items-start text-white relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/img-1.jpg)' }}
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-pp-neue-montreal font-semibold mb-3">Innovation</h3>
            <p className="text-base font-pp-neue-montreal text-left opacity-90">
              Driving cutting-edge solutions that transform industries and redefine possibilities.
            </p>
          </div>
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>
        <div 
          className="flex-1 h-96 md:h-128 p-6 flex flex-col justify-end items-start text-white relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/img-2.jpg)' }}
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-pp-neue-montreal font-semibold mb-3">Excellence</h3>
            <p className="text-base font-pp-neue-montreal text-left opacity-90">
              Delivering unmatched quality and precision in every project we undertake.
            </p>
          </div>
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>
        <div 
          className="flex-1 h-96 md:h-128 p-6 flex flex-col justify-end items-start text-white relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/img-3.jpg)' }}
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-pp-neue-montreal font-semibold mb-3">Impact</h3>
            <p className="text-base font-pp-neue-montreal text-left opacity-90">
              Creating meaningful change that resonates with audiences and drives results.
            </p>
          </div>
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>
      </div>
    </div>
  );
}
