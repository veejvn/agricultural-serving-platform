import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const PaymentService = {
  createPaymentUrl(orderId: string) {
    return service(
      axios.post(getApiUrl(`/payments/create/${orderId}`)),
      true
    );
  },
  vnpayReturn(params: any) {
    return service(
      axios.get(getApiUrl(`/payments/vnpay-return`), { params }),
      true
    );
  }
};

export default PaymentService;