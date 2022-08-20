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

  const firstSubSection = await prisma.section.create({ data: { title: "FirstSubSection", content: "sub section content", order: 0 } })
  const firstSection = await prisma.section.create({ data: { title: "FirstSection", order: 1, subSections: { connect: [{ uuid: firstSubSection.uuid }] }, articleUuid: article.uuid } })


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
