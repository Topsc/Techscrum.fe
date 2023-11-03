/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import config from '../../config/config';

export const getBoard = async (
  id: string,
  input: string,
  users: string,
  taskTypes: string,
  labels: string
) => {
  let inputSearchCase = input;
  let userSearchCase = users;
  let taskTypeSearchCase = taskTypes;
  let labelSearchCase = labels;
  enum Cases {
    searchAll = 'all'
  }
  if (input === '') {
    inputSearchCase = Cases.searchAll;
  }
  if (users === '') {
    userSearchCase = Cases.searchAll;
  }
  if (taskTypes === '') {
    taskTypeSearchCase = Cases.searchAll;
  }
  if (labels === '') {
    labelSearchCase = Cases.searchAll;
  }
  const path = `${config.apiAddress}/board/${id}/${inputSearchCase}/${userSearchCase}/${taskTypeSearchCase}/${labelSearchCase}`;
  const result = await axios.get(path);
  return result.data;
};
