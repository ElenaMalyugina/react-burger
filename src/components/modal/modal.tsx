import { useState } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('root-modal');

type TTModalProps = {
  header: React.JSX.Element | string;
  children?: React.JSX.Element | string;
};

function Modal({ header, children }: TTModalProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = (): void => {
    setIsOpen(false);
  };

  return ReactDOM.createPortal(
    <>
      {isOpen && <ModalOverlay onClose={handleClose} />}
      <dialog className={styles.modalBody} open={isOpen}>
        <div className="modalOverlay" />
        <div className="modal">
          <h3>{header}</h3>
          {children}
        </div>
      </dialog>
    </>,
    modalRoot!
  );
}

export default Modal;
