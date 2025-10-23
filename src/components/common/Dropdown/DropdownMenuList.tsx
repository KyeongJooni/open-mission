import clsx from 'clsx';

import { DropdownMenuListProps } from './DropdownMenuTypes';

const DropdownMenuList = ({
  items,
  onItemClick,
  position = 'right',
  menuClassName = '',
}: DropdownMenuListProps) => {
  return (
    <div
      className={clsx(
        'absolute top-full z-50 mt-1',
        'inline-flex flex-col items-end',
        'shadow-modal',
        position === 'right' ? 'right-0' : 'left-0',
        menuClassName
      )}
    >
      {/* ?�리�??�살??- �???*/}
      <svg
        className="absolute -top-2 right-4 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="8"
        viewBox="0 0 16 8"
        fill="none"
        style={{
          width: '16px',
          height: '8px',
          zIndex: 20,
        }}
      >
        <path d="M8 -6.99382e-07L16 8L0 8L8 -6.99382e-07Z" fill="white" />
      </svg>

      <div className="flex flex-col items-start justify-center rounded-md bg-white py-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onItemClick(item)}
            disabled={item.disabled}
            className={clsx(
              'flex items-center gap-2.5 text-left',
              'transition-colors duration-150',
              'hover:bg-gray-96',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'first:rounded-t-lg last:rounded-b-lg'
            )}
            style={{
              width: '160px',
              padding: '8px 12px 12px 12px',
            }}
          >
            <span
              className={clsx('flex-1 text-sm font-normal', item.color === 'danger' ? 'text-warning' : 'text-black')}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenuList;
