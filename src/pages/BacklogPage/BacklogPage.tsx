import React, { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import BacklogSection from './BacklogSection/BacklogSection';
import UserTaskFilter from '../../components/UserTaskFilter/UserTaskFilter';
import styles from './BacklogPage.module.scss';
import {
  filterBacklog,
  getBacklog,
  updateBacklogOrder,
  updateTask
} from '../../api/backlog/backlog';
import { getStatuses } from '../../api/status/status';
import { getUsers } from '../../api/user/user';
import SprintSection from './SprintSection/SprintSection';
import Loading from '../../components/Loading/Loading';
import ProjectNavigationV3 from '../../lib/ProjectNavigationV3/ProjectNavigationV3';
import SearchForBoard from '../../components/SearchForBoard/SearchForBoard';
import TaskTypeFilter from '../../components/TaskTypeFilter/TaskTypeFilter';
import TaskLabelFilter from '../../components/TaskLabelFilter/TaskLabelFilter';
import { LabelsProvider } from '../../context/LabelProvider';
import { ITypes, ILabelData } from '../../types';
import { convertFilterArrayToString } from '../../utils/helpers';
import { TasksByProjectProvider } from '../../context/TasksByProjectProvider';

export default function BacklogPage() {
  const [loaded, setLoaded] = useState(false);
  const [backlogData, setBacklogData] = useState<any>({});
  const [sprintData, setSprintData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState([]);
  const { projectId = '', boardId = '' } = useParams();
  const [selectedTypes, setSelectedTypes] = useState<ITypes[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<ILabelData[]>([]);
  const [userList, setUserList] = useState<any>([]);
  const [projectDataLoaded, setProjectDataLoaded] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [inputState, setInputState] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const page = 'backlog';

  const changeSelectedItems = (isExist, selectedItems, item) => {
    if (!isExist) {
      return [...selectedItems, item];
    }
    return selectedItems.filter((selectedItem) => selectedItem.id !== item.id);
  };

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) {
      const inputCase = inputQuery;
      const userCase = convertFilterArrayToString(selectedUsers);
      const typeCase = convertFilterArrayToString(selectedTypes);
      const labelCase = convertFilterArrayToString(selectedLabels);
      const filterBacklogData = async () => {
        const res = await filterBacklog(projectId, inputCase, userCase, typeCase, labelCase);
        setBacklogData(res.backlog);
        setSprintData(res.sprints);
      };
      filterBacklogData();
    }
    return () => {
      effectRan.current = true;
    };
  }, [inputQuery, projectId, selectedTypes, selectedUsers, selectedLabels]);

  const getBacklogDataApi = useCallback(() => {
    const getBacklogData = async () => {
      try {
        const res = await getBacklog(projectId);
        setBacklogData(res.backlog);
        setSprintData(res.sprints);
        setLoaded(true);
      } catch (e) {
        setLoaded(false);
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      }
    };
    getBacklogData();
  }, [projectId]);

  const getProjectDataApi = useCallback(() => {
    const getProjectData = async () => {
      try {
        let res = await getStatuses(boardId);
        setStatusData(res);
        res = await getUsers();
        setUserList(res.data);
        setProjectDataLoaded(true);
      } catch (e) {
        setProjectDataLoaded(false);
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      }
    };
    getProjectData();
  }, [boardId]);

  useEffect(() => {
    getBacklogDataApi();
    getProjectDataApi();
  }, [getBacklogDataApi, getProjectDataApi]);

  const finishLoading = loaded && projectDataLoaded;

  const updateTaskSprintIdApi = (id: string, sprintId: string | null) => {
    const data = { sprintId };
    updateTask(id, data);
  };

  const onDragEventHandler = (result: DropResult) => {
    const { destination, source } = result;
    const destinationData = { sprintId: null, data: [] };
    const originData = { sprintId: null, data: [] };
    let currentItem: any = null;
    const updatedBacklogData = { ...backlogData };
    const updatedSprintData = [...sprintData];
    if (source?.droppableId === 'backlog') {
      [currentItem] = updatedBacklogData.cards.splice(source?.index, 1);
      originData.data = updatedBacklogData.cards.map((task) => task.id);
    } else {
      updatedSprintData.forEach((sprint) => {
        if (sprint.id === source?.droppableId) {
          [currentItem] = sprint.taskId.splice(source?.index, 1);
          originData.sprintId = sprint.id;
          originData.data = sprint.taskId.map((task) => task.id);
        }
      });
    }
    if (currentItem) {
      if (destination?.droppableId === 'backlog') {
        currentItem.sprintId = null;
        updatedBacklogData.cards.splice(destination?.index, 0, currentItem);
        destinationData.data = updatedBacklogData.cards.map((task) => task.id);
      } else {
        currentItem.sprintId = destination?.droppableId ?? null;
        updatedSprintData.forEach((sprint) => {
          if (sprint.id === destination?.droppableId) {
            sprint.taskId.splice(destination?.index, 0, currentItem);
            destinationData.sprintId = sprint.id;
            destinationData.data = sprint.taskId.map((task) => task.id);
          }
        });
      }
    }
    if (destination?.droppableId !== source?.droppableId && currentItem) {
      if (destination?.droppableId === 'backlog') {
        updateTaskSprintIdApi(currentItem.id, null);
      } else {
        updateTaskSprintIdApi(currentItem.id, destination?.droppableId ?? null);
      }
    }
    updateBacklogOrder(projectId, { origin: originData, destination: destinationData });
    setBacklogData(updatedBacklogData);
    setSprintData(updatedSprintData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header} data-testid="backlog-header">
        Backlog
      </h1>
      <ProjectNavigationV3 />
      {!finishLoading && <Loading />}
      <div className={styles.scrollContainer}>
        <DragDropContext
          onDragEnd={(result) => {
            onDragEventHandler(result);
          }}
        >
          {finishLoading && (
            <TasksByProjectProvider projectId={projectId} backlogData={backlogData}>
              <div className={styles.BacklogSearchFilter}>
                <div className={styles.BacklogSearchArea}>
                  <SearchForBoard
                    inputState={inputState}
                    setInputQuery={setInputQuery}
                    setInputState={setInputState}
                    page={page}
                  />
                </div>
                <UserTaskFilter
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                  changeSelectedUsers={changeSelectedItems}
                  userList={userList}
                />
                <TaskTypeFilter
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  changeSelectedTypes={changeSelectedItems}
                />
                <LabelsProvider>
                  <TaskLabelFilter
                    selectedLabels={selectedLabels}
                    setSelectedLabels={setSelectedLabels}
                  />
                </LabelsProvider>
              </div>
              {sprintData
                .filter((sprint: any) => {
                  return !sprint.isComplete;
                })
                .map((sprint: any) => {
                  return (
                    <React.Fragment key={sprint.id}>
                      <SprintSection
                        sprint={sprint}
                        sprintData={sprintData}
                        getBacklogDataApi={getBacklogDataApi}
                        statusData={statusData}
                        userList={userList}
                      />
                    </React.Fragment>
                  );
                })}
              <BacklogSection
                backlogData={backlogData}
                sprintData={sprintData}
                getBacklogDataApi={getBacklogDataApi}
                statusData={statusData}
                userList={userList}
              />
            </TasksByProjectProvider>
          )}
        </DragDropContext>
      </div>
    </div>
  );
}
