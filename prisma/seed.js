const { PrismaClient } = require("@prisma/client");
const articleMock = require('../mocks/article')
const prisma = new PrismaClient();

async function seed() {

  await prisma.article.delete({ where: { title: articleMock.title } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const article = await prisma.article.create({ data: { content: articleMock.content, image: articleMock.image, introduction: articleMock.introduction, title: articleMock.title } })

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
