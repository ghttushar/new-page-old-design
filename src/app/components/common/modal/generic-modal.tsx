import React from 'react';
import styles from './modal.module.scss';

interface GenericModalProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  modalPosition: { top: number; left: number };
  onBackdropClick: () => void;
  style?: React.CSSProperties;
}

export const GenericModal: React.FC<GenericModalProps> = ({
  children,
  ...props
}) => {
  const { modalPosition, onBackdropClick, style } = props;
  return (
    <div className={styles.modalBackdrop} onClick={() => onBackdropClick()}>
      <div
        className={styles.modalContainer}
        style={{
          top: modalPosition.top + 'px',
          left: modalPosition.left + 'px',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};
