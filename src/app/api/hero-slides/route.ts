import { createCollection, listCollection } from "@/lib/cms-api";
export const GET = () => listCollection("hero_slides");
export const POST = (request: Request) => createCollection(request, "hero_slides", ["admin"]);
