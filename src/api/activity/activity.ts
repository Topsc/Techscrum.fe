import axios from 'axios';
import config from '../../config/config';

export function getActivity(taskId = '') {
  return axios.get(`${config.apiAddress}/activities/${taskId}`);
}

export function createActivity(data: {
  operation: string;
  userId: string | undefined;
  taskId: string | undefined;
}) {
  return axios.post(`${config.apiAddress}/activities`, data);
}

export function deleteActivity(taskId = '') {
  return axios.delete(`${config.apiAddress}/activities/${taskId}`);
}
