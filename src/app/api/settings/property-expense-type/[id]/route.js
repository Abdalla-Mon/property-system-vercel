import { createHandler } from "@/app/api/settings/settings-handler";
import {
  deletePropertyExpenseType,
  updatePropertyExpenseType,
} from "@/services/server/settings";

const handler = createHandler({
  deleteService: deletePropertyExpenseType,
  putService: updatePropertyExpenseType,
});

export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
