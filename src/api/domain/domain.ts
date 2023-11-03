/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import config from '../../config/config';

export function getDomains() {
  return axios.get(`${config.apiAddress}/domains`);
}
