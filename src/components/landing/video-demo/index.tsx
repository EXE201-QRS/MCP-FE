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

export function VideoDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <>
      {/* Video Trigger */}
      <Card
        className="overflow-hidden shadow-2xl group cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-0 relative">
          <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            {/* Placeholder video thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center">
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

            {/* Video info overlay */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/80 text-white">
                <IconShareplay className="mr-1 size-3" />
                3:24
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
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Demo QR Ordering System</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
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
                >
                  <IconX className="size-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {/* Placeholder for video */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="text-center text-white">
                  <div className="size-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <IconShareplay className="size-8 ml-1" />
                  </div>
                  <p className="text-lg font-semibold mb-2">
                    Video sẽ được upload sớm
                  </p>
                  <p className="text-sm text-white/80">
                    Hiện tại bạn có thể trải nghiệm demo trực tuyến
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="grid gap-2 md:grid-cols-2">
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4 text-center">
                          <p className="font-medium mb-1">Dashboard Quản lý</p>
                          <p className="text-sm text-white/80">
                            demo.scanorderly.com
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/10 border-white/20">
                        <CardContent className="p-4 text-center">
                          <p className="font-medium mb-1">
                            Giao diện Khách hàng
                          </p>
                          <p className="text-sm text-white/80">
                            Scan QR để đặt món
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsOpen(false);
                          window.open("https://demo.scanorderly.com", "_blank");
                        }}
                      >
                        Mở Demo Dashboard
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsOpen(false);
                          window.open(
                            "https://demo.scanorderly.com/tables/1?token=table_1750517462872_f25nme3tvwp",
                            "_blank"
                          );
                        }}
                      >
                        Trải nghiệm đặt món
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* This is where the actual video will be embedded later */}
              {/* 
              <video 
                className="w-full h-full object-cover"
                controls
                muted={isMuted}
                autoPlay
              >
                <source src="/path-to-your-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </source>
              </video>
              */}
            </div>

            {/* Video Description */}
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold">Nội dung video demo:</h3>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>
                    00:00 - 00:30: Giới thiệu tổng quan QOS Scanorderly
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>00:30 - 01:30: Demo dashboard quản lý nhà hàng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>01:30 - 02:30: Trải nghiệm đặt món qua QR code</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>
                    02:30 - 03:00: Tính năng thanh toán và quản lý đơn hàng
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>03:00 - 03:24: Kết quả và lợi ích mang lại</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
