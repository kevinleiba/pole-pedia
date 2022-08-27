import { useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/server-runtime';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import Section from '~/components/Section';
import { getArticle } from "~/models/article.server";
import { updateSection } from '~/models/section.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title")
  const content = formData.get("content")
  const uuid = formData.get("uuid")

  if (!uuid) return null
  const updatedSection = await updateSection({ sectionUuid: uuid as string, title: title as string, content: content as string })

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


function FullSection({ uuid, content, title, articleUuid }: { uuid: string, content: string, title: string, articleUuid: string }) {
  const [statefullTitle, setStatefullTitle] = useState(title)
  const [statefullContent, setStatefullContent] = useState(content)


  const fetcher = useFetcher();
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) initialRender.current = false
    else {
      fetcher.submit({ uuid, content: statefullContent, title: statefullTitle }, { method: "post" })
    }
  }, [statefullTitle, statefullContent])

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
    data.article?.sections.map(({ uuid, content, title }) => (
      <FullSection uuid={uuid} content={content || ''} title={title || ''} articleUuid={data.article?.uuid || ''} key={uuid} />
    ))
  )
}

export default ArticleEditPage