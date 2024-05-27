import { createHandler } from "@/app/api/settings/settings-handler";
import {
  createContractExpense,
  getContractExpenses,
} from "@/services/server/settings";

const handler = createHandler({
  getService: getContractExpenses,
  postService: createContractExpense,
});

export const GET = handler.GET;
export const POST = handler.POST;
