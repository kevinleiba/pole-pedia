import { ActionFunction, json } from "@remix-run/server-runtime";
import { createImage, updateImage } from "~/models/image.server";
import { addImageToSection } from "~/models/section.server";


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const url = formData.get("url") as string
  const description = formData.get("description") as string
  const uuid = formData.get("uuid") as string
  const sectionUuid = formData.get("sectionUuid") as string

  if (uuid) {
    return json(
      await updateImage({ uuid, url, description })
    )
  } else {
    const createdImage = await createImage({ url, description })
    await addImageToSection({ sectionUuid, imageUuid: createdImage.uuid })
    return json(createdImage)
  }
};
