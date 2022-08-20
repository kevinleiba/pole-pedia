import type { /*Article,*/ Image } from "@prisma/client";

import { prisma } from "~/db.server";

export function createImage({ url, description }: { url: Image['url'], description: Image['description'] }) {
  return prisma.image.create({ data: { url, description } })
}

// export async function linkImageToArticle({ imageUuid, articleUuid }: { imageUuid: Image['uuid'], articleUuid: Article['uuid'] }) {
//   await prisma.article.update(({
//     where: { uuid: articleUuid },
//     data: { image: { connect: { uuid: imageUuid } } }
//   }))
// }

// export async function linkImageToSection({ imageUuid, sectionUuid }: { imageUuid: Image['uuid'], sectionUuid: Article['uuid'] }) {
//   await prisma.section.update(({
//     where: { uuid: sectionUuid },
//     data: { images: { connect: [{ uuid: imageUuid }] } }
//   }))
// }