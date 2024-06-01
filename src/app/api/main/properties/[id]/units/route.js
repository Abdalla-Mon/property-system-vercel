import { createHandler } from "@/app/api/handler";
import { getUnitsByPropertyId } from "@/services/server/properties";

const handler = createHandler({
  getService: getUnitsByPropertyId,
});

export const GET = handler.GET;
