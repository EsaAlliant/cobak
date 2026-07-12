import { createCollection, listCollection } from "@/lib/cms-api";
export const GET = () => listCollection("struktur_organisasi");
export const POST = (request: Request) => createCollection(request, "struktur_organisasi", ["admin"]);
