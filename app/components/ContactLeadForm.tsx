"use client";

import { useState } from "react";

export default function ContactLeadForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="pt-6">
        <p className="font-pp-neue-montreal text-white/80 text-sm md:text-base leading-relaxed">
          Thanks — we’ll get back to you shortly.
        </p>
      </div>
    );
  }

  const inputBase =
    "w-full bg-transparent border-b border-white/15 pb-3 font-pp-neue-montreal text-white/80 placeholder:text-white/45 focus:outline-none focus:border-white/70 transition-colors text-sm md:text-base";

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="space-y-8">
        <label className="block">
          <span className="sr-only">Full name</span>
          <input
            name="fullName"
            autoComplete="name"
            required
            className={inputBase}
            placeholder="Full name"
          />
        </label>

        <label className="block">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputBase}
            placeholder="Email"
          />
        </label>

        <label className="block">
          <span className="sr-only">Company name</span>
          <input
            name="company"
            autoComplete="organization"
            className={inputBase}
            placeholder="Company name"
          />
        </label>

        <label className="block">
          <span className="sr-only">Telephone</span>
          <input
            name="telephone"
            type="tel"
            autoComplete="tel"
            className={inputBase}
            placeholder="Telephone"
          />
        </label>

        <label className="block">
          <span className="sr-only">Message</span>
          <input
            name="message"
            required
            className={inputBase}
            placeholder="Message"
          />
        </label>
      </div>

      <div className="mt-16 border-t border-white/15" />

      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-3 font-pp-neue-montreal text-white/60 hover:text-white/85 transition-colors text-[11px] md:text-xs"
      >
        <span>Submit</span>
        <span aria-hidden className="text-white/60">
          →
        </span>
      </button>
    </form>
  );
}

