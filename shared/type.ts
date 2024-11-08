export type PageData = {
  path: string;
  id: string;
  content: string;
  tags: string[];
  title: string;
  createTime: number;
  updateTime: number;
};

export type EnPageData = { pageData: (PageData & { intro: string; html: string })[]; tags: string[] };

export type ShortPageData = { pageData: Omit<PageData, 'content'>[]; tags: string[] };