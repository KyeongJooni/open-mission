import profileImage from '@/assets/profile.png';
import { cn } from '@/utils/cn';
import { MiddleDotIcon } from '@/assets/icons';
import { postDetailsStyles } from '@/components/blog/Post/PostDetails.styles';
import { formatCommentDate } from '@/utils/date';
import { BLOG_TEXTS } from '@/constants/blog.constants';

interface PostDetailsProps {
  className?: string;
  nickName: string;
  profileUrl?: string;
  createdAt: string;
  commentCount: number;
}

const PostDetails = ({ className, nickName, profileUrl, createdAt, commentCount }: PostDetailsProps) => {
  return (
    <div className={cn(postDetailsStyles.container, className)}>
      <div className={postDetailsStyles.profileContainer}>
        <div className={postDetailsStyles.userInfo}>
          <div className={postDetailsStyles.profileAndNickname}>
            <div
              className={postDetailsStyles.profileImage}
              style={{
                backgroundImage: `url(${profileUrl || profileImage})`,
                backgroundColor: 'lightgray',
              }}
            />
            <span className={postDetailsStyles.nickname}>{nickName}</span>
          </div>
          <div className={postDetailsStyles.middleDot}>
            <MiddleDotIcon />
          </div>
          <span className={postDetailsStyles.metaText}>{formatCommentDate(createdAt)}</span>
          <div className={postDetailsStyles.middleDot}>
            <MiddleDotIcon />
          </div>
          <span className={postDetailsStyles.metaText}>
            {BLOG_TEXTS.POST_DETAILS.COMMENT_LABEL}
            {commentCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
