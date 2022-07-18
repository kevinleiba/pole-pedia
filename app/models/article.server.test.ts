import { unSeed } from '../../prisma/unSeed'
import { createArticle, getArticles } from './article.server'
import { content, image, introduction, title } from '../../mocks/article'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await unSeed()
})

afterAll(async () => {
  await prisma.$disconnect
})

test("can get articles", async () => {
  const articles = await getArticles()

  expect(articles).toHaveLength(0)
})

test('can create an article', async () => {
  await createArticle({ content, image, introduction, title })

  const retrievedArticle = await prisma.article.findFirst({ where: { title } })
  expect(retrievedArticle?.content).toBe(content)
  expect(retrievedArticle?.image).toBe(image)
  expect(retrievedArticle?.introduction).toBe(introduction)
  expect(retrievedArticle?.title).toBe(title)
})