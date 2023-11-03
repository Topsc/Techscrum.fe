import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import PlanOption from './PlanOption/PlanOption';
import TrialHeading from './TrailHeading/TrailHeading';
import PlanTable from './PlanTable/PlanTable';
import Footer from '../../components/Footer/Footer';
import styles from './PricePage.module.scss';

function PricePage() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.priceBody}>
        <TrialHeading isChecked={isChecked} setIsChecked={setIsChecked} />
        <PlanOption isChecked={isChecked} setIsChecked={setIsChecked} />
        <PlanTable isChecked={isChecked} />
      </div>
      <Footer />
    </div>
  );
}

export default PricePage;
