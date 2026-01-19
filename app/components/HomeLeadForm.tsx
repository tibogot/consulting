"use client";

import { useState } from "react";

export default function HomeLeadForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border border-white/10 bg-white/5 p-6 md:p-8">
        <p className="font-pp-neue-montreal text-white text-xl md:text-2xl leading-tight">
          Thanks — we’ll get back to you shortly.
        </p>
        <p className="mt-3 font-pp-neue-montreal text-white/70 text-base md:text-lg leading-relaxed">
          If it’s urgent, email us and we’ll respond as fast as possible.
        </p>
      </div>
    );
  }

  return (
    <form
      className="border border-white/10 bg-white/5 p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <p className="font-pp-neue-montreal text-white/70 uppercase tracking-wide text-xs md:text-sm">
        Contact
      </p>
      <h3 className="mt-2 font-pp-neue-montreal text-white text-2xl md:text-3xl font-normal leading-tight">
        Start a conversation
      </h3>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-pp-neue-montreal text-white/70 text-sm">
            Name
          </span>
          <input
            name="name"
            required
            className="mt-2 w-full bg-black/30 border border-white/15 px-4 py-3 text-white font-pp-neue-montreal placeholder:text-white/40 focus:outline-none focus:border-white/40"
            placeholder="Jane Doe"
          />
        </label>

        <label className="block">
          <span className="font-pp-neue-montreal text-white/70 text-sm">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full bg-black/30 border border-white/15 px-4 py-3 text-white font-pp-neue-montreal placeholder:text-white/40 focus:outline-none focus:border-white/40"
            placeholder="jane@company.com"
          />
        </label>

        <label className="block">
          <span className="font-pp-neue-montreal text-white/70 text-sm">
            Company
          </span>
          <input
            name="company"
            className="mt-2 w-full bg-black/30 border border-white/15 px-4 py-3 text-white font-pp-neue-montreal placeholder:text-white/40 focus:outline-none focus:border-white/40"
            placeholder="Company name"
          />
        </label>

        <label className="block">
          <span className="font-pp-neue-montreal text-white/70 text-sm">
            Phone (optional)
          </span>
          <input
            name="phone"
            className="mt-2 w-full bg-black/30 border border-white/15 px-4 py-3 text-white font-pp-neue-montreal placeholder:text-white/40 focus:outline-none focus:border-white/40"
            placeholder="+32 ..."
          />
        </label>

        <label className="block md:col-span-2">
          <span className="font-pp-neue-montreal text-white/70 text-sm">
            What do you need help with?
          </span>
          <textarea
            name="message"
            rows={5}
            required
            className="mt-2 w-full bg-black/30 border border-white/15 px-4 py-3 text-white font-pp-neue-montreal placeholder:text-white/40 focus:outline-none focus:border-white/40 resize-none"
            placeholder="Tell us about the challenge, timeline, and what success looks like."
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-black font-pp-neue-montreal hover:bg-white/90 transition-colors"
      >
        Send message
      </button>
    </form>
  );
}

