import { deleteState, updateState } from "@/services/server/settings";

import { createHandler } from "@/app/api/settings/settings-handler";

const handler = createHandler({
  deleteService: deleteState,
  putService: updateState,
});

export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
