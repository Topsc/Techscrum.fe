import axios from 'axios';
import config from '../../config/config';
import { ILabelData } from '../../types';
import { query } from '../../utils/cache';

export function getLabels(projectId: string) {
  return query('labels', () => {
    return axios.get(`${config.apiAddress}/labels/${projectId}`);
  });
}

export function showLabel(projectId: string) {
  return axios.get(`${config.apiAddress}/projects/${projectId}/labels`);
}

export function removeLabel(taskId: string, labelId: string) {
  return axios.delete(`${config.apiAddress}/tasks/${taskId}/labels/${labelId}`);
}

export function createLabel(taskId: string, data: ILabelData) {
  return axios.post(`${config.apiAddress}/tasks/${taskId}/labels`, data);
}

export function deleteLabel(id: string) {
  return axios.delete(`${config.apiAddress}/labels/${id}`);
}
