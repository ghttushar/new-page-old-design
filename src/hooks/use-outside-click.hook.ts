import { useEffect } from 'react';
interface IOutsideClickProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleClose: () => void;
}
export const useOutsideClick = ({
  containerRef,
  handleClose,
}: IOutsideClickProps) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!containerRef.current) return;

      const clickedInsidePopup = containerRef.current.contains(target);

      const clickedInsideMuiMenu =
        !!target.closest('[role="menu"]') ||
        !!target.closest('[role="listbox"]');

      if (!clickedInsidePopup && !clickedInsideMuiMenu) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
