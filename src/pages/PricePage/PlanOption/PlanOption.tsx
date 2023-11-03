import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PlanOption.module.scss';
import { UserContext } from '../../../context/UserInfoProvider';
import { createSubcription } from '../../../utils/paymentUtils';
import config from '../../../config/config';

const plans = {
  content: {
    title: 'Plans',
    content: [
      {
        id: 0,
        plan: 'Free',
        popularity: '',
        description: 'Perfect for individuals or new businesses.',
        monthly_price: '',
        yearly_price: '$0/mo',
        yearly_discount_information: '',
        monthly_discount_information: '',
        action: 'Sign Up',
        buy_action: '',
        includes: [
          '100 entries',
          '1 user license',
          '1 custom field',
          'Help center and email support'
        ],
        note: ''
      },
      {
        id: 1,
        plan: 'Advanced',
        popularity: '',
        description: 'Affordable tools small businesses need to manage their inventory and assets.',
        monthly_price: '$49',
        yearly_price: '$29/mo',
        yearly_discount_information: '$348 billed yearly save $240',
        monthly_discount_information: 'to annual save $240',
        action: 'Start Trial',
        buy_action: 'Buy Now',
        includes: [
          '2,000 entries',
          '2 user licenses',
          '10 custom fields',
          'Help center and email support',
          'Unlimited QR code label generation',
          'In-app barcode scanner'
        ],
        note: 'Offer available to new customers only. Discounted pricing applies only to first year of subscription.'
      },
      {
        id: 2,
        plan: 'Ultra',
        popularity: 'Most Popular',
        description: 'Scalable inventory solution for growing businesses.',
        monthly_price: '$149',
        yearly_price: '$59/mo',
        yearly_discount_information: '$720 billed yearly save $1,080',
        monthly_discount_information: 'to annual save $1,080',
        action: 'Start Trial',
        buy_action: 'Buy Now',
        includes: [
          '10,000 entries',
          '5 user license',
          '25 custom field',
          'Priority email support',
          'Unlimited QR code & barcode label generation,',
          'In-app barcode scanner',
          'Use external/handheld scanners'
        ],
        note: ''
      },
      {
        id: 3,
        plan: 'Enterprise',
        popularity: '',
        description: 'For organizations that need additional security, control, and support.',
        monthly_price: '',
        yearly_price: 'Get a Quote',
        yearly_discount_information: '',
        monthly_discount_information: '',
        action: 'Contact Us',
        buy_action: '',
        includes: [
          'Unlimited entries',
          '10+ user licenses',
          'Unlimited custom fields',
          'Scheduled phone support and custom training',
          'Unlimited QR code & barcode label generation',
          'In-app barcode scanner',
          'Use external/handheld scanners',
          'API Access',
          'SSO'
        ],
        note: ''
      }
    ]
  }
};

interface IPlanOptionProps {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

function PlanOption(props: IPlanOptionProps) {
  const navigate = useNavigate();
  const { isChecked, setIsChecked } = props;
  const { content } = plans;
  const userInfo = useContext(UserContext);
  const { id: userId, email } = userInfo;

  const ADVANCED_ID = 1;
  const ULTRA_ID = 2;
  const ADVANCED_PRICE_IDENTIFIER = 0;
  const ULTRA_PRICE_IDENTIFIER = 1;

  type PlanInfo = {
    isCurrentPlan: boolean;
    productType: string;
  };

  const [isCurrentPlan, setIsCurrentPlan] = useState<PlanInfo>({
    isCurrentPlan: false,
    productType: ''
  });

  const handleClick = () => {
    setIsChecked((ischecked) => !ischecked);
  };

  const handleButtonClick = async (id: number, isFreeTrial: boolean) => {
    if (userId && email) {
      if (id === ADVANCED_ID) {
        createSubcription(userId, ADVANCED_PRICE_IDENTIFIER, isChecked, isFreeTrial);
      }
      if (id === ULTRA_ID) {
        createSubcription(userId, ULTRA_PRICE_IDENTIFIER, isChecked, isFreeTrial);
      }
    } else {
      navigate(`/login`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${config.apiAddress}/payment/check/userCurrentPlan`, {});
      setIsCurrentPlan(res.data);
    };
    fetchData();
  }, [userId]);

  return (
    <div className={styles.group}>
      {content.content.map((plan) => (
        <div key={plan.id} className={styles.card}>
          <h1 className={styles.plan}>
            {plan.plan} {plan.popularity && <span>{plan.popularity}</span>}
          </h1>
          <p className={styles.description}>{plan.description}</p>
          <div className={styles.discount}>
            <div className={styles.price}>
              {plan.yearly_price && !plan.monthly_price && (
                <span className={styles.yearly_price}>{plan.yearly_price}</span>
              )}
              {plan.yearly_price && plan.monthly_price && !isChecked && (
                <>
                  <span className={styles.monthly_price}>{plan.monthly_price}</span>
                  <span className={styles.yearly_price}>{plan.yearly_price}</span>
                </>
              )}
              {plan.monthly_price && isChecked ? (
                <span className={styles.yearly_price}>{plan.monthly_price}</span>
              ) : (
                <></>
              )}
            </div>
            {plan.yearly_discount_information && !isChecked ? (
              <div className={styles.yearly_discount_information}>
                {plan.yearly_discount_information}
              </div>
            ) : (
              plan.monthly_discount_information && (
                <div className={styles.yearly_discount_information}>
                  <button className={styles.switch} onClick={handleClick}>
                    Switch
                  </button>{' '}
                  {plan.monthly_discount_information}
                </div>
              )
            )}
          </div>

          {!isChecked && isCurrentPlan.productType === 'yearly' && plan.id === 1 && (
            <div className={styles.buttons}>
              <h1 className={styles.currentPlan}>Current plan</h1>
            </div>
          )}

          {!isChecked && isCurrentPlan.productType === 'monthly' && plan.id === 1 && (
            <div className={styles.buttons}>
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
            </div>
          )}

          {isChecked && isCurrentPlan.productType === 'monthly' && plan.id === 1 && (
            <div className={styles.buttons}>
              <h1 className={styles.currentPlan}>Current plan</h1>
            </div>
          )}

          {isChecked && isCurrentPlan.productType === 'yearly' && plan.id === 1 && (
            <div className={styles.buttons}>
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
            </div>
          )}

          {plan.id !== 1 && (
            <div className={styles.buttons}>
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
            </div>
          )}

          {plan.id === 1 && !isCurrentPlan.productType && (
            <div className={styles.buttons}>
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
            </div>
          )}

          <div className={styles.service}>
            <h3 className={styles.include}>Includes:</h3>
            <ul className={styles.ul}>
              {plan.includes.map((include) => (
                <li key={include} className={styles.term}>
                  {include}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlanOption;
