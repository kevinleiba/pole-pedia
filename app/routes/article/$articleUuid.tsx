import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";

import { getArticle } from "~/models/article.server";

type LoaderData = {
  article: Awaited<ReturnType<typeof getArticle>>
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.articleUuid, "articleUuid not found");

  const article = await getArticle({ articleUuid: params.articleUuid });
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ article });
};

export default function ArticleDetailPage() {
  const data = useLoaderData() as LoaderData;

  const intro = data.article?.sections[0]

  return (
    <div>
      <h1>{intro?.title}</h1>
      <p>{intro?.content}</p>
    </div>
  )
}