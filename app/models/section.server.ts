import { Image, Section } from "@prisma/client";
import { prisma } from "~/db.server";

export function createSection({ content, order, title, articleUuid }: { content: Section['content'], order: Section['order'], title: Section['title'], articleUuid: Section['articleUuid'] }) {
  return prisma.section.create({
    data: {
      content,
      order,
      title,
      articleUuid
    }
  })
}

export async function createSubSection({ content, order, title, sectionUuid }: { content: Section['content'], order: Section['order'], title: Section['title'], sectionUuid: Section['uuid'] }) {
  const subSection = await prisma.section.create({ data: { content, order, title } })
  await prisma.section.update({
    where: { uuid: sectionUuid },
    data: {
      subSections: {
        connect: { uuid: subSection.uuid }
      }
    }
  })
  return subSection
}

export function addImageToSection({ sectionUuid, imageUuid }: { sectionUuid: Section['uuid'], imageUuid: Image['uuid'] }) {
  return prisma.section.update({
    where: { uuid: sectionUuid },
    data: {
      images: { connect: { uuid: imageUuid } }
    },
  })
}

export function updateSection({ sectionUuid, content, title }: { content: Section['content'], title: Section['title'], sectionUuid: Section['uuid'] }) {
  return prisma.section.update({
    where: { uuid: sectionUuid },
    data: {
      content,
      title
    }
  })
}

// @TODO --> Add reorder functions