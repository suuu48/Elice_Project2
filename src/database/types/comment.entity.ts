interface CommentProfile {
    id: number;
    user_id: number;
    post_id: number | null;
    video_id: number| null;
    content: string;
    nickname: string;
    created_at: Date;
}

export type Comment = CommentProfile;
export type createCommentInput = Partial<Omit<CommentProfile, 'id' | 'created_at' | 'nickname'>>;