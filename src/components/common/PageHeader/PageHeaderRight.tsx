import { PageHeaderRenderers } from '@/components/common/PageHeader/PageHeaderRightRenderers';
import { PageHeaderRightProps } from '@/types/pageheader';

const PageHeaderRight = ({ type, onEdit, onCancel, isOwner }: PageHeaderRightProps) => {
  return PageHeaderRenderers[type]({ onEdit, onCancel, isOwner });
};

export default PageHeaderRight;
