"use client";

import { useState } from "react";
import {
  Bell,
  ShoppingBag,
  Tag,
  Truck,
  AlertCircle,
  CheckCircle,
  Trash2,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Dữ liệu mẫu
const _notifications = [
  {
    id: 1,
    type: "order",
    title: "Đơn hàng #12345 đã được giao",
    description: "Đơn hàng của bạn đã được giao thành công.",
    date: "2 giờ trước",
    isRead: false,
  },
  {
    id: 2,
    type: "promotion",
    title: "Khuyến mãi mới: Giảm 10% cho sản phẩm hữu cơ",
    description: "Áp dụng từ ngày 10/05 đến 20/05/2025.",
    date: "1 ngày trước",
    isRead: false,
  },
  {
    id: 3,
    type: "shipping",
    title: "Cập nhật thông tin vận chuyển đơn hàng #12345",
    description: "Đơn hàng của bạn đang được vận chuyển.",
    date: "2 ngày trước",
    isRead: true,
  },
  {
    id: 4,
    type: "system",
    title: "Cập nhật chính sách bảo mật",
    description: "Chúng tôi đã cập nhật chính sách bảo mật của chúng tôi.",
    date: "1 tuần trước",
    isRead: true,
  },
  {
    id: 5,
    type: "order",
    title: "Đơn hàng #12346 đã được xác nhận",
    description: "Đơn hàng của bạn đã được xác nhận và đang được xử lý.",
    date: "1 tuần trước",
    isRead: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order":
      return <ShoppingBag className="h-5 w-5 text-blue-500" />;
    case "promotion":
      return <Tag className="h-5 w-5 text-green-500" />;
    case "shipping":
      return <Truck className="h-5 w-5 text-orange-500" />;
    case "system":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Đơn hàng #12345 đã được giao",
      description: "Đơn hàng của bạn đã được giao thành công.",
      date: "2 giờ trước",
      isRead: false,
    },
    {
      id: 2,
      type: "promotion",
      title: "Khuyến mãi mới: Giảm 10% cho sản phẩm hữu cơ",
      description: "Áp dụng từ ngày 10/05 đến 20/05/2025.",
      date: "1 ngày trước",
      isRead: false,
    },
    {
      id: 3,
      type: "shipping",
      title: "Cập nhật thông tin vận chuyển đơn hàng #12345",
      description: "Đơn hàng của bạn đang được vận chuyển.",
      date: "2 ngày trước",
      isRead: true,
    },
    {
      id: 4,
      type: "system",
      title: "Cập nhật chính sách bảo mật",
      description: "Chúng tôi đã cập nhật chính sách bảo mật của chúng tôi.",
      date: "1 tuần trước",
      isRead: true,
    },
    {
      id: 5,
      type: "order",
      title: "Đơn hàng #12346 đã được xác nhận",
      description: "Đơn hàng của bạn đã được xác nhận và đang được xử lý.",
      date: "1 tuần trước",
      isRead: true,
    },
  ]);
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      order: true,
      promotion: true,
      shipping: true,
      system: false,
    },
    push: {
      order: true,
      promotion: false,
      shipping: true,
      system: true,
    },
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  function markAsRead(id: number) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );

    toast({
      title: "Đã đánh dấu tất cả là đã đọc",
      description: "Tất cả thông báo đã được đánh dấu là đã đọc.",
    });
  }

  function deleteAllNotifications() {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setNotifications([]);
      setIsLoading(false);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Đã xóa tất cả thông báo",
        description: "Tất cả thông báo đã được xóa.",
      });
    }, 1000);
  }

  function saveNotificationSettings() {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSettingsDialogOpen(false);

      toast({
        title: "Đã lưu cài đặt thông báo",
        description: "Cài đặt thông báo của bạn đã được cập nhật.",
      });
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Thông báo</h2>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý thông báo của bạn
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="all">
            Tất cả
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
          <TabsTrigger value="order">Đơn hàng</TabsTrigger>
          <TabsTrigger value="promotion">Khuyến mãi</TabsTrigger>
          <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có thông báo nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex p-4 rounded-lg border ${
                    notification.isRead
                      ? "bg-white"
                      : "bg-blue-50 border-blue-200"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium ${
                          notification.isRead ? "" : "font-semibold"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {notification.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog xác nhận xóa tất cả */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tất cả thông báo</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tất cả thông báo không? Hành động này
              không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={deleteAllNotifications}
              disabled={isLoading}
            >
              {isLoading ? "Đang xóa..." : "Xóa tất cả"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog cài đặt thông báo */}
      <Dialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cài đặt thông báo</DialogTitle>
            <DialogDescription>
              Tùy chỉnh cách bạn nhận thông báo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Thông báo qua email</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                    <span>Đơn hàng</span>
                  </div>
                  <Switch
                    checked={notificationSettings.email.order}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: {
                          ...prev.email,
                          order: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    <span>Khuyến mãi</span>
                  </div>
                  <Switch
                    checked={notificationSettings.email.promotion}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: {
                          ...prev.email,
                          promotion: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-orange-500" />
                    <span>Vận chuyển</span>
                  </div>
                  <Switch
                    checked={notificationSettings.email.shipping}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: {
                          ...prev.email,
                          shipping: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Hệ thống</span>
                  </div>
                  <Switch
                    checked={notificationSettings.email.system}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        email: {
                          ...prev.email,
                          system: checked,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Thông báo đẩy</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                    <span>Đơn hàng</span>
                  </div>
                  <Switch
                    checked={notificationSettings.push.order}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        push: {
                          ...prev.push,
                          order: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    <span>Khuyến mãi</span>
                  </div>
                  <Switch
                    checked={notificationSettings.push.promotion}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        push: {
                          ...prev.push,
                          promotion: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-orange-500" />
                    <span>Vận chuyển</span>
                  </div>
                  <Switch
                    checked={notificationSettings.push.shipping}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        push: {
                          ...prev.push,
                          shipping: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Hệ thống</span>
                  </div>
                  <Switch
                    checked={notificationSettings.push.system}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        push: {
                          ...prev.push,
                          system: checked,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={saveNotificationSettings} disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
