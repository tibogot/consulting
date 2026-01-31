# CSS preload warning explained

## The warning

```
The resource https://.../_next/static/chunks/e87b84534ad5a0cf.css was preloaded using link preload
but not used within a few seconds from the window's load event. Please make sure it has an appropriate
`as` value and it is preloaded intentionally.
```

## What it means

1. **Next.js injects preload links**  
   Next.js adds `<link rel="preload" href="...chunk.css" as="style">` so the browser fetches CSS early.

2. **Chrome expects “use” within a few seconds**  
   The browser expects that preloaded URL to be “used” by a matching `<link rel="stylesheet" href="...">` (or equivalent) soon after the page loads. If it doesn’t see that, it shows this warning.

3. **Why it happens in your app**  
   - **Code splitting**: The preloaded chunk (e.g. `e87b84534ad5a0cf.css`) can be for another route, a lazy-loaded segment, or a dynamically imported component. That CSS is only “used” when that route/component loads (e.g. after navigation or when the dynamic import runs).  
   - **Timing**: The stylesheet link for that chunk may be added by the framework after hydration, so from the browser’s point of view the preload wasn’t “used” quickly enough.  
   - **next-intl + `[locale]`**: Different locale or route segments can have different CSS chunks; the preloader may fetch a chunk that isn’t needed on the initial paint.

So the warning is Chrome saying: “You asked me to preload this CSS, but I didn’t see it actually used in the first few seconds.”

## Is it harmful?

- **Functionally**: No. The CSS is still loaded and will be used when the matching route or component loads.  
- **Performance**: Preloading can still help when the user navigates or when lazy components load; the “waste” is mainly that one chunk was fetched a bit earlier than its use.  
- **Metrics**: In theory an unused preload could be counted as wasted; in practice this is a known Next.js/App Router behavior and the impact is usually small.

So it’s mostly a **console noise / best-practice** warning, not a bug that breaks your app.

## What you can do

### 1. Ignore it (recommended)

For many Next.js apps this is expected. The framework controls preload injection and chunk splitting; fixing it perfectly would require changes inside Next.js (e.g. preloading only for the current route/segment). Treat the warning as informational unless you see real layout or performance issues.

### 2. Try different CSS chunking (optional)

Next.js has an experimental option that changes how CSS is split and loaded. You can try it and see if the warning disappears or changes:

In `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  experimental: {
    cssChunking: 'strict', // or false; default is true
  },
  // ... rest of config
};
```

- `true` (default): merge and reorder CSS to reduce chunks.  
- `'strict'`: load CSS in import order; can create more chunks.  
- `false`: no merging/reordering.

Changing this can alter which chunks are preloaded and when they’re “used,” so it might reduce or shift the warning. Only change it if you’re comfortable testing layout and performance.

### 3. Don’t add your own CSS preloads

Avoid adding extra `<link rel="preload" ...>` for the same chunk URLs Next.js already preloads. Duplicate or conflicting preloads can make the “not used” warning more likely or confusing.

## Summary

- The warning = “This CSS was preloaded but not used within a few seconds.”  
- In your setup it’s typically due to Next.js preloading a chunk for another route or lazy segment.  
- It’s safe to ignore unless you observe real issues. Optionally try `experimental.cssChunking` if you want to experiment with fewer or different preloads.
