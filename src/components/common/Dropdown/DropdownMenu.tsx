import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import DropdownMenuList from './DropdownMenuList';
import { DropdownMenuItem, DropdownMenuProps } from './DropdownMenuTypes';

const DropdownMenu = ({
  trigger,
  items,
  className = '',
  menuClassName = '',
  position = 'right',
  ariaLabel = '메뉴',
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={clsx('relative inline-block', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-inherit m-0 inline-flex cursor-pointer items-center border-none bg-transparent p-0"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        {trigger}
      </button>

      {isOpen && (
        <DropdownMenuList
          items={items}
          onItemClick={handleItemClick}
          position={position}
          menuClassName={menuClassName}
        />
      )}
    </div>
  );
};

export default DropdownMenu;
