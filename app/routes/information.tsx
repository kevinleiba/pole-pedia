import { ActionFunction, json } from "@remix-run/server-runtime";
import { createInformation, updateInformation } from "~/models/information.server";


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const uuid = formData.get("uuid") as string
  const articleUuid = formData.get("articleUuid") as string

  if (uuid) {
    return json(
      await updateInformation({ uuid, title, description })
    )
  } else {
    return json(
      await createInformation({ title, description, articleUuid })
    )
  }
};
