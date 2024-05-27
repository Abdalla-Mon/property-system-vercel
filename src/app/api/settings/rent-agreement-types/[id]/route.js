import {
  deleteRentAgreementType,
  updateRentAgreementType,
} from "@/services/server/settings";

import { createHandler } from "@/app/api/settings/settings-handler";

const handler = createHandler({
  deleteService: deleteRentAgreementType,
  putService: updateRentAgreementType,
});

export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
