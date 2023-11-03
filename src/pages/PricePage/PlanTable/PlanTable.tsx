import React from 'react';
import styles from './PlanTable.module.scss';
import PlanTableBody from './PlanTableBody/PlanTableBody';
import PlanTableHeader from './PlanTableHeader/PlanTableHeader';

const plans = {
  content: {
    title: 'Plans',
    content: [
      {
        id: 0,
        plan: 'Free',
        monthly_price: '',
        yearly_price: '$0/mo',
        action: 'Sign Up',
        buy_action: ''
      },
      {
        id: 1,
        plan: 'Advanced',
        monthly_price: '$49/mo',
        yearly_price: '$29/mo',
        action: 'Start Trial',
        buy_action: 'Buy Now'
      },
      {
        id: 2,
        plan: 'Ultra',
        monthly_price: '$149/mo',
        yearly_price: '$59/mo',
        action: 'Start Trial',
        buy_action: 'Buy Now'
      },
      {
        id: 3,
        plan: 'Enterprise',
        monthly_price: '',
        yearly_price: 'Get a Quote',
        action: 'Contact Us',
        buy_action: ''
      }
    ]
  }
};

const accessibility = {
  content: {
    title: 'Accessbility',
    content: [
      {
        id: 0,
        name: 'Web access, desktop or laptop',
        free_check: true,
        advanced_check: true,
        ultra_check: true,
        enterprise_check: true
      },
      {
        id: 1,
        name: 'Smartphone',
        free_check: true,
        advanced_check: true,
        ultra_check: true,
        enterprise_check: true
      },
      {
        id: 2,
        name: 'API Access',
        free_check: false,
        advanced_check: false,
        ultra_check: false,
        enterprise_check: true
      }
    ]
  }
};

const usersPermissions = {
  content: {
    title: 'Users & Permissions',
    content: [
      {
        id: 0,
        name: 'Free users licenses (included in plan)',
        free_check: '1',
        advanced_check: '2',
        ultra_check: '5',
        enterprise_check: '10+'
      },
      {
        id: 1,
        name: 'Maximum number of user licenses',
        free_check: '1',
        advanced_check: '5',
        ultra_check: '9',
        enterprise_check: 'No limit'
      },
      {
        id: 2,
        name: 'Provide customer access',
        free_check: false,
        advanced_check: true,
        ultra_check: true,
        enterprise_check: true
      },
      {
        id: 3,
        name: 'Basic access controls',
        free_check: false,
        advanced_check: true,
        ultra_check: true,
        enterprise_check: true
      },
      {
        id: 4,
        name: 'Give limited or read-only permissions',
        free_check: false,
        advanced_check: true,
        ultra_check: true,
        enterprise_check: true
      },
      {
        id: 5,
        name: 'View user activity',
        free_check: false,
        advanced_check: true,
        ultra_check: true,
        enterprise_check: true
      },
      {
        id: 6,
        name: 'SSO',
        free_check: false,
        advanced_check: false,
        ultra_check: false,
        enterprise_check: true
      }
    ]
  }
};

interface IPlanTableProps {
  isChecked: boolean;
}

function PlanTable(props: IPlanTableProps) {
  const { isChecked } = props;

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <PlanTableHeader plans={plans} isCheck={isChecked} />
        <PlanTableBody accessibility={accessibility} usersPermissions={usersPermissions} />
      </table>
    </div>
  );
}
export default PlanTable;
