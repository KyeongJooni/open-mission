import { tv } from 'tailwind-variants';

export const signupFormStyles = tv({
  slots: {
    container: 'flex w-full flex-col items-center self-stretch',
    spacer: 'w-full max-w-content',
    profileSection: 'flex w-full max-w-content flex-col items-start justify-center gap-4 py-3 px-4',
    sectionTitle: 'flex items-center justify-center gap-2.5 self-stretch px-1.5',
    profileContent: 'flex flex-col items-start justify-center gap-4',
    profileImage: 'flex h-[90px] w-[90px] items-center gap-2.5 aspect-square rounded-full overflow-hidden',
    image: 'h-full w-full object-cover',
    textareaCommon: 'w-full max-w-content px-0',
    buttonWrapper: 'flex w-full max-w-content items-start gap-2.5 px-4',
    kakaoEmailField: 'flex w-full max-w-content flex-col items-start gap-2 py-3 px-4',
    kakaoEmailTitle: 'text-sm font-light text-gray-56',
    kakaoEmailBox:
      'flex w-full items-center gap-2 rounded px-4 py-3 border border-gray-90 bg-gray-90 text-sm text-gray-56',
  },
});

export type SignupFormStyles = ReturnType<typeof signupFormStyles>;
