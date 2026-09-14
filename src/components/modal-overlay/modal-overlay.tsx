import styles from './modal-overlay.module.css';

type TModalOverlay = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: TModalOverlay): React.JSX.Element => {
  return <div onClick={onClose} className={styles.modalOverlay} tabIndex={0}></div>;
};
