export type PageData = {
  path: string;
  id: string;
  content: string;
  tags: string[];
  title: string;
  createTime: number;
  updateTime: number;
  draft: boolean
  cover?: {
    src: string;
    alt?: string
  }
};

export type EnPageData = { pageData: (PageData & { intro: string; html: string })[]; tags: string[] };

export type ShortPageData = Omit<PageData, 'content'> & { intro: string }