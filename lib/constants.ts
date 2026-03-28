import { TagInfo, SeriesInfo } from './types';

// Tag mapping (Notion English key -> display label + color)
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
    emoji: '⚙️',
    color: { from: '#71717a', to: '#52525b' },
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
    emoji: '♾️',
    color: { from: '#0ea5e9', to: '#0284c7' },
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
    emoji: '🛢️',
    color: { from: '#b45309', to: '#92400e' },
  },
  performance: {
    id: 'performance',
    label: '성능최적화',
    emoji: '⚡',
    color: { from: '#eab308', to: '#ca8a04' },
  },
};

// Series mapping (Notion English key -> display label)
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

// Get tag info by ID
export function getTagInfo(tagId: string): TagInfo | undefined {
  return TAG_MAP[tagId];
}

// Get series info by ID
export function getSeriesInfo(seriesId: string): SeriesInfo | undefined {
  return SERIES_MAP[seriesId];
}
