import { TagInfo, SeriesInfo } from './types';

// 태그 맵핑 (Notion 영문 → 화면 한글 + 색상)
export const TAG_MAP: Record<string, TagInfo> = {
  troubleshooting: {
    id: 'troubleshooting',
    label: '트러블슈팅',
    emoji: '🔥',
    color: { from: '#ef4444', to: '#dc2626' },
  },
  retrospective: {
    id: 'retrospective',
    label: '회고',
    emoji: '📝',
    color: { from: '#8b5cf6', to: '#7c3aed' },
  },
  development: {
    id: 'development',
    label: '개발',
    emoji: '💻',
    color: { from: '#3b82f6', to: '#2563eb' },
  },
  infrastructure: {
    id: 'infrastructure',
    label: '인프라',
    emoji: '☁️',
    color: { from: '#06b6d4', to: '#0891b2' },
  },
  algorithm: {
    id: 'algorithm',
    label: '알고리즘',
    emoji: '🧮',
    color: { from: '#10b981', to: '#059669' },
  },
  devops: {
    id: 'devops',
    label: 'DevOps',
    emoji: '⚙️',
    color: { from: '#f59e0b', to: '#d97706' },
  },
  spring: {
    id: 'spring',
    label: 'Spring',
    emoji: '🍃',
    color: { from: '#22c55e', to: '#16a34a' },
  },
  nodejs: {
    id: 'nodejs',
    label: 'Node.js',
    emoji: '🟢',
    color: { from: '#84cc16', to: '#65a30d' },
  },
  database: {
    id: 'database',
    label: '데이터베이스',
    emoji: '🗄️',
    color: { from: '#0ea5e9', to: '#0284c7' },
  },
  collaboration: {
    id: 'collaboration',
    label: '프론트협업',
    emoji: '🤝',
    color: { from: '#ec4899', to: '#db2777' },
  },
  architecture: {
    id: 'architecture',
    label: '아키텍처',
    emoji: '🏗️',
    color: { from: '#a855f7', to: '#9333ea' },
  },
  performance: {
    id: 'performance',
    label: '성능최적화',
    emoji: '⚡',
    color: { from: '#eab308', to: '#ca8a04' },
  },
};

// 시리즈 맵핑 (Notion 영문 → 화면 한글)
export const SERIES_MAP: Record<string, SeriesInfo> = {
  waggle: {
    id: 'waggle',
    label: 'WAGGLE 개발기',
    emoji: '🐝',
  },
  'production-troubleshoot': {
    id: 'production-troubleshoot',
    label: '프로덕션 트러블슈팅',
    emoji: '🔧',
  },
  'aws-infra': {
    id: 'aws-infra',
    label: 'AWS 인프라 구축기',
    emoji: '☁️',
  },
  'algorithm-notes': {
    id: 'algorithm-notes',
    label: '알고리즘 풀이 노트',
    emoji: '📐',
  },
};

// 태그 정보 가져오기
export function getTagInfo(tagId: string): TagInfo | undefined {
  return TAG_MAP[tagId];
}

// 시리즈 정보 가져오기
export function getSeriesInfo(seriesId: string): SeriesInfo | undefined {
  return SERIES_MAP[seriesId];
}
