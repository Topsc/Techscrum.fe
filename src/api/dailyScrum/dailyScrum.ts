import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from '../../config/config';
import { IDailyScrumTicket } from '../../types';

const axiosConfig = {
  baseURL: `${config.apiAddress}/projects`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
};

export const http: AxiosInstance = axios.create(axiosConfig);

http.interceptors.response.use(
  (response): IDailyScrumTicket => {
    return response.data ?? response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDailyScrums = (projectId: string, userId: string): Promise<IDailyScrumTicket[]> => {
  return http.get(`/${projectId}/dailyScrums`, {
    params: {
      userId
    }
  });
};

export const createDailyScrum = (
  projectId: string,
  data: {
    // these 3 attributes are supposed to be not nullish; however, apparently the type for taskInfo was not defined properly causing these attributes to be optional. The backend has valiations which check the existence of these data. If the taskInfo type is causing additional problems, plz fix it 1st.
    title?: string;
    userId?: string;
    taskId?: string;
  }
): Promise<AxiosResponse<IDailyScrumTicket>> => {
  return http.post(`/${projectId}/dailyScrums`, data);
};

export const updateDailyScrum = async (
  projectId: string,
  dailyScrumsId: string,
  data: Partial<IDailyScrumTicket>
) => {
  return http.patch(`/${projectId}/dailyScrums/${dailyScrumsId}`, data);
};

export const deleteDailyScrum = async (projectId: string, taskId: string) => {
  return http.delete(`/${projectId}/dailyScrums`, {
    params: {
      taskId
    }
  });
};
