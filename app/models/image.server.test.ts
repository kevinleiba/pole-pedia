import { unSeed } from '../../prisma/unSeed'
import { createImage } from './image.server'
import { url, description } from '../../mocks/image'
import { Image, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  })
})
