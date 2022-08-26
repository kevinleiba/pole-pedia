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
    <div className="p-m">
      <h1>{intro?.title}</h1>
      <div className="separator" />
      <div className="flex">
        <div className="flex-1">
          {intro?.content && JSON.parse(intro.content).blocks.map((block: { id: string, data: { text: string } }) => (
            <p className="mb-s" key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />
          ))}
          <div className="border border-darkGrey bg-lightGrey inline-block px-s">
            <p className="bold text-center my-s">Contents</p>
            {data.article?.sections.slice(1).map((section) => (
              <div key={section.uuid}>
                <a href={`#${section.uuid}`}>
                  <div className="flex mb-s hover:underline">
                    <p className="mr-s">{section.order}</p>
                    <p className="text-darkBlue">{section.title}</p>
                  </div>
                </a>
                <div>
                  {section.subSections.map((subSection) => (
                    <a key={subSection.uuid} href={`#${subSection.uuid}`}>

                      <div className="flex mb-s hover:underline">
                        <p className="mx-s">{section.order}.{subSection.order + 1}</p>
                        <p className="text-darkBlue">{subSection.title}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[320px] bg-lightBlue border border-darkGrey">
          <h4 className="bg-skyBlue text-center">{intro?.title}</h4>
          <div className="py-s">
            {img ? (
              <div className="flex flex-col items-center px-l mb-s">
                <img className="object-contain max-w-[256px]" src={img.url} alt={img.description} />
                <p className="mt-s text-center">{img.description}</p>
              </div>
            )
              : null}
            {informations ? (
              <div>
                <h5 className="bg-skyBlue text-center mb-s">Other informations</h5>
                {informations.map(({ uuid, title, description }) => (
                  <div className="flex px-l" key={uuid}>
                    <p className="flex-1 bold">{title}</p>
                    <p className="flex-1">{description}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="separator" />
      <div className="">
        {data.article?.sections.slice(1).map((section) => (
          <div key={section.uuid}>
            <p>{section.title}</p>
            <div>{section.subSections.map(subSection => (
              <div key={subSection.uuid}>
                <p>{subSection.title}</p>
                {subSection.content && JSON.parse(subSection.content).blocks.map((block: { id: string, data: { text: string } }) => (
                  <p key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                ))}
              </div>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  )
}