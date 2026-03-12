export type PageSizeType = 'A4' | 'A3' | 'A5' | 'A6' | 'Letter' | 'Legal';

export interface PageDimensions {
  widthPx: number
  heightPx: number
  widthMm: number
  heightMm: number
  label: string
}

export const PAGE_SIZES: Record<PageSizeType, PageDimensions> = {
  A4: {
    widthPx: 794,
    heightPx: 1123,
    widthMm: 210,
    heightMm: 297,
    label: 'A4',
  },
  A3: {
    widthPx: 1123,
    heightPx: 1587,
    widthMm: 297,
    heightMm: 420,
    label: 'A3',
  },
  Letter: {
    widthPx: 816,
    heightPx: 1056,
    widthMm: 216,
    heightMm: 279,
    label: 'Letter',
  },
  Legal: {
    widthPx: 816,
    heightPx: 1344,
    widthMm: 216,
    heightMm: 356,
    label: 'Legal',
  },
  A5: {
    widthPx: 559,
    heightPx: 794,
    widthMm: 148,
    heightMm: 210,
    label: 'A5',
  },
  A6: {
    widthPx: 397,
    heightPx: 559,
    widthMm: 105,
    heightMm: 148,
    label: 'A6',
  },
};

export interface MarginConfig {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export const DEFAULT_MARGINS: MarginConfig = {
    top: 96, // 1 inch
    bottom: 96,
    left: 96,
    right: 96,
};
