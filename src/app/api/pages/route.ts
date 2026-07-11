import { createCollection, listCollection } from "@/lib/cms-api";
export const GET = () => listCollection("pages");
export const POST = (request: Request) => createCollection(request, "pages", ["admin"]);
