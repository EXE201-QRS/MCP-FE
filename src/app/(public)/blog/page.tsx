"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  IconArrowLeft,
  IconCalendar,
  IconUser,
  IconEye,
  IconTag,
  IconSearch,
  IconTrendingUp,
  IconBook,
  IconNewSection
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

// Import placeholder image
import dashboardImage from "@/assets/dashboard.png"

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "Xu hướng QR Ordering trong ngành F&B 2024",
    excerpt: "Khám phá những xu hướng mới nhất trong việc ứng dụng QR code để đặt món tại nhà hàng và cách nó thay đổi trải nghiệm khách hàng.",
    author: "Scanorderly Team",
    publishedAt: "2024-06-15",
    category: "Xu hướng",
    tags: ["QR Code", "F&B", "Công nghệ", "Xu hướng 2024"],
    views: 1250,
    readTime: "5 phút đọc",
    featured: true,
    image: dashboardImage
  },
  {
    id: 2,
    title: "Hướng dẫn tối ưu hóa menu QR cho nhà hàng",
    excerpt: "Bí quyết thiết kế menu QR hiệu quả để tăng doanh thu và cải thiện trải nghiệm khách hàng tại nhà hàng của bạn.",
    author: "QOS Expert",
    publishedAt: "2024-06-10",
    category: "Hướng dẫn",
    tags: ["Menu", "UX/UI", "Tối ưu hóa", "Doanh thu"],
    views: 890,
    readTime: "8 phút đọc",
    featured: false,
    image: dashboardImage
  },
  {
    id: 3,
    title: "Case Study: Tăng 40% doanh thu với QOS Scanorderly",
    excerpt: "Câu chuyện thành công của nhà hàng ABC khi triển khai hệ thống QR Ordering và đạt được kết quả ấn tượng chỉ sau 3 tháng.",
    author: "Success Team",
    publishedAt: "2024-06-05",
    category: "Case Study",
    tags: ["Thành công", "ROI", "Nhà hàng", "Kết quả"],
    views: 2100,
    readTime: "6 phút đọc",
    featured: true,
    image: dashboardImage
  },
  {
    id: 4,
    title: "10 lỗi thường gặp khi triển khai QR Ordering",
    excerpt: "Những sai lầm phổ biến mà các nhà hàng thường mắc phải khi triển khai hệ thống QR Ordering và cách khắc phục.",
    author: "Tech Support",
    publishedAt: "2024-05-28",
    category: "Hướng dẫn",
    tags: ["Lỗi", "Khắc phục", "Best Practice", "Implementation"],
    views: 1560,
    readTime: "7 phút đọc",
    featured: false,
    image: dashboardImage
  }
]

const categories = [
  { name: "Tất cả", count: blogPosts.length },
  { name: "Xu hướng", count: blogPosts.filter(post => post.category === "Xu hướng").length },
  { name: "Hướng dẫn", count: blogPosts.filter(post => post.category === "Hướng dẫn").length },
  { name: "Case Study", count: blogPosts.filter(post => post.category === "Case Study").length }
]

const popularTags = ["QR Code", "F&B", "Công nghệ", "Tối ưu hóa", "Doanh thu", "UX/UI", "Security", "API"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground flex items-center gap-1">
                <IconArrowLeft className="size-4" />
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-foreground">Blog</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="outline" className="mb-8">
                <IconBook className="mr-1 size-3" />
                Blog & Insights
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Kiến thức &{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Xu hướng
                </span>{" "}
                F&B
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Khám phá những bài viết chuyên sâu về công nghệ QR Ordering, 
                xu hướng ngành F&B và những tips hữu ích để tối ưu nhà hàng.
              </p>
              
              {/* Search */}
              <div className="mx-auto max-w-md">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4">Bài viết nổi bật</h2>
                <p className="text-muted-foreground">
                  Những bài viết được quan tâm nhất trong thời gian gần đây
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 left-4">
                          {post.category}
                        </Badge>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <IconCalendar className="size-4" />
                            {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="flex items-center gap-1">
                            <IconEye className="size-4" />
                            {post.views}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          <Link href={`/blog/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconUser className="size-4" />
                            {post.author}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-4">
              
              {/* Blog Posts */}
              <div className="lg:col-span-3">
                {/* Category Filter */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        {category.name} ({category.count})
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Posts Grid */}
                <div className="space-y-8">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="grid gap-6 md:grid-cols-3">
                          <div className="relative overflow-hidden rounded-l-lg md:col-span-1">
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={300}
                              height={200}
                              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-6 md:col-span-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <Badge variant="secondary">{post.category}</Badge>
                              <div className="flex items-center gap-1">
                                <IconCalendar className="size-4" />
                                {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                              </div>
                              <div className="flex items-center gap-1">
                                <IconEye className="size-4" />
                                {post.views}
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                              <Link href={`/blog/${post.id}`}>
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IconUser className="size-4" />
                                {post.author}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                  {post.readTime}
                                </span>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/blog/${post.id}`}>
                                    Đọc tiếp
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                
                {/* Recent Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconNewSection className="size-5" />
                      Bài viết mới nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {blogPosts.slice(0, 4).map((post) => (
                      <div key={post.id} className="group">
                        <h4 className="font-medium group-hover:text-primary transition-colors mb-1">
                          <Link href={`/blog/${post.id}`}>
                            {post.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <IconCalendar className="size-3" />
                          {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconTag className="size-5" />
                      Tags phổ biến
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconTrendingUp className="size-5" />
                      Đăng ký nhận tin
                    </CardTitle>
                    <CardDescription>
                      Nhận thông báo khi có bài viết mới
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="Email của bạn" type="email" />
                    <Button className="w-full">
                      Đăng ký
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Chúng tôi không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
                    </p>
                  </CardContent>
                </Card>

                {/* Contact CTA */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Cần tư vấn?
                    </CardTitle>
                    <CardDescription>
                      Liên hệ với chuyên gia để được hỗ trợ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/contact">
                        Liên hệ ngay
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}