import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiUser, HiOutlinePencilAlt } from 'react-icons/hi';
import { RiBookOpenLine } from 'react-icons/ri';
import styles from './SubscriptionPage.module.scss';
import SubSettingMenu from '../../lib/SubSettingMenu/SubSettingMenu';
import MainMenuV2 from '../MainMenuV2/MainMenuV2';
import config from '../../config/config';
import { UserContext } from '../../context/UserInfoProvider';
import { paymentButtons } from '../../utils/billingButtons';
import folder from '../../assets/billingFolder.svg';
import { checkIsUserSubscribePlan, fetchBillingOverview } from '../../utils/paymentUtils';
import { formatTimeStamp } from '../../utils/helpers';

export default function SubscriptionPage() {
  type BillOverviewInfo = {
    amount: number;
    planName: string;
    customerEmail: string;
    customerName: string;
    periodStart: string;
    periodEnd: string;
    freeTrialDuration: number;
  };

  type Invoice = {
    id: string;
    stripeInvoiceId: string;
    invoiceNumber: string;
    invoiceURL: string;
    isRefund: boolean;
    __v: number;
  };

  const [billOverviewInfo, setBillOverviewInfo] = useState<BillOverviewInfo | null>(null);
  const [isSubscrbePlan, setIsSubscribePlan] = useState(false);
  const [adminInvoice, setAdminInvoice] = useState<Invoice[]>([]);
  const userInfo = useContext(UserContext);
  const navigate = useNavigate();
  const { id: userId } = userInfo;
  const domainURL = `${window.location.hostname}:${window.location.port}`;

  const {
    amount = 0,
    customerEmail = '',
    customerName = '',
    periodEnd = ''
  } = billOverviewInfo || {};

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchBillingOverview();
      setBillOverviewInfo(res);
    };

    const checkIsUserSubscribe = async () => {
      const res = await checkIsUserSubscribePlan();
      setIsSubscribePlan(res);
    };

    const fetchLatestInvoice = async () => {
      const res = await axios.get(`${config.apiAddress}/payment/info/billingHistory`, {});
      setAdminInvoice(res.data);
    };

    fetchData();
    checkIsUserSubscribe();
    fetchLatestInvoice();
  }, [domainURL, userId]);

  const onHandleChange = () => {
    const url = '/billing/info/detail';
    navigate(url);
  };

  const onChangeToBillingHistory = () => {
    const url = '/billing/info/history';
    navigate(url);
  };

  return (
    <>
      <div className={styles.subscriptionPage}>
        <MainMenuV2 />
        <SubSettingMenu items={paymentButtons} />
        <div className={styles.body}>
          <div className={styles.container}>
            <div className={styles.titleContainer}>
              <div>
                <h1>Billing overview</h1>
              </div>
            </div>
            <div className={styles.boxline1}>
              <div className={styles.box1}>
                <h2>Bill estimate</h2>
                {isSubscrbePlan ? (
                  <div>
                    <div>
                      <span>AUD {amount}.00</span>
                    </div>
                    <div>Next Charge: {formatTimeStamp(periodEnd)}</div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className={styles.box2}>
                <h2>Billing details</h2>
                {isSubscrbePlan ? (
                  <div>
                    <hr />
                    <div>
                      <button type="button" onClick={onHandleChange}>
                        Update payment method
                      </button>
                    </div>
                    <p className={styles.notification}>
                      We accept all major credit/debit cards and PayPal
                    </p>
                  </div>
                ) : (
                  <div>
                    <p>Required when you have a subscription to at least one paid product.</p>
                    <hr />
                    <div>
                      <button>Add payment method</button>
                    </div>
                    <p className={styles.notification}>
                      We accept all major credit/debit cards and PayPal
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.boxline2}>
              <div className={styles.box3}>
                <h2>Billing history</h2>
                <div>
                  {adminInvoice?.length > 0 ? (
                    <>
                      <img src={folder} alt="folder" className={styles.folderImage} />
                      <h2 className={styles.textCenter}>Go to billing history to view invoices</h2>
                      <RiBookOpenLine
                        className={styles.directIcon}
                        size="1.5rem"
                        onClick={onChangeToBillingHistory}
                      />
                    </>
                  ) : (
                    <>
                      <img src={folder} alt="folder" className={styles.folderImage} />
                      <h2 className={styles.textCenter}>You currently have no bills</h2>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.box4}>
                <h2>Billing contacts</h2>
                <div>
                  <HiUser className={styles.userIcon} color="white" fontSize="2.5rem" />
                  <div className={styles.userInfo}>
                    <HiOutlinePencilAlt
                      className={styles.pen}
                      fontSize="1.5rem"
                      onClick={onHandleChange}
                    />

                    <span className={styles.customerName}>{customerName}</span>
                    <span className={styles.customerEmail}>{customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
