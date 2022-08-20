const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function unSeed() {

  await prisma.section.deleteMany()
  await prisma.information.deleteMany()
  await prisma.image.deleteMany()
  await prisma.article.deleteMany()
  console.log(`Database has been destroyed. 💀`);

}