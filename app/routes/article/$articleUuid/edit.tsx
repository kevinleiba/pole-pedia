import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction } from '@remix-run/server-runtime';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import produce from "immer"
import { v4 as uuidv4 } from 'uuid';


import Section from '~/components/Section';
import { getArticle } from "~/models/article.server";
import { createSection, createSubSection, updateSection } from '~/models/section.server';
import { Image } from '@prisma/client';
import PlusIcon from '~/components/icons/PlusIcon'

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
  const [statefulTitle, setStatefulTitle] = useState(title)
  const [statefulContent, setStatefulContent] = useState(content)
  const [statefulUuid, setStatefulUuid] = useState(uuid)

  const fetcher = useFetcher();
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) initialRender.current = false
    else {
      fetcher.submit(
        {
          uuid: statefulUuid,
          content: statefulContent,
          title: statefulTitle,
          articleUuid,
          order: String(order),
          sectionUuid: sectionUuid || ''
        },
        { method: "post" })
    }
  }, [statefulTitle, statefulContent])

  useEffect(() => {
    if (fetcher.data?.uuid) {
      setStatefulUuid(fetcher.data?.uuid)
      setSectionUuid?.(
        { uuid: fetcher.data.uuid, content: statefulContent, title: statefulTitle },
      )
    }
  }, [fetcher.data?.uuid])

  return (
    <div>
      <input className='text-xxl mb-m block w-full border border-darkGrey px-xs rounded rounded-m section-title' type="text" defaultValue={title} onBlur={(e) => {
        setStatefulTitle(e.target.value)
      }} />
      {withContent && <Section onBlur={setStatefulContent}
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

  const [statefulUuid, setStatefulUuid] = useState(uuid || '')

  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.data?.uuid) {
      setStatefulUuid(fetcher.data?.uuid)
    }
  }, [fetcher.data?.uuid])

  function updateInfo() {
    if (titleRef.current?.value && descriptionRef.current?.value) {
      fetcher.submit(
        {
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          uuid: statefulUuid,
          articleUuid,
        },
        { method: "post", action: '/information' }
      )
    }
  }

  return (
    <div className='w-[200px] border border-darkGrey rounded rounded-m p-s mr-m mb-m' >
      <p className='font-xxs'>title</p>
      <input className='w-full px-xs border mb-s border-darkGrey information-title' defaultValue={title} type="text" ref={titleRef} onBlur={() => { updateInfo() }} />
      <p className='font-xxs'>description</p>
      <input className='w-full px-xs border border-darkGrey information-description' defaultValue={description} type="text" ref={descriptionRef} onBlur={() => { updateInfo() }} />
    </div>
  )
}

const EMPTY_SECTION = { content: '', uuid: '', title: '', images: [] as Image[], createdAt: new Date(), updatedAt: new Date() }

