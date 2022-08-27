import { Form, useLoaderData } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction } from '@remix-run/server-runtime';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import Section from '~/components/Section';
import { getArticle } from "~/models/article.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  console.log(formData)

  return null
  // const title = formData.get("title");
  // const slug = formData.get("slug");
  // const markdown = formData.get("markdown");



  // await createPost({ title, slug, markdown });

  // return redirect("/posts/admin");
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

function ArticleEditPage() {
  const [section, setSection] = useState({ uuid: '', content: '', title: '' })

  const formSendBtn = useRef(null)
  const data = useLoaderData() as LoaderData;

  const intro = data.article?.sections[0]

  useEffect(() => {
    if (section.uuid && formSendBtn.current) {
      console.log("????")
      formSendBtn.current.click();
    }
  }, [section.uuid, section.content, section.title])

  return (
    <div>
      <input type="text" defaultValue={intro?.title} onBlur={(e) => {
        setSection({ uuid: intro?.uuid || '', content: intro?.content || '', title: e.target.value })
      }} />
      <Section onBlur={(content) => {
        setSection({ uuid: intro?.uuid || '', content, title: intro?.title || '' })
      }}
        content={intro?.content || ''} />
      <Form method='post'>
        <input readOnly type="text" name="uuid" value={section.uuid} />
        <input readOnly type="text" name="uuid" value={section.content} />
        <input readOnly type="text" name="uuid" value={section.title} />
        <button
          ref={formSendBtn}
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Update Article
        </button>
      </Form>
    </div>
  )
}

export default ArticleEditPage