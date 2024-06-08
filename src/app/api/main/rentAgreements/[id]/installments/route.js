import { createHandler } from "@/app/api/handler";
import {
  createInstallmentsAndPayments,
  getRentAgreementPayments,
} from "@/services/server/rentAgreements";

const handler = createHandler({
  postService: createInstallmentsAndPayments,
  getService: getRentAgreementPayments,
});

export const POST = handler.POST;
export const GET = handler.GET;
