import { unSeed } from '../../prisma/unSeed'
import * as sectionMock from '../../mocks/section'
import * as articleMock from '../../mocks/article'
import * as imageMock from '../../mocks/image'
import { PrismaClient, Section } from "@prisma/client";
import { addImageToSection, createSection, createSubSection, updateSection } from './section.server';

const prisma = new PrismaClient();
let section: Section | null = null

describe("Section model", () => {
  beforeAll(async () => {
    await unSeed()
  })

  afterAll(async () => {
    await unSeed()
    await prisma.$disconnect()
  })

  test("can create a section", async () => {
    const article = await prisma.article.create({ data: { published: articleMock.published } })


    section = await createSection({ content: sectionMock.content, order: sectionMock.order, title: sectionMock.title, articleUuid: article.uuid })
    expect(section?.content).toBe(sectionMock.content)
    expect(section?.order).toBe(sectionMock.order)
    expect(section?.title).toBe(sectionMock.title)

    const updatedArticle = await prisma.article.findFirst({ where: { uuid: article.uuid }, include: { sections: true } })
    expect(updatedArticle?.sections[0].uuid).toBe(section?.uuid)
  })

  test("can create multiple sub sections", async () => {
    const firstSubSectionContent = { content: 'firstSubSectionContent', order: 0, title: 'firstSubSection', sectionUuid: section!.uuid }
    const secondSubSectionContent = { content: 'secondSubSectionContent', order: 1, title: 'secondSubSection', sectionUuid: section!.uuid }

    await createSubSection(firstSubSectionContent)
    await createSubSection(secondSubSectionContent)

    const updatedSection = await prisma.section.findFirst({ where: { uuid: section?.uuid }, include: { subSections: true } })

    expect(updatedSection?.subSections[0].content).toBe(firstSubSectionContent.content)
    expect(updatedSection?.subSections[0].order).toBe(firstSubSectionContent.order)
    expect(updatedSection?.subSections[0].title).toBe(firstSubSectionContent.title)

    expect(updatedSection?.subSections[1].content).toBe(secondSubSectionContent.content)
    expect(updatedSection?.subSections[1].order).toBe(secondSubSectionContent.order)
    expect(updatedSection?.subSections[1].title).toBe(secondSubSectionContent.title)
  })

  test('can connect an Image to a section', async () => {
    const image = await prisma.image.create({ data: { url: imageMock.url, description: imageMock.description } })

    await addImageToSection({ sectionUuid: section!.uuid, imageUuid: image.uuid })

    const updatedSection = await prisma.section.findFirst({ where: { uuid: section!.uuid }, include: { images: true } })
    expect(updatedSection?.images[0].url).toBe(image.url)
    expect(updatedSection?.images[0].description).toBe(image.description)
  })

  test("Can update a section", async () => {
    const title = 'updatedTitle'
    const content = '<p>Updated Content</p>'

    await updateSection({ title, content, sectionUuid: section!?.uuid })
    const updatedSection = await prisma.section.findFirst({ where: { uuid: section!.uuid } })
    expect(updatedSection!.title).toBe(title)
    expect(updatedSection!.content).toBe(content)
  })

})
