export interface Post {
  postId: number;
  title: string;
  creator: string;
  createdAt: string;
}

export interface PostsResponse {
  postCount: number;
  myPosts: Post[];
}
