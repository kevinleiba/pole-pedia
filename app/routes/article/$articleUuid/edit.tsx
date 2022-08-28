import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction } from '@remix-run/server-runtime';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import produce from "immer"
import { v4 as uuidv4 } from 'uuid';


import Section from '~/components/Section';
import { getArticle } from "~/models/article.server";
import { createSection, createSubSection, updateSection } from '~/models/section.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const uuid = formData.get("uuid") as string
  const articleUuid = formData.get("articleUuid") as string
  const sectionUuid = formData.get("sectionUuid") as string
  const order = Number(formData.get("order")) as number

  if (uuid) {
    return json(await updateSection({ sectionUuid: uuid, title, content }))
  } else if (articleUuid) {
    return json(await createSection({ content, order, title, articleUuid }))
  } else {
    return json(await createSubSection({ content, order, title, sectionUuid }))
  }
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

      console.log(JSON.stringify({
        uuid: statefullUuid,
        content: statefullContent,
        title: statefullTitle,
        articleUuid,
        order: String(order),
        sectionUuid: sectionUuid || ''
      }))


      fetcher.submit(
        {
          uuid: statefullUuid,
          content: statefullContent,
          title: statefullTitle,
          articleUuid,
          order: String(order),
          sectionUuid: sectionUuid || ''
        },
        { method: "post" })
    }
  }, [statefullTitle, statefullContent])

  useEffect(() => {
    if (fetcher.data?.uuid) setStatefullUuid(fetcher.data?.uuid)
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

const EMPTY_SECTION = { content: '', uuid: '', title: '', images: [], createdAt: new Date(), updatedAt: new Date() }


function ArticleEditPage() {
  const data = useLoaderData() as LoaderData;

  const [intro, setIntro] = useState(data.article?.sections[0] || { ...EMPTY_SECTION, fakeUuid: uuidv4(), order: 0 })
  const [sections, setSections] = useState(data.article?.sections.slice(1) || [])

  function addSubSection({ sectionIndex }: { sectionIndex: number }) {
    setSections((oldSections) => {
      const order = oldSections[sectionIndex].subSections[oldSections[sectionIndex].subSections.length - 1].order + 1

      return produce(oldSections, draft => {
        draft[sectionIndex]
          .subSections
          // @ts-ignore
          .push({ ...EMPTY_SECTION, fakeUuid: uuidv4(), order, articleUuid: '' })
      })
    })
  }

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
      {sections.map((section, sectionIndex) => (
        // @ts-ignore
        <div className='mb-l' key={section.uuid || section.fakeUuid}>
          <div>
            <FullSection
              uuid={section.uuid || ''}
              content={section.content || ''}
              title={section.title || ''}
              articleUuid={data.article?.uuid || ''}
              order={section.order}
            />
          </div>
          <div className="ml-m">
            {section.subSections.map((subSection) => (
              // @ts-ignore
              <div className='mb-l' key={subSection.uuid || subSection.fakeUuid}>
                <FullSection
                  uuid={subSection.uuid || ''}
                  content={subSection.content || ''}
                  title={subSection.title || ''}
                  articleUuid=""
                  order={subSection.order}
                  withContent
                  sectionUuid={section.uuid}
                />
              </div>
            ))}
            <button onClick={() => { addSubSection({ sectionIndex }) }}>Add Sub Section</button>
          </div>
        </div>
      ))}
      <Link to={`/article/${data.article?.uuid || ''}`}><p className='fixed bottom-m right-m'>View Article</p></Link>
    </div>
  )
}

export default ArticleEditPage