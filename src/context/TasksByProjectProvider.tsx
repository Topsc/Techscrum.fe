import React, { createContext, useEffect, useState, useMemo } from 'react';
import { getTasksByProject } from '../api/task/task';
import { IBacklogData } from '../types';

const TasksByProjectContext = createContext<any>({});

interface IProviderProps {
  projectId: string;
  children?: React.ReactNode;
  backlogData?: IBacklogData;
}

function TasksByProjectProvider({ projectId, backlogData, children }: IProviderProps) {
  const [tasks, setTasks] = useState<any>([]);

  const backlogDataMemo = useMemo(() => backlogData, [backlogData]);

  const fetchTasksByProject = async (id: string) => {
    const res = await getTasksByProject(id);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasksByProject(projectId);
  }, [projectId, backlogDataMemo]);

  return <TasksByProjectContext.Provider value={tasks}>{children}</TasksByProjectContext.Provider>;
}

TasksByProjectProvider.defaultProps = {
  children: null,
  backlogData: null
};

export { TasksByProjectContext, TasksByProjectProvider };
