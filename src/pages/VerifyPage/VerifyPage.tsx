import React from 'react';
import styles from './VerifyPage.module.scss';
import VerifyPageBackground from './VerifyPageBackground/VerifyPageBackground';
import VerifyPageMain from './VerifyPageMain/VerifyPageMain';

export default function VerifyPage() {
  return (
    <div className={styles.registerContainer}>
      <VerifyPageBackground>
        <VerifyPageMain />
      </VerifyPageBackground>
    </div>
  );
}
