import type { Image } from "@prisma/client";

import { prisma } from "~/db.server";

export function createImage({ url, description }: { url: Image['url'], description: Image['description'] }) {
  return prisma.image.create({ data: { url, description } })
}

export function updateImage({ url, description, uuid }: { url: Image['url'], description: Image['description'], uuid: Image['uuid'] }) {
  return prisma.image.update({ where: { uuid }, data: { url, description } })
}