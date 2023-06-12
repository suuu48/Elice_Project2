interface PostProfile {
  id: number;
  user_id: number;
  category: number;
  title: string;
  created_at: Date;
  nickname: string;
  views: number;
  content: string;
}

export type Post = PostProfile;
export type createPostInput = Omit<PostProfile, 'id' | 'created_at' | 'views' | 'nickname'>;

export type updatePostInput = Omit<Partial<PostProfile>, 'id' | 'user_id' | 'category' | 'created_at' | 'views' | 'nickname'>;
