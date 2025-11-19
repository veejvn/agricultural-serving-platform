import * as z from "zod";

export const marketPriceSchema = z.object({
  productId: z.string().min(1, "Sản phẩm không được để trống"),
  price: z.string().min(1, "Giá không được để trống").regex(/^\d+$/, "Giá phải là số nguyên dương"),
  region: z.string().min(1, "Vùng miền không được để trống"),
  dateRecorded: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Ngày ghi nhận không hợp lệ",
  }),
});

export type MarketPriceFormValues = z.infer<typeof marketPriceSchema>;
