export interface PostDetail {
  postId: number;
  postType: string;
  title: string;
  creator: string;
  content: string;
  postImageApiUrlPrefix: string;
  postImages: string[];
  views: number;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostLikeStatus {
  postLikeStatus: boolean;
}

export interface PostLikeResponse {
  isLiked: boolean;
  likes: number;
}

export interface PostDeleteResponse {
  message: string;
}
