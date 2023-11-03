/* eslint-disable import/prefer-default-export */

import axios from 'axios';
import config from '../../config/config';

export const createSprint = async (data: object) => {
  const response = await axios.post(`${config.apiAddress}/sprints`, data);
  return response.data;
};

export const updateSprint = async (id: string, data: object) => {
  const response = await axios.put(`${config.apiAddress}/sprints/${id}`, data);
  return response.data;
};

export const deleteSprint = async (id: string) => {
  const response = await axios.delete(`${config.apiAddress}/sprints/${id}`);
  return response.data;
};
