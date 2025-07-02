import { JSX } from "react";

// Props for the YouTubeEmbed component
interface YouTubeEmbedProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({
  videoId,
  autoplay = false,
  muted = true,
  controls = true,
  title = "Video",
  className = "",
}: YouTubeEmbedProps): JSX.Element {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams(
    {
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      rel: "0",
      modestbranding: "1",
      fs: "1",
      cc_load_policy: "1",
      iv_load_policy: "3",
      controls: controls ? "1" : "0",
      disablekb: "0",
      enablejsapi: "1",
      origin: typeof window !== "undefined" ? window.location.origin : "",
    }
  ).toString()}`;

  return (
    <iframe
      className={`w-full h-full border-0 ${className}`}
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}

// Get thumbnail URL for a given YouTube video ID
export function getYouTubeThumbnail(
  videoId: string,
  quality:
    | "default"
    | "hqdefault"
    | "mqdefault"
    | "sddefault"
    | "maxresdefault" = "maxresdefault"
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// Extract YouTube video ID from a URL
export function extractYouTubeVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
