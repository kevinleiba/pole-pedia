import { LoaderFunction, redirect } from '@remix-run/server-runtime';
import { createArticle } from '~/models/article.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  const article = await createArticle()

  return redirect(`/article/${article.uuid}/edit`)
};
