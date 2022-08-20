import { unSeed } from '../../prisma/unSeed'
import { createImage } from './image.server'
import { url, description } from '../../mocks/image'
// import * as articleMock from '../../mocks/article'
import {/* Article ,*/ Image, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let image: Image | null = null
// let article: Article | null = null

describe("Image model", () => {
  beforeAll(async () => {
    await unSeed()
  })

  afterAll(async () => {
    await unSeed()
    await prisma.$disconnect()
  })

  test("can create an image", async () => {
    await createImage({ url, description })
    const images = await prisma.image.findMany()
    expect(images).toHaveLength(1)
    expect(images[0].description).toBe(description)
    expect(images[0].url).toBe(url)

    image = images[0]
  })

  // test("can link an image to an article", async () => {
  //   article = await prisma.article.create({ data: { published: articleMock.published } })

  //   await linkImageToArticle({ imageUuid: image!.uuid, articleUuid: article.uuid })
  //   const updatedArticle = await prisma.article.findUnique({ where: { uuid: article.uuid }, include: { image: true } })
  //   expect(updatedArticle?.image?.uuid).toBe(image?.uuid)
  // })
})
