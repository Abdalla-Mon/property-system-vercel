import { createHandler } from "@/app/api/handler";
import { createContractExpenseInvoices } from "@/services/server/rentAgreements";

const handler = createHandler({
  postService: createContractExpenseInvoices,
});

export const POST = handler.POST;
