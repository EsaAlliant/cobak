import { createCollection, listCollection } from "@/lib/cms-api";
export const GET = () => listCollection("categories");
export const POST = (request: Request) => createCollection(request, "categories", ["admin", "operator"]);
