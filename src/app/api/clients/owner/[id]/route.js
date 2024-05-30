import { createHandler } from "@/app/api/handler";
import { deleteOwner, updateOwner } from "@/services/server/clients";

const handler = createHandler({
  deleteService: deleteOwner,
  putService: updateOwner,
});

export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
