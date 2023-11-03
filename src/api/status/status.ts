import axios from 'axios';
import config from '../../config/config';

// eslint-disable-next-line import/prefer-default-export
export const getStatuses = async (boardId: string) => {
  const path = `${config.apiAddress}/boards/${boardId}/statuses`;
  const response = await axios.get(path);
  return response.data;
};
