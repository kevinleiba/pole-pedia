import type { Article } from "@prisma/client";

import { prisma } from "~/db.server";

export function createArticle() {
  return prisma.article.create({ data: { published: false } })
}

export function publishArticle({ articleUuid }: { articleUuid: Article['uuid'] }) {
  return prisma.article.update({ where: { uuid: articleUuid }, data: { published: true } })
}