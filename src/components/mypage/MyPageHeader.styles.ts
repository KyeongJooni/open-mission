export const STYLES = {
  profileContent: 'flex flex-col w-full max-w-content py-3 px-4 items-start gap-2.5',
  profileImageWrapper: 'relative flex w-16 h-16 items-center gap-2.5 aspect-square',
  profileImage: 'w-full h-full object-cover rounded-full',
  profileEditIcon: 'absolute right-0 bottom-0 w-6 h-6 flex-shrink-0 z-10',
  profileEditFields: 'flex flex-col w-full max-w-content px-4 items-start',
  textFieldDivider: 'flex px-1.5 justify-center items-center gap-2.5 self-stretch mt-1',
  hintText: 'flex-1 text-gray-78 font-light text-xs leading-[160%]',
  profileActions: 'flex w-full max-w-content py-3 px-4 items-start gap-2.5',
} as const;
