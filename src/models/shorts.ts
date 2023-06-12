interface Shorts {
  id: number;
  user_id: number;
  title: string;
  category: number;
  likes: number;
  views: number;
  src: string;
  created_at: Date;
}
export type shortsProfile = Shorts;
export type createShortsInput = Omit<Shorts, 'id' | 'created_at' | 'likes' | 'views'>;
