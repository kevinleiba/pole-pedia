import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import Section from '~/components/Section';
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



function ArticleEditPage() {
  const data = useLoaderData() as LoaderData;

  const intro = data.article?.sections[0]

  return (
    <div>
      <input type="text" defaultValue={intro?.title} />
      <Section onUpdate={() => { }} content={intro?.content || ''} />
    </div>
  )
}

export default ArticleEditPage