import { Link, useLoaderData } from "@remix-run/react";
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
      <div className="flex justify-end text-xs bg-gradient-to-b from-white via-white to-lightGrey py-s pr-m relative">
        <Link className="hover:underline text-xs" to={`/article/${data.article?.uuid}/edit`}>Edit</Link>
        <div className="absolute left-0 bottom-0 right-0 h-[1px] bg-gradient-to-r from-white to-vividBlue"></div>
      </div>
      <div className="p-m">
        <h1>{intro?.title}</h1>
        <div className="separator" />
        <div className="flex">
          <div className="flex-1">
            <div dangerouslySetInnerHTML={{ __html: intro?.content || '' }} className="space-y-s mb-m" id="intro-content" />
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
                  <img className="object-contain max-w-[292px] max-h-[292px] w-full h-full m-auto intro-image" src={img.url} alt={img.description} />
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
        <div className="mt-l">
          {data.article?.sections.slice(1).map((section, sectionIndex) => (
            <div className="mb-m" key={section.uuid} id={section.uuid}>
              <h2>{section.title}</h2>
              <div className="separator" />
              <div>
                {section.subSections.map((subSection, subSectionIndex) => (
                  <div className="mb-m" key={subSection.uuid} id={subSection.uuid}>
                    <h3 className="mb-m">{subSection.title}</h3>
                    <div className="flex">
                      <div className="flex-1">
                        <div dangerouslySetInnerHTML={{ __html: subSection.content || '' }} className="space-y-s" id={`section-${sectionIndex}-subsection-${subSectionIndex}`} />
                      </div>
                      {subSection.images.length > 0 ? (
                        <div className="flex flex-col items-center">
                          {subSection.images.map(image => (
                            <div key={image.uuid} className="bg-lightGrey border border-darkGrey p-xs mb-m">
                              <img className="border border-darkGrey object-contain max-w-[292px] max-h-[292px] m-auto subsection-image" src={image.url} alt={image.description} />
                              <p className="text-center">{image.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}