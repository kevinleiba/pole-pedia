import { unSeed } from '../../prisma/unSeed'
import * as sectionMock from '../../mocks/section'
import { createArticle, getAllArticles, getArticle, publishArticle, searchArticles } from './article.server'
import { Article, PrismaClient, Section } from "@prisma/client";

const prisma = new PrismaClient();
let article: Article | null = null
let introSection: Section | null = null

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

  test("can get article", async () => {
    introSection = await prisma.section.create({ data: { content: sectionMock.content, order: sectionMock.order, title: sectionMock.title, articleUuid: article!.uuid } })

    const foundArticle = await getArticle({ articleUuid: article!.uuid })
    expect(foundArticle?.uuid).toBe(article?.uuid)
    expect(foundArticle?.sections[0].uuid).toBe(introSection!.uuid)
  })

  test("can get all articles", async () => {

    const allArticles = await getAllArticles()
    expect(allArticles[0].sections[0].uuid).toBe(introSection!.uuid)
  })

  test("can search articles", async () => {
    const search = sectionMock.title.substring(0, 3).toLocaleLowerCase()

    const foundArticles = await searchArticles({ search })
    expect(foundArticles[0].uuid).toBe(article?.uuid)
  })
})

