import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getAllArticles, searchArticles } from "~/models/article.server";
import logo from "~/components/icons/logo.svg";
import EditIcon from "~/components/icons/edit";

type LoaderData = {
  articles: Awaited<ReturnType<typeof getAllArticles | typeof searchArticles>>;
  withSearch: boolean
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const searchAll = url.searchParams.get("searchAll") === "true"

  const take = searchAll ? undefined : 10

  if (!search) return json<LoaderData>({ articles: await getAllArticles({ take }), withSearch: searchAll })
  return json<LoaderData>({ articles: await searchArticles({ search }), withSearch: true })
};


export default function Index() {
  const { articles, withSearch } = useLoaderData() as LoaderData;

  return (
    <div className="p-xl">
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-xs">Pole Pedia</h1>
        <p className="text-xs mb-xl">Your Encyclopieda</p>
        <Link to="/"><img src={logo} className="h-[300px] w-[300px] object-fit" alt="pole pedia logo" /></Link>
        <Form method="get" action="/" className="max-w-[717px] w-full mt-xl">
          <input className="border border-darkGrey w-full text-xl px-xs article-search" name="search" type="text" placeholder="Search article..." />
        </Form>
        <div className="mt-xl p-m w-full max-w-[1200px] border border-black">
          <h2 className="mb-m">Latest articles:</h2>
          {articles.map(article => (
            <div key={article.uuid} className="mb-s">
              <Link to={`/article/${article.uuid}`}><h3 className="hover:underline">{article?.sections[0]?.title}</h3></Link>
            </div>)
          )}
          {!withSearch && <Link to="/?searchAll=true"><h2 className="text-center underline">Show all articles</h2></Link>}
        </div>
        <div className="w-full max-w-[1200px] flex justify-end">
          <Link to="/article/new">
            <button
              className='mt-xl rounded rounded-m border border-darkGrey flex items-center px-m py-s hover:bg-lightGrey justify-center bg-white'
            >
              <EditIcon className='w-l h-l mr-s' />
              Create Article
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}