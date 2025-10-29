import { AddPhotoAlternateIcon, FolderOpenIcon } from '@/assets/icons';
import { Icon } from '@/components';
import clsx from 'clsx';

import { useLocation } from 'react-router-dom';

interface PageHeaderLegacyProps {
  className?: string;
}

const PageHeaderLegacy = ({ className = '' }: PageHeaderLegacyProps) => {
  const location = useLocation();
  const isWritePage = location.pathname === '/blog/write';

  return (
    <div className={clsx('page-header-legacy-container', className)}>
      {!isWritePage && (
        <>
          <div className="flex items-center justify-center gap-1 rounded-[2px] px-2 pb-1 pt-0.5">
            <Icon size="sm" className="text-gray">
              <AddPhotoAlternateIcon />
            </Icon>
            <span className="text-xs font-normal leading-[160%] text-gray">사진 추가하기</span>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-[2px] px-2 pb-1 pt-0.5">
            <Icon size="sm" className="text-gray">
              <FolderOpenIcon />
            </Icon>
            <span className="text-xs font-normal leading-[160%] text-gray">파일 추가하기</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PageHeaderLegacy;
