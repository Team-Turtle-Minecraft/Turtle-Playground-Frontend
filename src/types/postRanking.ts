import { Post, PostType } from "./postList";

export interface PostRankingResponse {
  message: string;
  postImageApiUrlPrefix: string;
  posts: Post[];
}
