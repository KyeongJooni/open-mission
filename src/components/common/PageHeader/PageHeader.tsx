import { PageHeaderLeft, PageHeaderRight } from '@/components';
import { PageHeaderProps } from '@/types/pageheader';

const PageHeader = ({ className = '', type, onHamburgerClick, onEdit, onCancel, isOwner }: PageHeaderProps) => {
  return (
    <header className={`page-header-container ${className}`}>
      <PageHeaderLeft onHamburgerClick={onHamburgerClick} />
      <PageHeaderRight type={type} onEdit={onEdit} onCancel={onCancel} isOwner={isOwner} />
    </header>
  );
};

export default PageHeader;
