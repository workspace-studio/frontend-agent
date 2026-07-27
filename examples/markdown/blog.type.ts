// Extend the union DELIBERATELY (a new category is a design decision, not a typo)
export type BlogCategory = 'development' | 'design' | 'ai';

export interface BlogPost {
  slug: string;
  imageSlug?: string;
  title: string;
  description: string;
  bannerImage: string;
  cardImage: string;
  date: string;
  readTime: string;
  categories: BlogCategory[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  featured: boolean;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

export interface FAQItem {
  title: string;
  content: string;
}

export interface FAQGroup {
  title: string;
  questions: FAQItem[];
}
