import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './PaymentSuccessPage.module.scss';
import paymentSuccess from '../../assets/payment-success.webp';
import { UserContext } from '../../context/UserInfoProvider';
import { fetchBillingOverview } from '../../utils/paymentUtils';
import { formatTimeStamp } from '../../utils/helpers';

export default function PaymentSuccessPage() {
  const userInfo = useContext(UserContext);
  const { id: userId } = userInfo;
  const [billOverviewInfo, setBillOverviewInfo] = useState<BillOverviewInfo | null>(null);

  type BillOverviewInfo = {
    amount: number;
    planName: string;
    customerEmail: string;
    customerName: string;
    periodStart: string;
    periodEnd: string;
    freeTrialDuration: number;
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchBillingOverview();
      setBillOverviewInfo(res);
    };
    fetchData();
  }, [userId]);

  return (
    <div className={styles.sectionContainer}>
      <h2>Payment Success</h2>
      <img src={paymentSuccess} alt="paymentSuccess" className={styles.paymentImg} />
      <div className={styles.contents}>
        <p className={styles.textSecondary}>Hi, admin {billOverviewInfo?.customerName}</p>
        <p>
          Welcome to your {billOverviewInfo?.freeTrialDuration} days free trial of{' '}
          {billOverviewInfo?.planName} subscription! The plan starts from{' '}
          {formatTimeStamp(billOverviewInfo?.periodStart)}.
        </p>
        <p>
          As a member, you can explore, manage, and cancel your subscription at any time by visiting
          plan & billing settings.
        </p>
        <p>Welcome aboard!</p>
        <p className={styles.textSecondary}>The TechScrum Team</p>
      </div>
      <Link className={styles.linkBtn} to="/projects">
        Go Projects
      </Link>
    </div>
  );
}
