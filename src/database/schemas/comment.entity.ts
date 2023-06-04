interface CommentProfile {
    id: number;
    user_id: number;
    post_id: number;
    video_id: number;
    comment: string;
    nickname: string;
    created_at: Date;
}

export type Comment = CommentProfile;
export type createCommentInput = Omit<CommentProfile, 'id' | 'created_at' | 'nickname'>;