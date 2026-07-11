import { createCollection, listCollection } from "@/lib/cms-api";
export const GET = () => listCollection("umkm_products");
export const POST = (request: Request) => createCollection(request, "umkm_products", ["admin", "operator"]);
