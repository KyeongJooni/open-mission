import { useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const PageTransition = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
        prevPathRef.current = location.pathname;
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div
      className={`flex w-full flex-col items-center transition-all duration-200 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <Outlet />
    </div>
  );
};
