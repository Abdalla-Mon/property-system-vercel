import { deleteCollector, updateCollector } from "@/services/server/settings";

import { createHandler } from "@/app/api/settings/settings-handler";

const handler = createHandler({
  deleteService: deleteCollector,
  putService: updateCollector,
});

export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
