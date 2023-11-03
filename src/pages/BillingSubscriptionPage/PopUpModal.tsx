import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ButtonV2 from '../../lib/FormV2/ButtonV2/ButtonV2';
import Modal from '../../lib/Modal/Modal';

import styles from './PopUpModal.module.scss';

type Props = {
  user: {
    plan: string;
    endDate: number;
  };
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const isExpired = (timestamp: number): boolean => {
  const date = new Date(timestamp * 1000);
  const currentDate = new Date();
  if (date.getTime() > currentDate.getTime()) return false;
  return true;
};

export default function PopUpModal(props: Props) {
  const { user, setModal } = props;

  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Modal classesName={styles.modal}>
      {!isConfirmed && <p>Request to unsubscribe from TechScrum advanced plan?</p>}
      {isConfirmed && isExpired(user.endDate) && <p>You have successfully unsubscribed</p>}
      {isConfirmed && !isExpired(user.endDate) && (
        <p>
          If you paid by credit or debit card, refunds will be sent to the card-issuing bank within
          three business days of receipt of the cancellation request.
        </p>
      )}

      <div className={styles.modalBtn}>
        {isConfirmed ? (
          <Link to="/" className={styles.linkBtn}>
            <ButtonV2
              text="Back to Home"
              fill
              onClick={() => {
                setModal(false);
              }}
            />
          </Link>
        ) : (
          <>
            <ButtonV2
              text="Yes"
              danger
              onClick={() => {
                setIsConfirmed(true);
                // TODO:
                // add unsubscribe api call here
              }}
            />
            <ButtonV2
              text="Cancel"
              fill
              onClick={() => {
                setModal(false);
              }}
            />
          </>
        )}
      </div>
    </Modal>
  );
}
