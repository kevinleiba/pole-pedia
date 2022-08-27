import { useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
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


function FullSection({ uuid, content, title, articleUuid, order }: { uuid: string, content: string, title: string, articleUuid: string, order: number }) {
  const [statefullTitle, setStatefullTitle] = useState(title)
  const [statefullContent, setStatefullContent] = useState(content)
  const [statefullUuid, setStatefullUuid] = useState(uuid)

  const fetcher = useFetcher();
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) initialRender.current = false
    else {
      fetcher.submit({ uuid, content: statefullContent, title: statefullTitle, articleUuid, order: String(order) }, { method: "post" })
    }
  }, [statefullTitle, statefullContent])

  useEffect(() => {
    if (fetcher.data?.uuid !== statefullUuid) setStatefullUuid(fetcher.data?.uuid)
  }, [fetcher.data?.uuid])

  return (
    <div>
      <input type="text" defaultValue={title} onBlur={(e) => {
        setStatefullTitle(e.target.value)
      }} />
      <Section onBlur={setStatefullContent}
        content={content || ''} />
      <fetcher.Form method='post' action={`/article/${articleUuid}/edit`} />
    </div>
  )
}

function ArticleEditPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className='p-m'>
      <h1>Article Edition</h1>
      <div className="separator" />
      {data.article?.sections.map(({ uuid, content, title, order }) => (
        <FullSection
          uuid={uuid || ''}
          content={content || ''}
          title={title || ''}
          articleUuid={data.article?.uuid || ''}
          order={order} key={uuid} />
      ))}
    </div>
  )
}

export default ArticleEditPage