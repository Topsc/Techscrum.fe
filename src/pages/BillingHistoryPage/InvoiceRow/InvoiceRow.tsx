import React from 'react';
import logo from '../../../assets/small-logo.svg';
import styles from './InvoiceRow.module.scss';
import { formatTimeStamp } from '../../../utils/helpers';

interface InvoiceRowProps {
  invoice: any;
}

export default function InvoiceRow(props: InvoiceRowProps) {
  const { invoice } = props;
  const { planName, amount, startDate, endDate, invoiceURL } = invoice;

  return (
    <tr className={styles.tableRow}>
      <td className={styles.product}>
        <img src={logo} alt="logo" className={styles.logoIcon} />
        <span>Techscrum Product</span>
      </td>
      <td>{planName}</td>
      <td>${amount}</td>
      <td>
        {formatTimeStamp(startDate)} - {formatTimeStamp(endDate)}
      </td>
      <td>
        {invoiceURL && (
          <a href={invoiceURL} download className={styles.invoiceBtn}>
            View
          </a>
        )}
      </td>
    </tr>
  );
}
