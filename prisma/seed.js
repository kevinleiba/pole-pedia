const { PrismaClient } = require("@prisma/client");
const articleMock = require('../mocks/article')
const imageMock = require('../mocks/image')
const informationMock = require('../mocks/information')
const sectionMock = require('../mocks/section')
const prisma = new PrismaClient();

async function seed() {

  await prisma.section.deleteMany()
  await prisma.information.deleteMany()
  await prisma.image.deleteMany()
  await prisma.article.deleteMany()


  const introImage = await prisma.image.create({ data: { description: imageMock.description, url: imageMock.url } })
  const article = await prisma.article.create({ data: { published: articleMock.published } })

  const introSection = await prisma.section.create({ data: { content: sectionMock.content, order: sectionMock.order, title: sectionMock.title, articleUuid: article.uuid, images: { connect: [{ uuid: introImage.uuid }] } } })
  const info = await prisma.information.create({ data: { description: informationMock.description, title: informationMock.title, articleUuid: article.uuid } })

  const firstSubSection = await prisma.section.create({ data: { title: sectionMock.firstSubSection.title, content: sectionMock.firstSubSection.content, order: sectionMock.firstSubSection.order } })
  const firstSection = await prisma.section.create({ data: { title: sectionMock.firstSection.title, order: sectionMock.firstSection.order, subSections: { connect: [{ uuid: firstSubSection.uuid }] }, articleUuid: article.uuid } })

  const firstSubSectionImage = await prisma.image.create({ data: { description: "Another random picsum image", url: "https://picsum.photos/id/237/1000/300" } })
  const firstSubSectionSecondImage = await prisma.image.create({ data: { description: "This time is the last random picsum image", url: "https://picsum.photos/id/3/300/1000" } })
  await prisma.section.update({ where: { uuid: firstSubSection.uuid }, data: { images: { connect: { uuid: firstSubSectionImage.uuid } } } })
  await prisma.section.update({ where: { uuid: firstSubSection.uuid }, data: { images: { connect: { uuid: firstSubSectionSecondImage.uuid } } } })

  console.log(`Database has been seeded. 🌱`);
}


seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
