import { createHandler } from "@/app/api/handler";
import {
  createContractExpenseInvoices,
  getRentAgreementPaymentForContractExpences,
} from "@/services/server/rentAgreements";

const handler = createHandler({
  postService: createContractExpenseInvoices,
  getService: getRentAgreementPaymentForContractExpences,
});

export const POST = handler.POST;
export const GET = handler.GET;
