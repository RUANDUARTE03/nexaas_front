import { useEffect, useState } from 'react';

export default function useWindowSize(): ApplicationWindow.Size {
  const [windowSize, setWindowSize] =
    useState<ApplicationWindow.Size>({
      width: undefined,
      height: undefined,
    });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
