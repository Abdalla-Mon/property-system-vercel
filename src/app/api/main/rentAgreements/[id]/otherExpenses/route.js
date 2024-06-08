import { createHandler } from "@/app/api/handler";
import {
  createOtherExpenseInvoices,
  getRentAgreementPaymentForOthersExpences,
} from "@/services/server/rentAgreements";

const handler = createHandler({
  postService: createOtherExpenseInvoices,
  getService: getRentAgreementPaymentForOthersExpences,
});

export const POST = handler.POST;
export const GET = handler.GET;
