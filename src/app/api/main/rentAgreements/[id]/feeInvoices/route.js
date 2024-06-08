import { createHandler } from "@/app/api/handler";
import {
  createFeeInvoices,
  gentRentAgreementPaymentsForFees,
} from "@/services/server/rentAgreements";

const handler = createHandler({
  postService: createFeeInvoices,
  getService: gentRentAgreementPaymentsForFees,
});

export const POST = handler.POST;
export const GET = handler.GET;
