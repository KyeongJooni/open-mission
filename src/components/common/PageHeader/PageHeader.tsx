import { PageHeaderLeft, PageHeaderRight } from '@/components';
import { PageHeaderProps } from '@/types/pageheader';

const PageHeader = ({ className = '', type, onHamburgerClick, onEdit, onCancel }: PageHeaderProps) => {
  return (
    <header className={`page-header-container ${className}`}>
      <PageHeaderLeft onHamburgerClick={onHamburgerClick} />
      <PageHeaderRight type={type} onEdit={onEdit} onCancel={onCancel} />
    </header>
  );
};

export default PageHeader;
