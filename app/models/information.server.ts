import { prisma } from "~/db.server";
import { Article, Information } from "@prisma/client";

export function createInformation({ title, description, articleUuid }: { title: Information['title'], description: Information['description'], articleUuid: Article['uuid'] }) {
  return prisma.information.create({ data: { title, description, articleUuid } })
}

export function deleteInformation({ uuid }: { uuid: Information['uuid'] }) {
  return prisma.information.delete({ where: { uuid } })
}

export function updateInformation({ uuid, title, description }: { uuid: Information['uuid'], title: Information['title'], description: Information['description'] }) {
  return prisma.information.update({ where: { uuid }, data: { title, description } })
}