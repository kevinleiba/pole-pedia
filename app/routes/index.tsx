import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getAllArticles, searchArticles } from "~/models/article.server";
import logo from "~/components/icons/logo.svg";

type LoaderData = {
  articles: Awaited<ReturnType<typeof getAllArticles | typeof searchArticles>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  if (!search) return json<LoaderData>({ articles: await getAllArticles() })
  return json<LoaderData>({ articles: await searchArticles({ search }) })
};


export default function Index() {
  const { articles } = useLoaderData() as LoaderData;

  return (
    <div className="p-xl">
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-xs">Pole Pedia</h1>
        <p className="text-xs mb-xl">Your Encyclopieda</p>
        <img src={logo} className="h-[300px] w-[300px] object-fit" alt="pole pedia logo" />
        <Form method="get" action="/" className="max-w-[717px] w-full mt-xl">
          <input className="border border-darkGrey w-full text-xl px-xs article-search" name="search" type="text" placeholder="Search article..." />
        </Form>
        <div className="mt-xl p-m w-full max-w-[1200px] border border-black">
          <h2 className="mb-m">Latest articles:</h2>
          {articles.map(article => (
            <div key={article.uuid} className="mb-s">
              <Link to={`/article/${article.uuid}`}><h3 className="hover:underline">{article.sections[0].title}</h3></Link>
            </div>)
          )}
        </div>
      </div>
    </div>
  )
}