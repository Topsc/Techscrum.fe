/* eslint-disable consistent-return */
import config, { alphaApi } from '../../config/config';
import { IProjectData } from '../../types';

const getAuthHeader = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export function getProjects() {
  return alphaApi.get(`${config.apiAddress}/projects`);
}

export function showProject(id: string, token: string) {
  return alphaApi.get(`${config.apiAddress}/projects/${id}`, getAuthHeader(token));
}

export function createProject(data: IProjectData) {
  return alphaApi.post(`${config.apiAddress}/projects`, data);
}

export function deleteProject(id: string) {
  return alphaApi.delete(`${config.apiAddress}/projects/${id}`);
}

export function updateProject(id: string, data: IProjectData, token: string) {
  const copyData = JSON.parse(JSON.stringify(data));
  if (typeof data.ownerId !== 'string') {
    copyData.ownerId = !data.ownerId ? null : data.ownerId.id;
  }
  if (typeof data.projectLeadId !== 'string') {
    copyData.projectLeadId = !data.projectLeadId ? null : data.projectLeadId.id;
  }
  return alphaApi.put(`${config.apiAddress}/projects/${id}`, copyData, getAuthHeader(token));
}
