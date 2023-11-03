import React from 'react';
import VerifyPageBackground from '../VerifyPage/VerifyPageBackground/VerifyPageBackground';
import styles from './LoginPageV2.module.scss';
import LoginMainV2 from './LoginMainV2/LoginMainV2';

export default function LoginPageV2() {
  return (
    <div className={styles.registerContainer}>
      <VerifyPageBackground>
        <LoginMainV2 />
      </VerifyPageBackground>
    </div>
  );
}
