import { unSeed } from '../../prisma/unSeed'
import * as informationMock from '../../mocks/information'
import { createArticle, publishArticle } from './article.server'
import { Article, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let article: Article | null = null

describe("Article model", () => {
  beforeAll(async () => {
    await unSeed()
  })

  afterAll(async () => {
    await unSeed()
    await prisma.$disconnect()
  })


  test("Can create an article", async () => {
    article = await createArticle()

    expect(article.published).toBe(false)
  })

  test("Can publish an article", async () => {
    await publishArticle({ articleUuid: article!.uuid })

    const updatedArticle = await prisma.article.findFirstOrThrow({ where: { uuid: article?.uuid } })
    expect(updatedArticle.published).toBe(true)
  })
})

