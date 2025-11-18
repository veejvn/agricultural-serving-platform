"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteDialog } from "@/components/common/delete-dialog";
import AccountService from "@/services/account.service";
import { IAccountResponse, Role } from "@/types/account";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/common/loading-spinner"; // Corrected import
import { ColumnDef } from "@tanstack/react-table"; // Added import

export default function AdminUsers() {
  const router = useRouter();
  const { toast } = useToast();

  const [allUsers, setAllUsers] = useState<IAccountResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IAccountResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUserIdToDelete, setSelectedUserIdToDelete] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const [result, error] = await AccountService.getAllAccounts();
      if (result) {
        // Lọc bỏ tài khoản có vai trò ADMIN
        const nonAdminUsers = result.filter(
          (user: IAccountResponse) => !user.roles.includes(Role.ADMIN)
        );
        setAllUsers(nonAdminUsers);
      } else {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể tải danh sách người dùng.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = allUsers.filter(
      (user) =>
        user.displayName?.toLowerCase().includes(lowercasedSearchTerm) ||
        user.email.toLowerCase().includes(lowercasedSearchTerm) ||
        user.id.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async () => {
    if (!selectedUserIdToDelete) return;

    setIsDeleting(true);
    const [result, error] = await AccountService.deleteAccountById(
      selectedUserIdToDelete
    );
    if (result) {
      toast({
        title: "Thành công",
        description: "Xóa người dùng thành công.",
      });
      setAllUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUserIdToDelete)
      );
    } else {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể xóa người dùng.",
        variant: "destructive",
      });
    }
    setIsDeleting(false);
    setSelectedUserIdToDelete(null);
  };

  const columns: ColumnDef<IAccountResponse>[] = [
    // Added ColumnDef type
    {
      accessorKey: "displayName",
      header: "Tên người dùng",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "roles",
      header: "Vai trò",
      cell: ({ row }) => {
        let roles: string[] = row.getValue("roles");
        // Nếu người dùng có nhiều hơn 1 vai trò, bỏ đi vai trò CONSUMER
        if (roles.length > 1) {
          roles = roles.filter((role) => role !== Role.CONSUMER);
        }
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role) => {
              let badgeClass =
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-400"; // Default for USER

              if (role === Role.FARMER) {
                badgeClass =
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-400";
              } else if (role === Role.SPECIALIST) {
                badgeClass =
                  "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 hover:bg-orange-400";
              }

              return (
                <Badge key={role} className={badgeClass}>
                  {role}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "dob",
      header: "Ngày sinh",
      cell: ({ row }) => {
        const dob: string = row.getValue("dob");
        return dob ? new Date(dob).toLocaleDateString() : "N/A";
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/user/${user.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => setSelectedUserIdToDelete(user.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>

      <DataTable columns={columns} data={filteredUsers} />

      <DeleteDialog
        open={!!selectedUserIdToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserIdToDelete(null);
          }
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xác nhận xóa người dùng"
        description="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
      />
    </div>
  );
}
