import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('root-modal');

type TTModalProps = {
  header?: React.JSX.Element | string;
  children?: React.JSX.Element | string;
  handleCloseModal: () => unknown;
};

function Modal({ header, children, handleCloseModal }: TTModalProps): React.JSX.Element {
  const handleEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return (): void => document.removeEventListener('keydown', handleEsc);
  }, []);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={handleCloseModal} />
      <dialog className={styles.modalBody} open={true}>
        <div className="modalOverlay" />
        <div className="modal">
          {header && (
            <h3
              className={`text text_type_main-large modal-header ${styles.modalHeader}`}
            >
              {header}
            </h3>
          )}
          <button
            className={styles.closeButton}
            onClick={handleCloseModal}
            title="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
          {children}
        </div>
      </dialog>
    </>,
    modalRoot!
  );
}

export default Modal;
