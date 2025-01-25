interface Post {
  postId: number;
  title: string;
  creator: string;
  createdAt: string;
}

interface PostsResponse {
  postCount: number;
  myPosts: Post[];
}
