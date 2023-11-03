import React from 'react';
import VerifyPageBackground from '../VerifyPage/VerifyPageBackground/VerifyPageBackground';
import styles from './RegisterPage.module.scss';
import RegisterMain from './RegisterMain/RegisterMain';

export default function RegistePager() {
  return (
    <div className={styles.registerContainer}>
      <VerifyPageBackground>
        <RegisterMain />
      </VerifyPageBackground>
    </div>
  );
}
