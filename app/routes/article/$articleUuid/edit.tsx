import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction } from '@remix-run/server-runtime';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import Section from '~/components/Section';
import { getArticle } from "~/models/article.server";
import { createSection, updateSection } from '~/models/section.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const uuid = formData.get("uuid") as string
  const articleUuid = formData.get("articleUuid") as string
  const order = Number(formData.get("order")) as number

  const updatedSection = uuid ? await updateSection({ sectionUuid: uuid, title, content }) : await createSection({ content, order, title, articleUuid })

  return json(updatedSection)
};


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


function FullSection({ uuid, content, title, articleUuid, order, withContent, sectionUuid }: { uuid: string, content: string, title: string, articleUuid: string, order: number, withContent?: boolean, sectionUuid?: string }) {
  const [statefullTitle, setStatefullTitle] = useState(title)
  const [statefullContent, setStatefullContent] = useState(content)
  const [statefullUuid, setStatefullUuid] = useState(uuid)

  const fetcher = useFetcher();
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) initialRender.current = false
    else {
      fetcher.submit({ uuid, content: statefullContent, title: statefullTitle, articleUuid, order: String(order), sectionUuid: sectionUuid || '' }, { method: "post" })
    }
  }, [statefullTitle, statefullContent])

  useEffect(() => {
    if (fetcher.data?.uuid !== statefullUuid) setStatefullUuid(fetcher.data?.uuid)
  }, [fetcher.data?.uuid])

  return (
    <div>
      <input className='text-xxl mb-m block w-full border border-darkGrey px-xs rounded rounded-m' type="text" defaultValue={title} onBlur={(e) => {
        setStatefullTitle(e.target.value)
      }} />
      {withContent && <Section onBlur={setStatefullContent}
        content={content || ''} />}
      <fetcher.Form method='post' action={`/article/${articleUuid}/edit`} />
    </div>
  )
}

function ArticleEditPage() {
  const data = useLoaderData() as LoaderData;
  const intro = data.article?.sections[0]

  return (
    <div className='p-m'>
      <h1>Article Edition</h1>
      <div className="separator" />
      <div className='mb-l'>
        <FullSection
          uuid={intro?.uuid || ''}
          content={intro?.content || ''}
          title={intro?.title || ''}
          articleUuid={data.article?.uuid || ''}
          order={intro?.order ?? 0}
          withContent
        />
      </div>
      {data.article?.sections.slice(1).map(({ uuid, content, title, order, subSections }) => (
        <div key={uuid}>
          <div>
            <FullSection
              uuid={uuid || ''}
              content={content || ''}
              title={title || ''}
              articleUuid={data.article?.uuid || ''}
              order={order}
            />
          </div>
          {subSections.map((subSection) => (
            <div className='ml-m' key={subSection.uuid}>
              <FullSection
                uuid={subSection.uuid || ''}
                content={subSection.content || ''}
                title={subSection.title || ''}
                articleUuid={''}
                order={subSection.order}
                withContent
                sectionUuid={uuid}
              />
            </div>
          ))}
        </div>
      ))}
      <Link to={`/article/${data.article?.uuid || ''}`}><p className='fixed bottom-m right-m'>View Article</p></Link>
    </div>
  )
}

export default ArticleEditPage