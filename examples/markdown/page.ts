import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

import { BlogCategory, BlogPost, BlogPostWithContent, FAQGroup } from '@/types/blog.type';
import { estimateReadingTime } from '@/utils/static/estimateReadingTime';

const getFileContent = (filePath: string) => matter(fs.readFileSync(filePath, 'utf-8'));

export type PostType = 'static' | 'blog';

const markdownToHtml = async (content: string) => {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return result.toString();
};

const toBlogPost = (data: Record<string, unknown>, content: string): BlogPost => {
  const readTime = estimateReadingTime(content);
  const dateValue = data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date);
  const slug = data.slug as string;
  const imageSlug = (data.imageSlug as string) || slug;

  const categories = Array.isArray(data.categories)
    ? (data.categories as BlogCategory[])
    : [data.category as BlogCategory]; // read-support for legacy single `category`

  return {
    slug,
    imageSlug,
    title: data.title as string,
    description: data.description as string,
    bannerImage: `/images/blog/${imageSlug}/banner.webp`,
    cardImage: `/images/blog/${imageSlug}/card.webp`,
    date: dateValue,
    readTime: `${readTime} min`,
    categories,
    featured: data.featured as boolean,
    author: data.author as BlogPost['author'],
  };
};

export const getPage = async (locale: string, postType: PostType, fileName: string): Promise<string | null> => {
  const filePath = path.join(process.cwd(), `src/files/${postType}`, locale, `${fileName}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return markdownToHtml(fs.readFileSync(filePath, 'utf-8'));
};

export const getBlogPosts = (locale: string): BlogPost[] => {
  const blogDir = path.join(process.cwd(), 'src/files/blog', locale);

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

  const posts = files.map(file => {
    const { data, content } = getFileContent(path.join(blogDir, file));

    return toBlogPost(data, content);
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFeaturedBlogPosts = (locale: string): BlogPost[] => getBlogPosts(locale).filter(post => post.featured);

export const getBlogPostsByCategory = (locale: string, category: BlogCategory): BlogPost[] =>
  getBlogPosts(locale).filter(post => post.categories.includes(category) && !post.featured);

export const getOtherBlogPosts = (locale: string, excludeSlug: string): BlogPost[] =>
  getBlogPosts(locale).filter(post => post.slug !== excludeSlug);

export const getBlogPost = async (locale: string, slug: string): Promise<BlogPostWithContent | null> => {
  const blogDir = path.join(process.cwd(), 'src/files/blog', locale);

  if (!fs.existsSync(blogDir)) {
    return null;
  }

  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

  // Posts are found by frontmatter slug, NOT filename — locale filenames are translated, slug is shared
  const fileData = files
    .map(file => getFileContent(path.join(blogDir, file)))
    .find(({ data }) => data.slug === slug);

  if (!fileData) {
    return null;
  }

  const { data, content } = fileData;

  return {
    ...toBlogPost(data, content),
    content: await markdownToHtml(content),
  };
};

export const getAllBlogSlugs = (locale: string): string[] => getBlogPosts(locale).map(post => post.slug);

// ── FAQ pages: `# Group` → group, `## Question` → item, body until next heading = answer ──

export const parseFAQMarkdown = async (content: string): Promise<FAQGroup[]> => {
  const lines = content.split('\n');

  type RawQuestion = { title: string; rawContent: string };
  type RawGroup = { title: string; questions: RawQuestion[] };

  const groups: RawGroup[] = [];
  let currentGroup: RawGroup | null = null;
  let currentQuestion: RawQuestion | null = null;
  let buffer: string[] = [];

  const flushQuestion = () => {
    if (currentQuestion && currentGroup) {
      currentQuestion.rawContent = buffer.join('\n').trim();
      currentGroup.questions.push(currentQuestion);
    }
    currentQuestion = null;
    buffer = [];
  };

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      flushQuestion();
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { title: trimmed.substring(2).trim(), questions: [] };

      return;
    }

    if (trimmed.startsWith('## ')) {
      flushQuestion();
      currentQuestion = { title: trimmed.substring(3).trim(), rawContent: '' };

      return;
    }

    if (currentQuestion) buffer.push(line);
  });

  flushQuestion();
  if (currentGroup) groups.push(currentGroup);

  return Promise.all(
    groups.map(async group => ({
      title: group.title,
      questions: await Promise.all(
        group.questions.map(async question => ({
          title: question.title,
          content: await markdownToHtml(question.rawContent),
        }))
      ),
    }))
  );
};

export const getFAQPage = async (locale: string, postType: PostType, fileName: string): Promise<FAQGroup[] | null> => {
  const filePath = path.join(process.cwd(), `src/files/${postType}`, locale, `${fileName}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseFAQMarkdown(fs.readFileSync(filePath, 'utf-8'));
};
