import axios from 'axios';
import config from '../../config/config';

interface IEmailCheck {
  appName: string;
}

export async function emailCheck(email: string, data: IEmailCheck) {
  const path = `${config.apiAddress}/register/${email}`;
  const result = await axios.post(path, data);
  return result;
}
export async function adminEmailCheck(email: string, data: IEmailCheck) {
  const path = `${config.apiAddress}/admin-register/${email}`;
  const result = await axios.post(path, data);
  return result;
}

export async function emailVerifyCheck(emalToken: string) {
  const path = `${config.apiAddress}/register/${emalToken}`;
  const result = await axios.get(path);
  return result;
}

export async function emailVerifyCheckV2(emalToken: string) {
  const path = `${config.apiAddress}/register/${emalToken}`;
  const result = await axios.get(path);
  return result;
}
