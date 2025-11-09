export interface CommentItemProps {
  commentId: number;
  content: string;
  nickName: string;
  profileUrl: string;
  createdAt: string;
  isOwner: boolean;
  onDelete?: (commentId: number) => void;
}

export interface CommentInputProps {
  nickName: string;
  profileUrl?: string;
  onSubmit?: (content: string) => void;
}
