import {
  MainTypeHeader,
  DetailTypeHeader,
  WriteTypeHeader,
  MypageTypeHeader,
  EditProfileTypeHeader,
} from '@/components/common/PageHeader/RightRenders';
import { RenderProps } from '@/types/pageheader';

export const PageHeaderRenderers = {
  main: (_props?: RenderProps) => <MainTypeHeader />,
  detail: (_props?: RenderProps) => <DetailTypeHeader />,
  write: (_props?: RenderProps) => <WriteTypeHeader />,
  mypage: (_props?: RenderProps) => <MypageTypeHeader />,
  editprofile: (props?: RenderProps) => <EditProfileTypeHeader {...props} />,
} as const;
