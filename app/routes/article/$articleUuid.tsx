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
  const img = intro?.images[0]
  const informations = data.article?.informations

  return (
    <div>
      <h1>{intro?.title}</h1>
      <p>{intro?.content}</p>
      {img ? <div>
        <img src={img.url} alt={img.description} />
        <p>{img.description}</p>
      </div>
        : null}
      {informations?.map(({ uuid, title, description }) => (<div key={uuid}><p>{title}</p><p>{description}</p></div>))}

      <div>
        <p>Contents</p>
        {data.article?.sections.slice(1).map((section) => (
          <div key={section.uuid}>
            <p>{section.title}</p>
            <div>{section.subSections.map(subSection => (
              <div key={subSection.uuid}>
                <p>{subSection.title}</p>
              </div>
            ))}</div>
          </div>
        ))}
      </div>
      <hr></hr>
      <div>
        {data.article?.sections.slice(1).map((section) => (
          <div key={section.uuid}>
            <p>{section.title}</p>
            <div>{section.subSections.map(subSection => (
              <div key={subSection.uuid}>
                <p>{subSection.title}</p>
                <textarea value={subSection.content || ''} contentEditable={false}></textarea>
              </div>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  )
}