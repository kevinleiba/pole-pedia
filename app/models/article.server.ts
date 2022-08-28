import type { Article } from "@prisma/client";

import { prisma } from "~/db.server";

export function createArticle() {
  return prisma.article.create({ data: { published: false } })
}

export function publishArticle({ articleUuid }: { articleUuid: Article['uuid'] }) {
  return prisma.article.update({ where: { uuid: articleUuid }, data: { published: true } })
}

export function getArticle({ articleUuid }: { articleUuid: Article['uuid'] }) {
  return prisma.article.findFirst({
    where: { uuid: articleUuid },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          images: true, subSections: { include: { images: true }, orderBy: { order: 'asc' } }
        }
      }, informations: true
    }
  })
}

export function getAllArticles() {
  return prisma.article.findMany({ include: { sections: { orderBy: { order: 'asc' } } } })
}