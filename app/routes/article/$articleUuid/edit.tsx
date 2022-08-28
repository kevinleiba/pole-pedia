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

interface FullSectionArgs {
  setSectionUuid?: ({ uuid, content, title }: { uuid: string, content: string, title: string }) => void;
  uuid: string,
  content: string,
  title: string,
  articleUuid: string,
  order: number,
  withContent?: boolean,
  sectionUuid?: string
}

function FullSection(
  { setSectionUuid, uuid, content, title, articleUuid, order, withContent, sectionUuid }: FullSectionArgs
) {
  const [statefullTitle, setStatefullTitle] = useState(title)
  const [statefullContent, setStatefullContent] = useState(content)
  const [statefullUuid, setStatefullUuid] = useState(uuid)

  const fetcher = useFetcher();
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) initialRender.current = false
    else {
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
    if (fetcher.data?.uuid) {
      setStatefullUuid(fetcher.data?.uuid)
      setSectionUuid?.(
        { uuid: fetcher.data.uuid, content: statefullContent, title: statefullTitle },
      )
    }
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

interface InformationProps {
  title: string;
  description: string;
  uuid?: string
  articleUuid: string;
}

function Information({ articleUuid, title, description, uuid }: InformationProps) {
  const titleRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLInputElement | null>(null)

  const [statefullUuid, setStatefullUuid] = useState(uuid || '')

  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.data?.uuid) {
      setStatefullUuid(fetcher.data?.uuid)
    }
  }, [fetcher.data?.uuid])

  function updateInfo() {
    if (titleRef.current?.value && descriptionRef.current?.value) {
      fetcher.submit(
        {
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          uuid: statefullUuid,
          articleUuid,
        },
        { method: "post", action: '/information' }
      )
    }
  }

  return (
    <div className='w-[200px] border border-darkGrey rounded rounded-m' >
      <input defaultValue={title} type="text" ref={titleRef} onBlur={() => { updateInfo() }} />
      <input defaultValue={description} type="text" ref={descriptionRef} onBlur={() => { updateInfo() }} />
    </div>
  )
}

const EMPTY_SECTION = { content: '', uuid: '', title: '', images: [], createdAt: new Date(), updatedAt: new Date() }


function ArticleEditPage() {
  const data = useLoaderData() as LoaderData;

  const [intro, setIntro] = useState(data.article?.sections[0] || { ...EMPTY_SECTION, fakeUuid: uuidv4(), order: 0 })
  const [sections, setSections] = useState(data.article?.sections.slice(1) || [])
  const [informations, setInformations] = useState(data.article?.informations || [])


  function addSubSection({ sectionIndex }: { sectionIndex: number }) {
    setSections((oldSections) => {
      const prevSubSections = oldSections[sectionIndex].subSections[oldSections[sectionIndex].subSections.length - 1]
      const order = prevSubSections ? prevSubSections.order + 1 : 0

      return produce(oldSections, draft => {
        draft[sectionIndex]
          .subSections
          // @ts-ignore
          .push({ ...EMPTY_SECTION, fakeUuid: uuidv4(), order, articleUuid: '' })
      })
    })
  }

  function addSection() {
    setSections((oldSections) => {
      const lastSection = oldSections[oldSections.length - 1]
      const order = lastSection ? lastSection.order + 1 : 1

      return produce(oldSections, draft => {
        draft.push({
          // @ts-ignore
          ...EMPTY_SECTION, fakeUuid: uuidv4(), order, articleUuid: data.article?.uuid || '', subSections: []
        })
      })
    })
  }

  function setIntroUuid({ uuid, content, title }: { uuid: string, content: string, title: string }) {
    setIntro(oldSections => {
      return produce(oldSections, draft => {
        draft.uuid = uuid
        draft.content = content
        draft.title = title
      })
    })
  }

  function setSectionUuid({ uuid, content, title, sectionIndex }: { uuid: string, content: string, title: string, sectionIndex: number }) {
    setSections(oldSections => {
      return produce(oldSections, draft => {
        draft[sectionIndex].uuid = uuid
        draft[sectionIndex].content = content
        draft[sectionIndex].title = title
      })
    })
  }

  function addInformation() {
    setInformations(infos => ([...infos, { uuid: '', fakeUuid: uuidv4(), description: '', title: '', articleUuid: data.article?.uuid || '', createdAt: new Date(), updatedAt: new Date() }]))
  }

  return (
    <div className='p-m'>
      <h1>Article Edition</h1>
      <div className="separator" />
      <div className='mb-l'>
        <div>
          <FullSection
            setSectionUuid={
              setIntroUuid
            }
            uuid={intro?.uuid || ''}
            content={intro?.content || ''}
            title={intro?.title || ''}
            articleUuid={data.article?.uuid || ''}
            order={intro?.order ?? 0}
            withContent
          />
        </div>
        <div className='flex mt-m p-s'>
          {/* @ts-ignore */}
          {informations.map(({ title, description, uuid, fakeUuid }) => (
            <Information key={uuid || fakeUuid} uuid={uuid} articleUuid={data.article?.uuid || ''} title={title} description={description} />
          ))}
          <button onClick={addInformation}>Add Information</button>
        </div>
      </div>
      <div>
        {sections.map((section, sectionIndex) => (
          // @ts-ignore
          <div className='mb-l' key={section.uuid || section.fakeUuid}>
            <div>
              <FullSection
                setSectionUuid={
                  ({ uuid, content, title }: { uuid: string, content: string, title: string }) => { setSectionUuid({ uuid, content, title, sectionIndex }) }
                }
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
        <button onClick={() => { addSection() }}>Add Section</button>
      </div>
      <Link to={`/article/${data.article?.uuid || ''}`}><p className='fixed bottom-m right-m'>View Article</p></Link>
    </div>
  )
}

export default ArticleEditPage