/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import config from '../../config/config';

export function upload(data: FormData) {
  return axios.post(`${config.apiAddress}/uploads`, data, {});
}
