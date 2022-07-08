import type { Article } from "@prisma/client";

import { prisma } from "~/db.server";


export function getArticles() {
  return prisma.article.findMany()
}