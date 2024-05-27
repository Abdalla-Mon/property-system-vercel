import { createUnitType, getUnitTypes } from "@/services/server/settings";
import { createHandler } from "@/app/api/settings/settings-handler";

const handler = createHandler({
  getService: getUnitTypes,
  postService: createUnitType,
});

export const GET = handler.GET;
export const POST = handler.POST;
