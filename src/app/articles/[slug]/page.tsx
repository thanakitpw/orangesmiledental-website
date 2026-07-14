import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, listPosts, relatedTo } from '@/lib/articles';
import { mediaUrl } from '@/lib/media';
import { SITE } from '@/content/site';
import { ArticleView } from './ArticleView';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await listPosts()).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `${SITE.url}/articles/${post.slug}`;
  return {
    title: post.th.metaTitle,
    description: post.th.metaDescription,
    keywords: post.th.keywords,
    alternates: { canonical: `/articles/${post.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: post.th.metaTitle,
      description: post.th.metaDescription,
      publishedTime: post.publishedAt,
      images: [{ url: mediaUrl(post.cover), width: 1000, height: 680 }],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), listPosts()]);
  if (!post) notFound();

  const url = `${SITE.url}/articles/${post.slug}`;

  /**
   * Schema.org. The `reviewedBy` block below appears only when `articles.reviewer_name`
   * is actually filled in, and its @type follows `reviewer_type` — a company is not a
   * Person and must never be dressed as one. Claiming a reviewer who does not exist,
   * or a dentist where there is only a clinic, is lying to Google in a machine-readable
   * format, which is the one format it can check against everything else it knows.
   */
  const articleLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url,
    headline: post.th.metaTitle,
    description: post.th.metaDescription,
    image: mediaUrl(post.cover),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: 'th-TH',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: post.authorName, url: SITE.url },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: mediaUrl('assets/media/image4.webp') },
    },
  };

  if (post.reviewer) {
    articleLd['@type'] = 'MedicalWebPage';
    articleLd.reviewedBy =
      post.reviewer.kind === 'organization'
        ? { '@type': 'Organization', name: post.reviewer.name, url: SITE.url }
        : {
            '@type': 'Person',
            name: post.reviewer.name,
            jobTitle: 'Dentist',
            // Emitted only when the clinic supplied a licence — an absent identifier is
            // fine, an invented one is a false claim in machine-readable form.
            ...(post.reviewer.license ? { identifier: post.reviewer.license } : {}),
          };
    articleLd.lastReviewed = post.reviewer.at;
  }

  const faqLd =
    post.th.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.th.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'บทความ', item: `${SITE.url}/articles` },
      { '@type': 'ListItem', position: 3, name: post.th.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ArticleView post={post} related={relatedTo(post, all)} />
    </>
  );
}
