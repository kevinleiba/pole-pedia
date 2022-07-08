import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getArticles } from "~/models/article.server";

type LoaderData = {
  articles: Awaited<ReturnType<typeof getArticles>>;
};

export const loader = async () => {
  return json<LoaderData>({
    articles: await getArticles(),
  });
};


export default function Index() {
  const { articles } = useLoaderData() as LoaderData;
  console.log(articles);

  return (
    <div>
      {[articles.map(article => (
        <div key={article.id}>
          <h1>{article.title}</h1>
        </div>)
      )]}
    </div>
  )
}