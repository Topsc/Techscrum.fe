import React, { useRef, useState, useContext } from 'react';
import { GoPlus } from 'react-icons/go';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Button from '../../../components/Button/Button';
import TaskTypeSelect from '../../../components/Select/TaskTypeSelect/TaskTypeSelect';
import TaskItem from '../TaskItem/TaskItem';
import styles from './BacklogSection.module.scss';
import { addTask } from '../../../api/backlog/backlog';
import { IUserInfo, IStatusBacklog } from '../../../types';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import CreateEditSprint from '../CreateEditSprint/CreateEditSprint';
import { TaskTypesContext } from '../../../context/TaskTypeProvider';

interface IBacklogSection {
  backlogData: any;
  getBacklogDataApi: () => void;
  statusData: IStatusBacklog[];
  userList: IUserInfo[];
  sprintData: any;
}

export default function BacklogSection({
  backlogData,
  getBacklogDataApi,
  statusData,
  userList,
  sprintData
}: IBacklogSection) {
  const [currentTypeOption, setCurrentTypeOption] = useState('story');
  const { boardId = '', projectId = '' } = useParams();
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const createIssueRef = useRef<HTMLInputElement | null>(null);
  const taskTypes = useContext(TaskTypesContext);

  const { visible, setVisible, myRef } = useOutsideAlerter(false);

  const onKeyDownCreateIssue = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (createIssueRef?.current?.value) {
        const data = {
          title: createIssueRef?.current?.value,
          status: 'to do',
          typeId: taskTypes.filter((types) => {
            return types.slug === currentTypeOption;
          })[0].id,
          boardId,
          projectId,
          sprintId: null,
          dueAt: new Date(),
          description: ''
        };
        setCurrentTypeOption('story');
        addTask(data)
          .then(() => {
            getBacklogDataApi();
          })
          .catch(() => {
            toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
          });
      }
      setVisible(false);
    }
  };

  const createSprint = () => {
    setShowCreateSprint(true);
  };

  const calculateShowDropDownTop = () => {
    let totalIncompleteSprint = 0;
    sprintData.forEach((sprint) => {
      if (!sprint.isComplete) {
        totalIncompleteSprint += 1;
      }
    });
    if (totalIncompleteSprint > 3) {
      return true;
    }
    let totalTask = 0;
    sprintData.forEach((sprint) => {
      if (!sprint.isComplete) {
        sprint.taskId.forEach(() => {
          totalTask += 1;
        });
      }
    });
    totalTask += backlogData.cards.length;
    return totalTask > 7;
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h1>Backlog</h1>
          <div className={styles.issueCount}>{backlogData.cards.length} issues</div>
        </div>
        <div className={styles.toolbar}>
          <Button onClick={createSprint}>Create sprint</Button>
          {showCreateSprint && (
            <CreateEditSprint
              type="Create"
              onClickCloseModal={() => {
                setShowCreateSprint(false);
              }}
              getBacklogDataApi={getBacklogDataApi}
            />
          )}
        </div>
      </div>

      <Droppable droppableId="backlog">
        {(provided) => {
          return (
            <div
              /* eslint-disable react/jsx-props-no-spreading */
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {backlogData.cards.map((task, index) => {
                return (
                  <Draggable key={task.id} draggableId={task.id ?? ''} index={index}>
                    {(provided2) => {
                      return (
                        <div
                          ref={provided2.innerRef}
                          {...provided2.dragHandleProps}
                          {...provided2.draggableProps}
                          aria-hidden="true"
                        >
                          <TaskItem
                            task={task}
                            statusData={statusData}
                            userList={userList}
                            sprintData={sprintData}
                            showDropDownOnTop={
                              calculateShowDropDownTop() && index > backlogData.cards.length - 6
                            }
                            getBacklogDataApi={getBacklogDataApi}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
      {visible ? (
        <form>
          <div className={styles.formField} ref={myRef}>
            <TaskTypeSelect
              showDropDownOnTop={calculateShowDropDownTop()}
              setCurrentTypeOption={setCurrentTypeOption}
            />
            <input
              className={styles.input}
              type="text"
              name="newBacklog"
              id="newBacklog"
              data-testid="create-issue-input"
              ref={createIssueRef}
              onKeyDown={onKeyDownCreateIssue}
            />
          </div>
        </form>
      ) : (
        <Button icon={<GoPlus />} overrideStyle={styles.buttonRow} onClick={() => setVisible(true)}>
          <p data-testid="create-issue">Create issue</p>
        </Button>
      )}
    </section>
  );
}
