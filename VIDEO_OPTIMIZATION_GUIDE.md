# Video Background Optimization Guide for Next.js 16

## 📋 Overview

This guide covers optimizing your hero section video background for Next.js 16, addressing performance issues on mobile devices and improving Core Web Vitals.

## 🎯 Current Issues

- **Video size**: 6MB is too large for mobile (should be < 2MB)
- **Jittering**: Likely due to unoptimized encoding or excessive bitrate
- **Mobile performance**: No conditional loading or mobile fallback

## ✅ Optimizations Applied

The `WorkAtSparagusHero.tsx` component now includes:

1. **Poster image support** - Improves LCP (Largest Contentful Paint)
2. **Conditional loading** - Video only loads on desktop with good connection
3. **Multiple formats** - WebM (smaller) + MP4 (compatibility)
4. **Reduced motion support** - Honors user accessibility preferences
5. **Preload="none"** - Prevents eager loading until needed
6. **Mobile fallback** - Uses poster image on mobile devices

## 🔧 Step 1: Compress Your Video

### Option A: Using FFmpeg (Recommended)

Install FFmpeg first: https://ffmpeg.org/download.html

#### For 720p Desktop Video (Target: 2-3MB)

```bash
# Create optimized MP4 for desktop
ffmpeg -i videohero.mp4 \
  -vf "scale=1280:720:flags=lanczos,format=yuv420p" \
  -c:v libx264 \
  -preset slow \
  -crf 22 \
  -profile:v high \
  -level 4.1 \
  -r 30 \
  -an \
  -movflags +faststart \
  public/videohero.mp4

# Create WebM version (usually 30-40% smaller than MP4)
ffmpeg -i videohero.mp4 \
  -vf "scale=1280:720:flags=lanczos" \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -r 30 \
  -an \
  public/videohero.webm
```

#### For Mobile-Optimized Version (Optional - for mobile video)

```bash
# 480p version for mobile if you want to show video on mobile too
ffmpeg -i videohero.mp4 \
  -vf "scale=854:480:flags=lanczos,format=yuv420p" \
  -c:v libx264 \
  -preset slow \
  -crf 24 \
  -profile:v high \
  -level 4.0 \
  -r 24 \
  -an \
  -movflags +faststart \
  public/videohero-mobile.mp4
```

#### Create Poster Image (Required)

```bash
# Extract frame at 1 second as poster image
ffmpeg -i videohero.mp4 \
  -ss 00:00:01 \
  -vframes 1 \
  -vf "scale=1280:720:flags=lanczos" \
  -q:v 2 \
  public/videohero-poster.jpg

# Also create WebP version (smaller)
ffmpeg -i videohero.mp4 \
  -ss 00:00:01 \
  -vframes 1 \
  -vf "scale=1280:720:flags=lanczos" \
  public/videohero-poster.webp
```

### Option B: Using Online Tools

If you don't have FFmpeg installed:

1. **HandBrake** (Desktop App): https://handbrake.fr/
   - Preset: "Fast 720p30"
   - Remove audio track
   - Frame rate: 30 fps
   - Quality: RF 22

2. **CloudConvert** (Online): https://cloudconvert.com/
   - Convert to WebM (VP9 codec)
   - Resolution: 1280x720
   - Frame rate: 30 fps
   - Remove audio

3. **Clideo** (Online): https://clideo.com/compress-video
   - Compress MP4 to target size (~2MB)

## 📁 File Structure

After compression, your `public` folder should have:

```
public/
  ├── videohero.mp4          (2-3MB, 720p, H.264)
  ├── videohero.webm         (1-2MB, 720p, VP9)
  └── videohero-poster.jpg   (50-100KB, 1280x720)
```

## 🎨 Best Practices

### Video Settings

- **Resolution**: 720p (1280×720) for desktop backgrounds
- **Frame rate**: 24-30 fps (30 recommended)
- **Audio**: **REMOVE** audio track (saves ~20-30% file size)
- **Codec**: H.264 (MP4) + VP9 (WebM)
- **Bitrate**: 2-3 Mbps for desktop, 1-1.5 Mbps for mobile
- **CRF**: 22-24 (lower = better quality, larger file)

