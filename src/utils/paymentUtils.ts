import axios from 'axios';
import { createPayment } from '../api/price/price';
import config from '../config/config';

export const createSubcription = async (
  id: string,
  planIdentifier: number,
  paymentMode: boolean,
  isFreeTrial: boolean
) => {
  createPayment({
    planIdentifier,
    userId: id,
    paymentMode,
    isFreeTrial
  });
};

export const fetchBillingOverview = async () => {
  const res = await axios.get(`${config.apiAddress}/payment/info/billingOverview`, {});
  return res.data;
};

export const checkIsUserSubscribePlan = async () => {
  const res = await axios.get(`${config.apiAddress}/payment/check/isUserSubscribePlan`, {});
  return res.data;
};

export const checkIsUserFreeTrial = async () => {
  const res = await axios.get(`${config.apiAddress}/payment/check/isUserFreeTrial`, {});
  return res.data;
};
