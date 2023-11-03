import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainMenuV2 from '../MainMenuV2/MainMenuV2';
import SubSettingMenu from '../../lib/SubSettingMenu/SubSettingMenu';
import InvoiceRow from './InvoiceRow/InvoiceRow';
import styles from './BillingHistoryPage.module.scss';
import folder from '../../assets/billingFolder.svg';
import { paymentButtons } from '../../utils/billingButtons';
import config from '../../config/config';

export default function BillingHistoryPage() {
  type Invoice = {
    id: string;
    stripeInvoiceId: string;
    invoiceNumber: string;
    invoiceURL: string;
    isRefund: boolean;
    __v: number;
  };
  const [adminInvoice, setAdminInvoice] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchLatestInvoice = async () => {
      const res = await axios.get(`${config.apiAddress}/payment/info/billingHistory`, {});
      setAdminInvoice(res.data);
    };
    fetchLatestInvoice();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <MainMenuV2 />
      <SubSettingMenu items={paymentButtons} />
      <div className={styles.sectionContainer}>
        <h2>Billing history</h2>
        <img src={folder} alt="folder" className={styles.folderImg} />
        {adminInvoice?.length > 0 ? (
          <table>
            <thead className={styles.tableRow}>
              <tr className={styles.tableRow}>
                <th className={styles.tableHeader}>Product</th>
                <th className={styles.tableHeader}>Plan</th>
                <th className={styles.tableHeader}>Amount</th>
                <th className={styles.tableHeader}>Period</th>
                <th className={styles.tableHeader}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {adminInvoice.map((e) => (
                <InvoiceRow invoice={e} key={e.id} />
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className={styles.textCenter}>You currently have no bills</h2>
        )}
      </div>
    </div>
  );
}
