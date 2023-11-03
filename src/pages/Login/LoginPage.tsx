import React from 'react';
import VerifyPageBackground from '../VerifyPage/VerifyPageBackground/VerifyPageBackground';
import styles from './LoginPage.module.scss';
import LoginMain from './LoginMain/LoginMain';

export default function LoginPage() {
  return (
    <div className={styles.registerContainer}>
      <VerifyPageBackground>
        <LoginMain />
      </VerifyPageBackground>
    </div>
  );
}
