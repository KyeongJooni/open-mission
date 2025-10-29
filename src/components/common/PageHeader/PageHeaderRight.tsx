import { PageHeaderRenderers } from '@/components/common/Pageheader/PageHeaderRightRenderers';
import { PageHeaderRightProps } from '@/types/pageheader';

const PageHeaderRight = ({ type, onEdit, onCancel, onSave, isOwner }: PageHeaderRightProps) => {
  return PageHeaderRenderers[type]({ onEdit, onCancel, onSave, isOwner });
};

export default PageHeaderRight;
