import clsx from 'clsx';

import PaginationButton from './PaginationButton';

interface PaginationProps {
  className?: string;
}

const Pagination = ({ className = '' }: PaginationProps) => {
  return (
    <div className={clsx('inline-flex items-start gap-2', className)}>
      <PaginationButton variant="navigation" direction="prev" />

      <PaginationButton variant="page">1</PaginationButton>

      <PaginationButton variant="navigation" direction="next" />
    </div>
  );
};

export default Pagination;
