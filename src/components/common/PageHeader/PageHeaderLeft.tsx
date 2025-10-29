import { ReorderIcon } from '@/assets/icons';

import { Link } from 'react-router-dom';
import { PageHeaderLeftProps } from '@/types/pageheader';

const PageHeaderLeft = ({ onHamburgerClick }: PageHeaderLeftProps) => {
  const handleClick = () => {
    onHamburgerClick?.();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center gap-2.5">
        <button onClick={handleClick} aria-label="메뉴 열기">
          <ReorderIcon />
        </button>
        <Link
          to="/"
          className="flex items-center justify-center px-1.5 py-1.5 text-xl font-normal leading-[140%] text-black"
          style={{ fontFamily: 'Smooch, cursive' }}
        >
          GITLOG
        </Link>
      </div>
    </div>
  );
};

export default PageHeaderLeft;
