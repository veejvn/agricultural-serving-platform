"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AccountService from "@/services/account.service";
import { IAccountResponse } from "@/types/account";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, CalendarDays, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<IAccountResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setIsLoading(true);
        const [result, error] = await AccountService.getAccountById(id as string);
        if (result) {
          setUser(result);
        } else {
          toast({
            title: "Lỗi",
            description: error?.message || "Không thể tải thông tin người dùng.",
            variant: "destructive",
          });
          router.push("/admin/user"); // Redirect back to user list on error
        }
        setIsLoading(false);
      };
      fetchUser();
    }
  }, [id, router, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Chi tiết người dùng</h1>
        <p>Không tìm thấy người dùng.</p>
        <Button onClick={() => router.push("/admin/user")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chi tiết người dùng</h1>
        <Button variant="outline" onClick={() => router.push("/admin/user")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.displayName || "User Avatar"} />
            <AvatarFallback>
              <User className="h-10 w-10 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user.displayName || "N/A"}</h2>
            <p className="text-gray-600 dark:text-gray-400">ID: {user.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <p>Email: {user.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <p>Điện thoại: {user.phone || "N/A"}</p>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-gray-500" />
            <p>Ngày sinh: {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</p>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <p>Vai trò:</p>
            <div className="flex flex-wrap gap-1">
              {user.roles.map((role) => {
                let badgeClass =
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"; // Default for USER

                if (role === "FARMER") {
                  badgeClass =
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
                } else if (role === "ADMIN") {
                  badgeClass =
                    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
                }

                return (
                  <Badge key={role} className={badgeClass}>
                    {role}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
