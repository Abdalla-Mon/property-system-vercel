import { createHandler } from "@/app/api/handler";
import {
  createInstallmentsAndInvoices,
  createRentAgreement,
} from "@/services/server/rentAgreements";

const handler = createHandler({
  postService: createInstallmentsAndInvoices,
});

export const POST = handler.POST;
