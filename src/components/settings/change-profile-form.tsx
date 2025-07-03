"use client";

import { MEDIA_FOLDER_NAME } from "@/constants/media.constant";
import { useUpdateProfileMutation } from "@/hooks/useAuth";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { UpdateProfileBodyType } from "@/schemaValidations/auth.model";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// Schema cho form (không có avatar field vì sẽ handle riêng)
const UpdateProfileFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Họ và tên là bắt buộc")
      .max(100, "Họ và tên không được quá 100 ký tự"),
    phoneNumber: z
      .string()
      .min(9, "Số điện thoại phải có ít nhất 9 số")
      .max(15, "Số điện thoại không được quá 15 số"),
  })
  .strict();

type UpdateProfileFormType = z.infer<typeof UpdateProfileFormSchema>;

export function ChangeProfileForm() {
  const { user } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileMutation = useUpdateProfileMutation();
  const uploadMediaMutation = useUploadMediaMutation();

  const form = useForm<UpdateProfileFormType>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  });

  // Set default values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user, form]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB!");
      return;
    }

    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setAvatarPreview(user?.avatar || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: UpdateProfileFormType) => {
    try {
      let avatarUrl = user?.avatar;

      // Upload avatar if new file selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);

        const uploadResult = await uploadMediaMutation.mutateAsync({
          folderType: MEDIA_FOLDER_NAME.AVATAR,
          files: formData,
        });

        if (uploadResult.payload?.data?.[0]?.url) {
          avatarUrl = uploadResult.payload.data[0].url;
        }
      }

      // Update profile
      const apiData: UpdateProfileBodyType = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        avatar: avatarUrl ? avatarUrl : undefined,
      };

      await updateProfileMutation.mutateAsync(apiData);
      toast.success("Cập nhật thông tin thành công!");

      // Reset file selection
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const isLoading =
    updateProfileMutation.isPending || uploadMediaMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Thông tin cá nhân
        </CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  className="h-20 w-20 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={avatarPreview} alt="Avatar preview" />
                  <AvatarFallback className="text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {/* Upload overlay */}
                <div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <ImagePlus className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAvatarClick}
                    disabled={isLoading}
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {selectedFile ? "Thay đổi ảnh" : "Chọn ảnh"}
                  </Button>

                  {(selectedFile || avatarPreview) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleRemoveAvatar}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Đã chọn: {selectedFile.name}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập họ và tên"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập số điện thoại"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input value={user?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email không thể thay đổi
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? uploadMediaMutation.isPending
                  ? "Đang tải ảnh..."
                  : "Đang cập nhật..."
                : "Cập nhật thông tin"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
