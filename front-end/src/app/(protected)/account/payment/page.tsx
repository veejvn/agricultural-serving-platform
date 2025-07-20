"use client"

import { useState } from "react"
import { z } from "zod"
import { CreditCard, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"

const paymentMethodFormSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, {
    message: "Số thẻ phải có 16 chữ số.",
  }),
  cardholderName: z.string().min(2, {
    message: "Tên chủ thẻ phải có ít nhất 2 ký tự.",
  }),
  expiryMonth: z.string({
    required_error: "Vui lòng chọn tháng hết hạn.",
  }),
  expiryYear: z.string({
    required_error: "Vui lòng chọn năm hết hạn.",
  }),
  cvv: z.string().regex(/^\d{3,4}$/, {
    message: "CVV phải có 3 hoặc 4 chữ số.",
  }),
  isDefault: z.boolean().default(false),
})

type PaymentMethodFormValues = z.infer<typeof paymentMethodFormSchema>

// Mock data
const mockPaymentMethods = [
  {
    id: "1",
    cardNumber: "4111111111111111",
    cardholderName: "Nguyễn Văn A",
    expiryMonth: "12",
    expiryYear: "2025",
    cvv: "***",
    isDefault: true,
    type: "visa",
  },
  {
    id: "2",
    cardNumber: "5555555555554444",
    cardholderName: "Nguyễn Văn A",
    expiryMonth: "06",
    expiryYear: "2024",
    cvv: "***",
    isDefault: false,
    type: "mastercard",
  },
]

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<(typeof mockPaymentMethods)[0] | null>(null)

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      isDefault: false,
    },
  })

  function onSubmit(data: PaymentMethodFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newPaymentMethod = {
        id: Date.now().toString(),
        ...data,
        type: getCardType(data.cardNumber),
      }

      if (data.isDefault) {
        // If new card is default, update other cards
        const updatedMethods = paymentMethods.map((method) => ({
          ...method,
          isDefault: false,
        }))
        setPaymentMethods([...updatedMethods, newPaymentMethod])
      } else {
        setPaymentMethods([...paymentMethods, newPaymentMethod])
      }

      setIsLoading(false)
      setIsAddDialogOpen(false)
      form.reset()

      toast({
        title: "Thêm phương thức thanh toán thành công",
        description: "Phương thức thanh toán mới đã được thêm vào tài khoản của bạn.",
      })
    }, 1000)
  }

  function handleEditPaymentMethod(paymentMethod: (typeof mockPaymentMethods)[0]) {
    setEditingPaymentMethod(paymentMethod)
    form.reset({
      cardNumber: paymentMethod.cardNumber,
      cardholderName: paymentMethod.cardholderName,
      expiryMonth: paymentMethod.expiryMonth,
      expiryYear: paymentMethod.expiryYear,
      cvv: "",
      isDefault: paymentMethod.isDefault,
    })
    setIsEditDialogOpen(true)
  }

  function handleUpdatePaymentMethod(data: PaymentMethodFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (editingPaymentMethod) {
        const updatedMethods = paymentMethods.map((method) => {
          if (method.id === editingPaymentMethod.id) {
            return {
              ...method,
              ...data,
              type: getCardType(data.cardNumber),
            }
          }

          // If updated card is default, update other cards
          if (data.isDefault && method.id !== editingPaymentMethod.id) {
            return {
              ...method,
              isDefault: false,
            }
          }

          return method
        })

        setPaymentMethods(updatedMethods)
      }

      setIsLoading(false)
      setIsEditDialogOpen(false)
      setEditingPaymentMethod(null)
      form.reset()

      toast({
        title: "Cập nhật phương thức thanh toán thành công",
        description: "Phương thức thanh toán đã được cập nhật.",
      })
    }, 1000)
  }

  function handleDeletePaymentMethod(id: string) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedMethods = paymentMethods.filter((method) => method.id !== id)
      setPaymentMethods(updatedMethods)
      setIsLoading(false)

      toast({
        title: "Xóa phương thức thanh toán thành công",
        description: "Phương thức thanh toán đã được xóa khỏi tài khoản của bạn.",
      })
    }, 1000)
  }

  function handleSetDefaultPaymentMethod(id: string) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))

      setPaymentMethods(updatedMethods)
      setIsLoading(false)

      toast({
        title: "Đặt phương thức thanh toán mặc định",
        description: "Phương thức thanh toán mặc định đã được cập nhật.",
      })
    }, 1000)
  }

  function getCardType(cardNumber: string) {
    // Simple card type detection based on first digit
    const firstDigit = cardNumber.charAt(0)
    if (firstDigit === "4") return "visa"
    if (firstDigit === "5") return "mastercard"
    if (firstDigit === "3") return "amex"
    return "unknown"
  }

  function formatCardNumber(cardNumber: string) {
    return `**** **** **** ${cardNumber.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Phương thức thanh toán</h1>
          <p className="text-muted-foreground">Quản lý các phương thức thanh toán của bạn</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm phương thức thanh toán
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
              <DialogDescription>Thêm thông tin thẻ của bạn để thanh toán nhanh chóng.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số thẻ</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên chủ thẻ</FormLabel>
                      <FormControl>
                        <Input placeholder="NGUYEN VAN A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tháng</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tháng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = (i + 1).toString().padStart(2, "0")
                              return (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Năm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = (new Date().getFullYear() + i).toString()
                              return (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Đặt làm mặc định</FormLabel>
                        <FormDescription>
                          Phương thức thanh toán này sẽ được sử dụng mặc định cho các đơn hàng của bạn.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Lưu"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paymentMethods.map((method) => (
          <Card key={method.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {method.type === "visa" && "Visa"}
                {method.type === "mastercard" && "Mastercard"}
                {method.type === "amex" && "American Express"}
                {method.type === "unknown" && "Thẻ tín dụng"}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCardNumber(method.cardNumber)}</div>
              <p className="text-xs text-muted-foreground">
                {method.cardholderName} • Hết hạn {method.expiryMonth}/{method.expiryYear}
              </p>
              {method.isDefault && (
                <div className="mt-2">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    Mặc định
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleEditPaymentMethod(method)}>
                Chỉnh sửa
              </Button>
              <div className="flex space-x-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    disabled={isLoading}
                  >
                    Đặt mặc định
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phương thức thanh toán</DialogTitle>
            <DialogDescription>Cập nhật thông tin thẻ của bạn.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePaymentMethod)} className="space-y-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số thẻ</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chủ thẻ</FormLabel>
                    <FormControl>
                      <Input placeholder="NGUYEN VAN A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tháng</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tháng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0")
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Năm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString()
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Đặt làm mặc định</FormLabel>
                      <FormDescription>
                        Phương thức thanh toán này sẽ được sử dụng mặc định cho các đơn hàng của bạn.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Cập nhật"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
