import { createHandler } from "@/app/api/handler";
import { createFeeInvoices } from "@/services/server/rentAgreements";

const handler = createHandler({
  postService: createFeeInvoices,
});

export const POST = handler.POST;
