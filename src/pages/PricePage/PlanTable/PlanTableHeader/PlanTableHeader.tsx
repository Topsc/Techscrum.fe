import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../context/UserInfoProvider';
import { createSubcription } from '../../../../utils/paymentUtils';
import styles from './PlanTableHeader.module.scss';

interface IPlanTableHeaderProps {
  plans: any;
  isCheck: boolean;
}

function PlanTableHeader(props: IPlanTableHeaderProps) {
  const navigate = useNavigate();
  const { plans, isCheck } = props;
  const ADVANCED_ID = 1;
  const ULTRA_ID = 2;
  const userInfo = useContext(UserContext);
  const { id: userId, email } = userInfo;

  const ADVANCED_PRICE_IDENTIFIER = 0;
  const ULTRA_PRICE_IDENTIFIER = 1;

  const handleButtonClick = async (id: number, isFreeTrial: boolean) => {
    if (userId && email) {
      if (id === ADVANCED_ID) {
        createSubcription(userId, ADVANCED_PRICE_IDENTIFIER, isCheck, isFreeTrial);
      }
      if (id === ULTRA_ID) {
        createSubcription(userId, ULTRA_PRICE_IDENTIFIER, isCheck, isFreeTrial);
      }
    } else {
      navigate(`/login`);
    }
  };

  return (
    <>
      <thead className={styles.head}>
        <tr className={styles.plan_tr}>
          <th className={styles.plan_th}>Plans</th>
          {plans.content.content.map((plan) => (
            <th key={plan.id}>
              {plan.plan}
              {plan.yearly_price && plan.monthly_price && !isCheck && (
                <span>{plan.yearly_price}</span>
              )}
              {plan.yearly_price && plan.monthly_price && isCheck && (
                <span>{plan.monthly_price}</span>
              )}
              {plan.yearly_price && !plan.monthly_price && <span>{plan.yearly_price}</span>}

              <button className={styles.action} onClick={() => handleButtonClick(plan.id, true)}>
                {plan.action}
              </button>
              {plan.buy_action && (
                <button
                  className={styles.buy_action}
                  onClick={() => handleButtonClick(plan.id, false)}
                >
                  {plan.buy_action}
                </button>
              )}
            </th>
          ))}
        </tr>
      </thead>
    </>
  );
}

export default PlanTableHeader;
