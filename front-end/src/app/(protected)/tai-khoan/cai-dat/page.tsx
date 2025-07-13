"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Moon, Sun, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const settingsFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Vui lòng chọn chủ đề.",
  }),
  language: z.string({
    required_error: "Vui lòng chọn ngôn ngữ.",
  }),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [_isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Đổi tên isDeleteDialogOpen thành _isDeleteDialogOpen để tránh cảnh báo unused

  const defaultValues: Partial<SettingsFormValues> = {
    theme: "system",
    language: "vi",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
      toast({
        title: "Cài đặt đã được lưu",
        description: "Cài đặt của bạn đã được cập nhật thành công.",
      });
    }, 1000);
  }

  function handleDeleteAccount() {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Tài khoản đã được xóa",
        description: "Tài khoản của bạn đã được xóa thành công.",
      });
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Cài đặt</h2>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý cài đặt tài khoản của bạn
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Giao diện</h3>
              <p className="text-sm text-gray-500">
                Tùy chỉnh giao diện và ngôn ngữ của bạn
              </p>
            </div>
            <Separator />
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Chủ đề</FormLabel>
                  <FormDescription>
                    Chọn chủ đề cho giao diện người dùng.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4 pt-2"
                    >
                      <FormItem>
                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="light" className="sr-only" />
                          </FormControl>
                          <Sun className="h-6 w-6 mb-2" />
                          <span className="text-center">Sáng</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <Moon className="h-6 w-6 mb-2" />
                          <span className="text-center">Tối</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                          <FormControl>
                            <RadioGroupItem
                              value="system"
                              className="sr-only"
                            />
                          </FormControl>
                          <div className="flex space-x-1 mb-2">
                            <Sun className="h-6 w-6" />
                            <Moon className="h-6 w-6" />
                          </div>
                          <span className="text-center">Hệ thống</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngôn ngữ</FormLabel>
                  <FormDescription>
                    Chọn ngôn ngữ hiển thị cho ứng dụng.
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Thông báo</h3>
              <p className="text-sm text-gray-500">
                Quản lý thông báo bạn nhận được
              </p>
            </div>
            <Separator />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Thông báo qua email</FormLabel>
                      <FormDescription>
                        Nhận thông báo qua email khi có hoạt động mới trên tài
                        khoản của bạn.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pushNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Thông báo đẩy</FormLabel>
                      <FormDescription>
                        Nhận thông báo đẩy trên thiết bị của bạn khi có hoạt
                        động mới trên tài khoản của bạn.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingEmails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Email quảng cáo</FormLabel>
                      <FormDescription>
                        Nhận email về các sản phẩm, tính năng và bản cập nhật
                        mới từ chúng tôi.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            Lưu thay đổi
          </Button>
        </form>
      </Form>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Xóa tài khoản</h3>
        <p className="text-sm text-gray-500">
          Xóa vĩnh viễn tài khoản của bạn.
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            Xóa tài khoản
            <Trash2 className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn tài
              khoản của bạn và tất cả dữ liệu của bạn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading}
              onClick={handleDeleteAccount}
            >
              {isLoading && (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Xóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
