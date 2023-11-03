import React, { useContext, useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import IconButton from '../../../components/Button/IconButton/IconButton';
import styles from './TaskItem.module.scss';
import OptionBtn from '../OptionBtn/OptionBtn';
import { IUserInfo, IStatusBacklog } from '../../../types';
import PriorityBtn from '../PriorityBtn/PriorityBtn';
import StatusBtn from '../StatusBtn/StatusBtn';
import AssigneeBtn from '../AssigneeBtn/AssigneeBtn';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import { updateTask } from '../../../api/backlog/backlog';
import TypeEdit from './TypeEdit';
import { TasksByProjectContext } from '../../../context/TasksByProjectProvider';

interface ITaskInput {
  task: any;
  statusData: IStatusBacklog[];
  userList: IUserInfo[];
  sprintData?: any;
  showDropDownOnTop?: boolean;
  getBacklogDataApi: () => void;
}
export default function TaskItem({
  task,
  statusData,
  userList,
  sprintData,
  showDropDownOnTop,
  getBacklogDataApi
}: ITaskInput) {
  const [title, setTitle] = useState(task.title);
  const [value, setValue] = useState(task.typeId);
  const [taskTicketNum, setTaskTicketNum] = useState();
  const [projectKey, setProjectKey] = useState();

  const tasksByProject = useContext(TasksByProjectContext);

  useEffect(() => {
    setTaskTicketNum(tasksByProject.findIndex((e) => e.id === task.id) + 1);
    setProjectKey(tasksByProject[0]?.projectId.key);
  }, [tasksByProject, task.id]);

  const updateTaskTitleContent = () => {
    if (title.trim() !== task.title) {
      const data = { title: title.trim() };
      updateTask(task.id, data)
        .then(() => {
          getBacklogDataApi();
        })
        .catch(() => {
          toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
        });
    }
  };

  const updateTaskType = async (newTypeId: string) => {
    try {
      const data = { typeId: newTypeId };
      await updateTask(task.id, data);
      getBacklogDataApi();
    } catch (err) {
      toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
    }
  };

  const { visible, setVisible, myRef } = useOutsideAlerter(false);

  const saveKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateTaskTitleContent();
      setVisible(false);
    }
  };

  return (
    <div
      className={styles.container}
      onFocus={() => {}}
      onBlur={() => {}}
      data-testid={`task-hover-${task.id}`}
      data-testid-count="filter-issues"
      ref={myRef}
    >
      <div className={styles.taskInfo}>
        <TypeEdit
          taskId={task.id}
          value={value}
          onChange={(option) => setValue(option)}
          updateTaskType={updateTaskType}
        />
        <div className={styles.taskIdContainer}>
          <p>{`${projectKey}-${String(taskTicketNum).padStart(3, '0')}`}</p>
        </div>
        {visible ? (
          <input
            type="text"
            defaultValue={task.title}
            onKeyDown={saveKeyPress}
            className={styles.taskInput}
            data-testid={'task-title-input-'.concat(task.id)}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        ) : (
          <div className={styles.taskTitle} data-testid={`task-${task.id}`}>
            {task.title}
          </div>
        )}
        {!visible && (
          <div className={styles.editButton}>
            <IconButton
              icon={<FaPen size={10} />}
              taskId={task.id}
              tooltip="Edit"
              onClick={() => {
                setVisible(true);
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.toolBar}>
        <PriorityBtn
          showDropDownOnTop={showDropDownOnTop}
          taskId={task.id}
          priority={task.priority}
          getBacklogDataApi={getBacklogDataApi}
        />
        <StatusBtn
          status={task.status.name.toUpperCase()}
          taskId={task.id}
          statusData={statusData}
          showDropDownOnTop={showDropDownOnTop}
          getBacklogDataApi={getBacklogDataApi}
        />
        <AssigneeBtn
          taskId={task.id}
          assignee={task.assignId}
          userList={userList}
          showDropDownOnTop={showDropDownOnTop}
          getBacklogDataApi={getBacklogDataApi}
        />
        <OptionBtn
          taskId={task.id}
          sprintId={task.sprintId}
          sprintData={sprintData}
          showDropDownOnTop={showDropDownOnTop}
          getBacklogDataApi={getBacklogDataApi}
          className={styles.optionBtn}
        />
      </div>
    </div>
  );
}
TaskItem.defaultProps = {
  showDropDownOnTop: false,
  sprintData: []
};