### Mobile Strategy

**Current implementation**: Video disabled on mobile, uses poster image only.

**Why?**
- Saves mobile data
- Improves page load speed
- Prevents jittering/stuttering
- Better Core Web Vitals scores

**Alternative**: If you want video on mobile, create a separate 480p version (< 1MB).

### File Size Targets

| Device | Resolution | Target Size | Format |
|--------|------------|-------------|--------|
| Desktop | 1280×720 | 2-3 MB | MP4 |
| Desktop | 1280×720 | 1-2 MB | WebM |
| Mobile | 854×480 | < 1 MB | MP4 (optional) |
| Poster | 1280×720 | < 100 KB | JPG/WebP |

## 🚀 Performance Benefits

After optimization, you should see:

- ✅ **50-70% smaller file sizes** (6MB → 2MB)
- ✅ **Faster LCP** (poster image loads immediately)
- ✅ **Better mobile performance** (no video on mobile)
- ✅ **Reduced bandwidth** (conditional loading)
- ✅ **Accessibility** (respects reduced motion)

## 🔍 Testing Your Optimization

1. **Check file sizes**:
   ```bash
   ls -lh public/videohero.*
   ```

2. **Test in browser**:
   - Open DevTools → Network tab
   - Throttle to "Slow 3G"
   - Check if video loads conditionally

3. **Test mobile**:
   - Use Chrome DevTools device emulation
   - Verify poster image shows instead of video

4. **Check Core Web Vitals**:
   - Use PageSpeed Insights: https://pagespeed.web.dev/
   - Target: LCP < 2.5s, FCP < 1.8s

## 🌐 External Video Hosting (Alternative)

### When to Consider External Hosting

Consider external hosting if:
- Video is > 5MB even after compression
- You have high traffic
- You need adaptive bitrate streaming

### Recommended Services

1. **Cloudinary** (Free tier available)
   - Automatic format optimization
   - CDN delivery
   - Responsive video transformations

2. **Vimeo** (Free tier available)
   - Good compression
   - Privacy controls
   - Embed code provided

3. **Mux** (Developer-friendly)
   - Excellent for Next.js
   - Automatic optimization
   - Analytics included

### Example: Using Cloudinary

```tsx
// Instead of local file, use Cloudinary URL
<video>
  <source 
    src="https://res.cloudinary.com/your-cloud/video/upload/v1234/videohero.webm" 
    type="video/webm" 
  />
  <source 
    src="https://res.cloudinary.com/your-cloud/video/upload/v1234/videohero.mp4" 
    type="video/mp4" 
  />
</video>
```

## 📝 Summary: Local vs External

| Aspect | Local (Optimized) | External Hosting |
|--------|-------------------|------------------|
| **Setup** | ✅ Simple | ⚠️ Requires account |
| **Cost** | ✅ Free | 💰 May have costs |
| **Load Time** | ✅ Fast (same domain) | ⚠️ Depends on CDN |
| **Control** | ✅ Full control | ⚠️ Vendor dependent |
| **File Size** | ⚠️ Must compress manually | ✅ Auto-optimized |
| **Bandwidth** | ⚠️ Your server | ✅ Vendor's CDN |

**Recommendation**: Start with **local optimized files**. If you need advanced features (adaptive streaming, analytics) or still have performance issues after compression, then consider external hosting.

## 🎬 Next Steps

1. **Compress your video** using FFmpeg or online tools
2. **Generate poster image** from first frame
3. **Place files** in `public/` directory
4. **Test** on mobile and desktop
5. **Monitor** Core Web Vitals scores

## 📚 Additional Resources

- [Next.js Video Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/videos)
- [Web.dev Video Optimization](https://web.dev/fast/#optimize-your-videos)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [MDN Video Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

---

**Note**: The component is already updated with all optimizations. You just need to compress your video and add the poster image!
