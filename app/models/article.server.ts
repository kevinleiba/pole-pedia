import type { Article } from "@prisma/client";

import { prisma } from "~/db.server";

export function getArticles() {
  return prisma.article.findMany()
}

export function createArticle({ content, image, introduction, title }: { content: Article['content'], image: Article['image'], introduction: Article['introduction'], title: Article['title'] }) {
  return prisma.article.create({ data: { content, image, introduction, title } })
}