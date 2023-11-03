import React from 'react';
import styles from './ResetPasswordResult.module.scss';
import Error from '../../../../assets/error.png';
import Email from '../../../../assets/email.png';

interface Props {
  successFlag: boolean;
}

export default function ResetPasswordResult({ successFlag }: Props) {
  return (
    <div className={styles.resetPasswordResultContainer}>
      {successFlag ? (
        <>
          <img src={Email} alt="Email Icon" />
          <h1>Your verifyEmail has been sent to your email, please check about it</h1>
        </>
      ) : (
        <>
          <img src={Error} alt="Email Icon" />
          <h1>Something went wrong, please try again</h1>
        </>
      )}
    </div>
  );
}
