// types/community.ts
export interface PostResponse {
  message: string;
  metaData: MetaData;
  posts: Post[];
}

export interface MetaData {
  totalPage: number;
  currentPage: number;
  postImageApiUrlPrefix: string;
}

export interface Post {
  postId: number;
  postType: string;
  title: string;
  creator: string;
  content: string;
  imageName: string;
  views: number;
  likes: number;
  createdAt: string;
}

export type SortType = "latest" | "oldest" | "views" | "likes";
export type PostType = "Free" | "Architecture" | "Item" | "Solution" | "Tip";

export interface FetchPostsParams {
  sortType?: SortType;
  postType?: PostType;
  page?: number;
}
