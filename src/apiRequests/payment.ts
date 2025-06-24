import http from "@/lib/http";
import {
  CreatePayOSPaymentBodyType,
  CreatePayOSPaymentResType,
} from "@/schemaValidations/payment.model";

const prefix = "/payments";
const paymentApiRequests = {
  createPayOSPayment: (body: CreatePayOSPaymentBodyType) =>
    http.post<CreatePayOSPaymentResType>(`${prefix}/payos`, body),
  // PayOS return/cancel handlers are handled by backend webhook
};

export default paymentApiRequests;
