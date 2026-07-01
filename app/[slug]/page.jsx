import { posts, getPost } from '../../content/registry';
import { PostView } from '../../storydeck';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      images: ['/blog/assets/footprintjs-logo.png'],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return <main className="wrap"><h1>Not found</h1></main>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author, url: 'https://github.com/sanjay1909' },
    publisher: { '@type': 'Organization', name: 'footprintjs', url: 'https://footprintjs.github.io/' },
    mainEntityOfPage: `https://footprintjs.github.io/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* per-post deck styles (tokens + keyframes), scoped to .deck-scope — used by the figures + deck */}
      <style dangerouslySetInnerHTML={{ __html: post.deckCssScoped }} />
      <PostView post={post} />
    </>
  );
}
