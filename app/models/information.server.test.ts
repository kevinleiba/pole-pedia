import { unSeed } from '../../prisma/unSeed'
import { createInformation, deleteInformation } from './information.server';
import { title, description } from '../../mocks/information'
import * as articleMock from '../../mocks/article'
import { Information, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let information: Information | null = null

describe("Information model", () => {
  beforeAll(async () => {
    await unSeed()
  })

  afterAll(async () => {
    await unSeed()
    await prisma.$disconnect()
  })

  test("can create an information", async () => {
    const article = await prisma.article.create({ data: { published: articleMock.published } })

    await createInformation({ title, description, articleUuid: article.uuid })
    const updatedArticle = await prisma.article.findFirst({ where: { uuid: article.uuid }, include: { informations: true } })
    information = updatedArticle!.informations[0]

    expect(information.title).toBe(title)
    expect(information.description).toBe(description)
  })

  test("can delete an information", async () => {
    await deleteInformation({ uuid: information!.uuid })
    const informations = await prisma.information.findMany()
    expect(informations).toHaveLength(0)
  })
})
