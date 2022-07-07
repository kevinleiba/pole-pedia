const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {

  const content = `
# Sample Section
this is a sample section with some sample text *inside* of **it**

# Sample Seconde Section
yet another section....
  `

  const image = "https://picsum.photos/200"

  const introduction = `Sample introduction for a sample article.... Pretty nice uh?`

  const title = "Sample Article"

  await prisma.article.delete({ where: { title } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const article = await prisma.article.create({ data: { content, image, introduction, title } })

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
