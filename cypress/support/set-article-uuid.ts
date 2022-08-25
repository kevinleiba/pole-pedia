// @ts-ignore
import { dbObject } from '../../mocks/article'
// @ts-ignore
import { dbObject } from '../../mocks/section'
import { prisma } from "~/db.server";



async function setArticleUuid() {
  const article = await prisma.article.findFirst({ where: { sections: { every: { title: dbObject.title } } } })
  await prisma.article.update({ where: { uuid: article?.uuid }, data: { uuid: dbObject.uuid } })
}

setArticleUuid()