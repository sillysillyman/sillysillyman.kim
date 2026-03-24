// Notion API에서 가져온 블로그 포스트 타입
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
  readTime?: number; // 읽기 시간 (분)
}

// 태그 정보 타입
export interface TagInfo {
  id: string;
  label: string;
  emoji: string;
  color: {
    from: string;
    to: string;
  };
}

// 시리즈 정보 타입
export interface SeriesInfo {
  id: string;
  label: string;
  emoji: string;
}