interface ImageEditorProps {
  url: string
  uuid: string
  description: string
  sectionUuid: string
  setImageUuid: ({ uuid, description, url }: { uuid: string, description: string, url: string }) => void
}
function ImageEditor({ url, uuid, description, sectionUuid, setImageUuid }: ImageEditorProps) {
  const fetcher = useFetcher()
  const updatedUuid = useRef(uuid)
  const urlRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const [statefulUrl, setStatefulUrl] = useState(url)

  function updateImage() {
    const newUrl = urlRef.current?.value
    const newDescription = descriptionRef.current?.value

    if (newUrl && newDescription) {
      fetcher.submit(
        {
          url: newUrl,
          uuid: updatedUuid.current || uuid,
          description: newDescription,
          sectionUuid
        },
        {
          method: "post",
          action: "/image"
        }
      )
    }
  }

  useEffect(() => {
    if (fetcher.data?.uuid) {
      updatedUuid.current = fetcher.data.uuid
      setImageUuid({ uuid: updatedUuid.current, description: descriptionRef.current!.value, url: urlRef.current!.value })
    }
  }, [fetcher.data?.uuid])

  return (
    <div>
      <img className='object-contain m-auto max-w-[128px] max-h-[128px] image-preview' src={statefulUrl} alt={description} />
      <input className="image-title" type="text" defaultValue={url} onBlur={updateImage} onChange={e => { setStatefulUrl(e.target.value) }} ref={urlRef} />
      <input className="image-description" type="text" defaultValue={description} onBlur={updateImage} ref={descriptionRef} />
    </div>
  )
}

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

  function addIntroImage({ sectionUuid }: { sectionUuid: string }) {
    setIntro((oldIntro) => {
      return produce(oldIntro, draft => {
        draft.images.push({
          uuid: '',
          url: '',
          // @ts-ignore
          fakeUuid: uuidv4(),
          description: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          sectionUuid,
          articleUuid: null
        })
      })
    })
  }

  function addSubSectionImage({ sectionUuid, sectionIndex, subsectionIndex }: { sectionUuid: string, sectionIndex: number, subsectionIndex: number }) {
    setSections((oldSections) => {
      return produce(oldSections, draft => {
        draft[sectionIndex].subSections[subsectionIndex].images.push({
          uuid: '',
          url: '',
          // @ts-ignore
          fakeUuid: uuidv4(),
          description: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          sectionUuid,
          articleUuid: null
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

  function setIntroImageUuid({ uuid, description, url, imageIndex }: { uuid: string, description: string, url: string, imageIndex: number }) {
    setIntro(oldSections => {
      return produce(oldSections, draft => {
        draft.images[imageIndex].uuid = uuid
        draft.images[imageIndex].description = description
        draft.images[imageIndex].url = url
      })
    })
  }

  function setSubsectionImageUuid({ uuid, description, url, imageIndex, sectionIndex, subsectionIndex }: { uuid: string, description: string, url: string, imageIndex: number, sectionIndex: number, subsectionIndex: number }) {
    setSections(oldSections => {
      return produce(oldSections, draft => {
        const image = draft[sectionIndex].subSections[subsectionIndex].images[imageIndex]
        image.uuid = uuid
        image.description = description
        image.url = url
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

  function setSubSectionUuid({ uuid, content, title, sectionIndex, subSectionIndex }: { uuid: string, content: string, title: string, sectionIndex: number, subSectionIndex: number }) {
    setSections(oldSections => {
      return produce(oldSections, draft => {
        const subSection = draft[sectionIndex].subSections[subSectionIndex]
        subSection.uuid = uuid
        subSection.content = content
        subSection.title = title
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
        <div className='flex flex-wrap mt-m items-center'>
          {/* @ts-ignore */}
          {informations.map(({ title, description, uuid, fakeUuid }) => (
            <Information key={fakeUuid || uuid} uuid={uuid} articleUuid={data.article?.uuid || ''} title={title} description={description} />
          ))}
          <button className='rounded rounded-m border border-darkGrey flex items-center px-m py-s mb-m hover:bg-lightGrey' onClick={addInformation}>
            <PlusIcon className='w-l h-l mr-s' />
            Add Information
          </button>
        </div>
        <div className='flex p-s'>
          {/* @ts-ignore */}
          {intro.images.map(({ uuid, url, description, fakeUuid }, imageIndex) => (
            <ImageEditor
              key={fakeUuid || uuid}
              url={url}
              description={description}
              uuid={uuid}
              sectionUuid={intro.uuid}
              setImageUuid={
                ({ uuid, description, url }) => {
                  setIntroImageUuid({ uuid, description, url, imageIndex })
                }
              }
            />
          ))}
          <button onClick={() => { addIntroImage({ sectionUuid: intro.uuid }) }}>Add image</button>
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
              {section.subSections.map((subSection, subsectionIndex) => (
                // @ts-ignore
                <div key={subSection.fakeUuid || subSection.uuid}>
                  <div className='mb-l' >
                    <FullSection
                      uuid={subSection.uuid || ''}
                      content={subSection.content || ''}
                      title={subSection.title || ''}
                      articleUuid=""
                      order={subSection.order}
                      withContent
                      sectionUuid={section.uuid}
                      setSectionUuid={
                        ({ uuid, content, title }: { uuid: string, content: string, title: string }) => { setSubSectionUuid({ uuid, content, title, sectionIndex, subSectionIndex: subsectionIndex }) }
                      }
                    />
                  </div>
                  <div className='flex mt-m p-s'>
                    {/* @ts-ignore */}
                    {subSection.images.map(({ uuid, url, description, fakeUuid }, imageIndex) => (
                      <ImageEditor
                        key={fakeUuid || uuid}
                        url={url}
                        description={description}
                        uuid={uuid}
                        sectionUuid={subSection.uuid}
                        setImageUuid={
                          ({ uuid, description, url }) => {
                            setSubsectionImageUuid({ uuid, description, url, imageIndex, sectionIndex, subsectionIndex })
                          }
                        }
                      />
                    ))}
                    <button onClick={() => { addSubSectionImage({ sectionUuid: subSection.uuid, sectionIndex, subsectionIndex }) }}>Add image</button>
                  </div>
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