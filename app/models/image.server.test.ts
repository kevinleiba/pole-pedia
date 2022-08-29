import { unSeed } from '../../prisma/unSeed'
import { createImage, updateImage } from './image.server'
import { url, description } from '../../mocks/image'
import { Image, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let image: Image

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

  test("can update an image", async () => {
    const newDescription = 'updated description'
    const newUrl = 'https://picsum.photos/id/42/20/10'

    await updateImage({ uuid: image.uuid, url: newUrl, description: newDescription })
    const updatedImage = await prisma.image.findFirst({ where: { uuid: image.uuid } })
    expect(updatedImage?.url).toBe(newUrl)
    expect(updatedImage?.description).toBe(newDescription)
  })
})
