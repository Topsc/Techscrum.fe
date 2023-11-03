import axios from 'axios';
import config, { alphaApi } from '../../config/config';
import { ITaskData } from '../../types';

export function getTasks() {
  return axios.get(`${config.apiAddress}/projects`);
}

export function getTasksByProject(projectId: string) {
  return alphaApi.get(`${config.apiAddress}/tasks/project/${projectId}`);
}

export function showTask(id = '') {
  return axios.get(`${config.apiAddress}/projects/${id}`);
}

export function createTask(data: ITaskData) {
  return axios.post(`${config.apiAddress}/projects`, data);
}

export function deleteTask(id: string) {
  return alphaApi.delete(`${config.apiAddress}/tasks/${id}`);
}

export function deactiveTask(id: string) {
  return alphaApi.put(`${config.apiAddress}/tasks/${id}/toggleActive`);
}

export function createNewTask(data: ITaskData) {
  return alphaApi.post(`${config.apiAddress}/tasks`, data);
}

export function fetchTask(taskId: string) {
  return axios.get(`${config.apiAddress}/tasks/${taskId}`);
}

export function updateTask(taskId: string, data: ITaskData) {
  const copyData = JSON.parse(JSON.stringify(data));
  if (typeof data.assignId !== 'string') {
    copyData.assignId = !data.assignId ? null : data.assignId.id;
  }
  if (typeof data.status !== 'string') {
    copyData.status = data?.status?.id;
  }
  if (typeof data.reporterId !== 'string') {
    copyData.reporterId = data?.reporterId?.id;
  }

  if (typeof data.typeId !== 'string') {
    copyData.typeId = data?.typeId?.id;
  }

  copyData.tags = data.tags.map((item) => {
    return typeof item !== 'string' ? item.id : item;
  });

  return axios.put(`${config.apiAddress}/tasks/${taskId}`, copyData);
}

export function updateTaskStatus(taskId: string, status: string) {
  return axios.put(`${config.apiAddress}/tasks/${taskId}`, { status });
}

export function removeTask(taskId: string) {
  return axios.delete(`${config.apiAddress}/tasks/${taskId}`);
}
