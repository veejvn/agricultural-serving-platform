"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AccountService from "@/services/account.service";
import { IAccountResponse } from "@/types/account";

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 số.",
  }),
  dob: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [accountData, setAccountData] = useState<IAccountResponse | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      dob: "",
    },
    mode: "onChange",
  });

  // Load account data on component mount
  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setIsLoadingData(true);
      const [data, error] = await AccountService.getAccount();

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin tài khoản",
          variant: "destructive",
        });
        console.error("Error loading account data:", error);
        return;
      }

      if (data) {
        setAccountData(data);
        // Update form with loaded data
        form.reset({
          displayName: data.displayName || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob ? data.dob.split("T")[0] : "", // Format date for input
        });
      }
    } catch (error) {
      console.error("Error loading account data:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải thông tin tài khoản",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);

      const updateData = {
        displayName: data.displayName,
        phone: data.phone,
        dob: data.dob,
        // Don't include email in update request since it's usually readonly
      };

      const [result, error] = await AccountService.updateAccount(updateData);

      if (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi cập nhật thông tin",
          variant: "error",
        });
        console.error("Error updating account:", error);
        return;
      }

      if (result) {
        setAccountData(result);
        toast({
          title: "Thành công",
          description: "Thông tin cá nhân đã được cập nhật thành công",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Thông tin cá nhân</h2>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin cá nhân của bạn
        </p>
      </div>

      {isLoadingData ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Đang tải thông tin...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>
              Thông tin này sẽ được hiển thị công khai, vì vậy hãy cẩn thận với
              những gì bạn chia sẻ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@example.com"
                            {...field}
                            disabled
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormDescription>
                          Email không thể thay đổi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
