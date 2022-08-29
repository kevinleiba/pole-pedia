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
  return prisma.article.findMany({ orderBy: { createdAt: 'desc' }, include: { sections: { orderBy: { order: 'asc' } } } })
}

export async function searchArticles({ search }: { search: string }) {
  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      sections: {
        some: {
          order: 0,
          title: {
            contains: search,
            mode: 'insensitive'
          },
        },
      }
    },
    include: {
      sections: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  })
}