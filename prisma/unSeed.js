const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function unSeed() {

  await prisma.article.deleteMany({})
  console.log(`Database has been destroyed. 💀`);

}