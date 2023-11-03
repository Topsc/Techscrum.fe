import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import config from '../config/config';

const TaskTypesContext = createContext<any>({});

interface IRolesProvider {
  children?: React.ReactNode;
}

function TaskTypesProvider({ children }: IRolesProvider) {
  const [taskTypes, setTaskTypes] = useState<any>([]);

  const getTypes = async () => {
    const path = `${config.apiAddress}/types`;
    const res = await axios.get(path);
    setTaskTypes(res.data);
  };

  useEffect(() => {
    getTypes();
  }, []);

  return <TaskTypesContext.Provider value={taskTypes}>{children}</TaskTypesContext.Provider>;
}

TaskTypesProvider.defaultProps = {
  children: null
};

export { TaskTypesContext, TaskTypesProvider };
