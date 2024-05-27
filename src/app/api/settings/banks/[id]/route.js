import { deleteBank, updateBank } from "@/services/server/settings";

import { createHandler } from "@/app/api/settings/settings-handler";

const handler = createHandler({
  deleteService: deleteBank,
  putService: updateBank,
});

export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
