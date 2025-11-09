import { PageHeaderRenderers } from '@/components/common/PageHeader/PageHeaderRightRenderers';
import { PageHeaderRightProps } from '@/types/pageheader';

const PageHeaderRight = ({ type, onEdit, onCancel }: PageHeaderRightProps) => {
  return PageHeaderRenderers[type]({ onEdit, onCancel });
};

export default PageHeaderRight;
