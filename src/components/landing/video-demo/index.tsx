"use client";

import {
  IconShareplay,
  IconVolume,
  IconVolumeOff,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// YouTube Video ID extracted from URL: https://www.youtube.com/watch?v=6ojlM0wTn8o
const YOUTUBE_VIDEO_ID = "6ojlM0wTn8o";

interface YouTubeEmbedProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
}

function YouTubeEmbed({ 
  videoId, 
  autoplay = false, 
  muted = true,
  className = "" 
}: YouTubeEmbedProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: muted ? "1" : "0",
    rel: "0", // Don't show related videos
    modestbranding: "1", // Minimal YouTube branding
    fs: "1", // Allow fullscreen
    cc_load_policy: "1", // Show captions by default
    iv_load_policy: "3", // Hide video annotations
    controls: "1", // Show player controls
  }).toString()}`;

  return (
    <iframe
      className={`w-full h-full ${className}`}
      src={embedUrl}
      title="QOS Scanorderly Demo Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}

export function VideoDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  // YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;

  const handleThumbnailClick = () => {
    setIsOpen(true);
    setShowVideo(true);
  };

  return (
    <>
      {/* Video Trigger with YouTube Thumbnail */}
      <Card
        className="overflow-hidden shadow-2xl group cursor-pointer relative"
        onClick={handleThumbnailClick}
      >
        <CardContent className="p-0 relative">
          <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            {/* YouTube Thumbnail */}
            <img
              src={thumbnailUrl}
              alt="QOS Scanorderly Demo Video Thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback if thumbnail fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Fallback content if thumbnail fails */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              <div className="text-center">
                <div className="size-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <IconShareplay className="size-10 text-primary ml-1" />
                </div>
                <p className="text-lg font-semibold mb-2">
                  Demo QR Ordering System
                </p>
                <p className="text-sm text-muted-foreground">
                  Xem cách QOS hoạt động trong thực tế
                </p>
              </div>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 rounded-full bg-black/70 flex items-center justify-center group-hover:bg-black/80 transition-colors">
                <IconShareplay className="size-10 text-white ml-1" />
              </div>
            </div>

            {/* Video info overlay */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/80 text-white">
                <IconShareplay className="mr-1 size-3" />
                Demo QOS
              </Badge>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-black/80 text-white">
                Click để xem video demo
              </Badge>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Demo QR Ordering System</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                  {isMuted ? (
                    <IconVolumeOff className="size-4" />
                  ) : (
                    <IconVolume className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  title="Đóng"
                >
                  <IconX className="size-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {showVideo ? (
                <YouTubeEmbed 
                  videoId={YOUTUBE_VIDEO_ID}
                  autoplay={true}
                  muted={isMuted}
                />
              ) : (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 cursor-pointer"
                  onClick={() => setShowVideo(true)}
                >
                  <div className="text-center text-white">
                    <div className="size-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                      <IconShareplay className="size-8 ml-1" />
                    </div>
                    <p className="text-lg font-semibold mb-2">
                      Click để phát video
                    </p>
                    <p className="text-sm text-white/80">
                      Video demo QR Ordering System
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Description */}
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold">Về video demo này:</h3>
              <p className="text-sm text-muted-foreground">
                Video này giới thiệu chi tiết cách QOS Scanorderly hoạt động, 
                từ quá trình setup, quản lý nhà hàng đến trải nghiệm đặt món của khách hàng.
              </p>
              
              {/* Demo Links */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://demo.scanorderly.com", "_blank")}
                >
                  Mở Demo Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(
                    "https://demo.scanorderly.com/tables/1?token=table_1750517462872_f25nme3tvwp",
                    "_blank"
                  )}
                >
                  Trải nghiệm đặt món
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
