import axios, { service } from "@/tools/axios.tool";
import { getApiUrl } from "@/tools/url.tool";

const PaymentService = {
  createPaymentUrl(orderId: string) {
    return service(
      axios.post(getApiUrl(`/payments/create/${orderId}`)),
      true
    );
  },
};
