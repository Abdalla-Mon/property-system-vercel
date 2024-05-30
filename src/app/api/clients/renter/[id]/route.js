import { createHandler } from "@/app/api/handler";
import { deleteRenter, updateRenter } from "@/services/server/clients";

const handler = createHandler({
  deleteService: deleteRenter,
  putService: updateRenter,
});

export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
