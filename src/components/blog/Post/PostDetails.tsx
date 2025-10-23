import profileImage from '@/assets/profile.png';
import { cn } from '@/utils/cn';
import { MiddleDotIcon } from '@/assets/icons';
import { postDetailsStyles } from '@/components/blog/Post/PostDetails.styles';

interface PostDetailsProps {
  className?: string;
}

const PostDetails = ({ className }: PostDetailsProps) => {
  return (
    <div className={cn(postDetailsStyles.container, className)}>
      <div className={postDetailsStyles.profileContainer}>
        <div className={postDetailsStyles.userInfo}>
          <div className={postDetailsStyles.profileAndNickname}>
            <div
              className={postDetailsStyles.profileImage}
              style={{
                backgroundImage: `url(${profileImage})`,
                backgroundColor: 'lightgray',
              }}
            />
            <span className={postDetailsStyles.nickname}>닉네임</span>
          </div>
          <div className={postDetailsStyles.middleDot}>
            <MiddleDotIcon />
          </div>
          <span className={postDetailsStyles.metaText}>Feb 17. 2025.</span>
          <div className={postDetailsStyles.middleDot}>
            <MiddleDotIcon />
          </div>
          <span className={postDetailsStyles.metaText}>댓글0</span>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
