"use client"

import { useState } from "react"
import { IconStar, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const myReviews = [
  {
    id: 1,
    rating: 5,
    title: "Dịch vụ tuyệt vời!",
    content: "Hệ thống QOS rất dễ sử dụng, khách hàng thích thú với việc order bằng QR code. Tăng hiệu quả phục vụ rất nhiều.",
    date: "15/12/2024",
    status: "approved",
    adminResponse: "Cảm ơn bạn đã đánh giá tích cực! Chúng tôi sẽ tiếp tục cải thiện dịch vụ.",
  },
  {
    id: 2,
    rating: 4,
    title: "Giao diện đẹp, dễ dùng",
    content: "Dashboard rất trực quan, báo cáo chi tiết. Chỉ mong có thêm tính năng export Excel cho báo cáo.",
    date: "02/12/2024",
    status: "approved",
    adminResponse: null,
  },
  {
    id: 3,
    rating: 5,
    title: "Hỗ trợ khách hàng tốt",
    content: "Team support phản hồi nhanh, giúp setup hệ thống rất nhiệt tình.",
    date: "28/11/2024",
    status: "pending",
    adminResponse: null,
  },
]

const StarRating = ({ rating, interactive = false, onChange }: { 
  rating: number
  interactive?: boolean
  onChange?: (rating: number) => void 
}) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStar
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-300 hover:text-yellow-400"
          }`}
          onClick={() => interactive && onChange && onChange(star)}
        />
      ))}
    </div>
  )
}

export default function CustomerReviewsPage() {
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
  })

  const handleSubmitReview = () => {
    // TODO: Submit review to API
    console.log("Submitting review:", newReview)
    setNewReview({ rating: 5, title: "", content: "" })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Đánh giá của tôi</h1>
          <p className="text-muted-foreground">
            Chia sẻ trải nghiệm sử dụng dịch vụ QOS
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Viết đánh giá
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Viết đánh giá mới</DialogTitle>
              <DialogDescription>
                Chia sẻ trải nghiệm của bạn với dịch vụ QOS
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Đánh giá</Label>
                <StarRating 
                  rating={newReview.rating} 
                  interactive 
                  onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  placeholder="Tiêu đề đánh giá..."
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  placeholder="Chia sẻ trải nghiệm chi tiết của bạn..."
                  rows={5}
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Hủy</Button>
                <Button onClick={handleSubmitReview}>
                  Gửi đánh giá
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {myReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={review.rating} />
                    <Badge 
                      variant={review.status === "approved" ? "default" : "secondary"}
                    >
                      {review.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{review.title}</h3>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{review.content}</p>
              
              {review.adminResponse && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/admin-avatar.jpg" />
                      <AvatarFallback>QOS</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Phản hồi từ QOS Team</p>
                      <p className="text-sm text-muted-foreground">{review.adminResponse}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
