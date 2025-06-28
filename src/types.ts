export type Memo = {
  id: number;
  title: string;
  date: string;
  content: string;
};
export type SortField = 'id' | 'title' | 'date';
export type SortOrder = 'asc' | 'desc';
