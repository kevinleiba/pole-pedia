import { unSeed } from '../../prisma/unSeed'
import { getArticles } from './article.server'

beforeAll(async () => {
  await unSeed()
})

test("can get articles", async () => {
  const articles = await getArticles()

  expect(articles).toHaveLength(0)
})