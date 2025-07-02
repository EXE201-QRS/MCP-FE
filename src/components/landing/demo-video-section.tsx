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
import {
  YouTubeEmbed,
  getYouTubeThumbnail,
} from "@/components/ui/youtube-embed";

// YouTube Video ID extracted from URL: https://www.youtube.com/watch?v=6ojlM0wTn8o
const YOUTUBE_VIDEO_ID = "6ojlM0wTn8o";

export function DemoVideoSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  // YouTube thumbnail URL
  const thumbnailUrl = getYouTubeThumbnail(YOUTUBE_VIDEO_ID);

  const handleThumbnailClick = () => {
    setIsOpen(true);
    setShowVideo(true);
  };

  return (
    <section className="bg-muted/30 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <IconShareplay className="mr-1 size-3" />
              Video Demo
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Xem QOS hoạt động thực tế
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Video demo chi tiết giúp bạn hiểu rõ cách QOS Scanorderly hoạt
              động và mang lại giá trị cho nhà hàng của bạn
            </p>
          </div>

          {/* Video Thumbnail */}
          <Card
            className="overflow-hidden shadow-2xl group cursor-pointer relative hover:shadow-3xl transition-shadow duration-300"
            onClick={handleThumbnailClick}
          >
            <CardContent className="p-0 relative">
              <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                {/* YouTube Thumbnail */}
                <img
                  src={thumbnailUrl}
                  alt="QOS Scanorderly Demo Video Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if thumbnail fails to load
                    e.currentTarget.style.display = "none";
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
                  <div className="size-20 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-black/80 transition-all duration-300 group-hover:scale-110">
                    <IconShareplay className="size-10 text-white ml-1" />
                  </div>
                </div>

                {/* Video info overlay */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/80 text-white backdrop-blur-sm">
                    <IconShareplay className="mr-1 size-3" />
                    Demo Video
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-black/80 text-white backdrop-blur-sm">
                    Click để xem video demo
                  </Badge>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </CardContent>
          </Card>

          {/* Key Points */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm">
              <div className="size-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <IconShareplay className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Setup dễ dàng</h3>
              <p className="text-sm text-muted-foreground">
                Thiết lập hệ thống QR Ordering chỉ trong vài phút
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm">
              <div className="size-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <IconShareplay className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quản lý toàn diện</h3>
              <p className="text-sm text-muted-foreground">
                Dashboard tổng hợp tất cả thông tin quan trọng
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm">
              <div className="size-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <IconShareplay className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Trải nghiệm tuyệt vời</h3>
              <p className="text-sm text-muted-foreground">
                Khách hàng dễ dàng đặt món chỉ với scan QR
              </p>
            </div>
          </div>
        </div>

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
                    title="QOS Scanorderly Demo Video"
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
                  từ quá trình setup, quản lý nhà hàng đến trải nghiệm đặt món
                  của khách hàng.
                </p>

                {/* Demo Links */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open("https://demo.scanorderly.com", "_blank")
                    }
                  >
                    Mở Demo Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "https://demo.scanorderly.com/tables/1?token=table_1750517462872_f25nme3tvwp",
                        "_blank"
                      )
                    }
                  >
                    Trải nghiệm đặt món
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
