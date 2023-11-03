import axios from 'axios';

import config from '../../config/config';
import { IResetPasswordForm } from '../../types';

export function resetPasswordApply(resetPasswordForm: IResetPasswordForm) {
  return axios.post(`${config.apiAddress}/reset-password`, { ...resetPasswordForm });
}

export function getResetPasswordApplication(token: string) {
  return axios.get(`${config.apiAddress}/change-password/${token}`);
}

export function setPassword(token: string, password: string) {
  return axios.put(`${config.apiAddress}/change-password/${token}`, { password });
}
