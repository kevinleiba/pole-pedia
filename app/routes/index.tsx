import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getAllArticles } from "~/models/article.server";

type LoaderData = {
  articles: Awaited<ReturnType<typeof getAllArticles>>;
};

export const loader = async () => {
  return json<LoaderData>({
    articles: await getAllArticles(),
  });
};


export default function Index() {
  const { articles } = useLoaderData() as LoaderData;

  return (
    <div>
      {[articles.map(article => (
        <div key={article.uuid}>
          <Link to={`/article/${article.uuid}`} ><h1>{article.sections[0].title}</h1></Link>
        </div>)
      )]}
    </div>
  )
}