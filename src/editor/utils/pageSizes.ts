export type PageSizeType = 'A4' | 'A3' | 'Letter';

export interface PageDimensions {
    width: number; // in pixels at 96 DPI
    height: number;
    label: string;
}

export const PAGE_SIZES: Record<PageSizeType, PageDimensions> = {
    A4: {
        width: 794, // 210mm
        height: 1123, // 297mm
        label: 'A4',
    },
    A3: {
        width: 1123, // 297mm
        height: 1587, // 420mm
        label: 'A3',
    },
    Letter: {
        width: 816, // 8.5in
        height: 1056, // 11in
        label: 'Letter',
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
