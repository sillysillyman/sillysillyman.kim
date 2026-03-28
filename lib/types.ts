// Blog post type fetched from the Notion API
export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'Draft' | 'Published' | 'Archived';
  publishedAt: string;
  tag: string;
  series?: string;
  seriesOrder?: number;
  pinned: boolean;
  thumbnail?: string;
  canonicalUrl?: string;
  readTime?: number; // reading time in minutes
}

// Tag info type
export interface TagInfo {
  id: string;
  label: string;
  emoji: string;
  color: {
    from: string;
    to: string;
  };
}

// Series info type
export interface SeriesInfo {
  id: string;
  label: string;
  emoji: string;
}
