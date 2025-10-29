import {
  MainTypeHeader,
  DetailTypeHeader,
  WriteTypeHeader,
  MypageTypeHeader,
  EditProfileTypeHeader,
} from '@/components/common/Pageheader/RightRenders';
import { RenderProps } from '@/types/pageheader';

export const PageHeaderRenderers = {
  main: (_props?: RenderProps) => <MainTypeHeader />,
  detail: (props?: RenderProps) => <DetailTypeHeader isOwner={props?.isOwner} />,
  write: (_props?: RenderProps) => <WriteTypeHeader />,
  mypage: (_props?: RenderProps) => <MypageTypeHeader />,
  editprofile: (props?: RenderProps) => <EditProfileTypeHeader {...props} />,
} as const;
