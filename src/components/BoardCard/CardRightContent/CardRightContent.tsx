import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { CgArrowRightR } from 'react-icons/cg';
import { MdOutlineBookmarkBorder } from 'react-icons/md';
import { RiFlag2Line } from 'react-icons/ri';
import { BsPeople } from 'react-icons/bs';
import { AiOutlineCalendar } from 'react-icons/ai';
import { v4 as uuid } from 'uuid';
import {
  IColumnsFromBackend,
  ILabelData,
  IOnChangeProjectLead,
  ITaskEntity,
  ITypes
} from '../../../types';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import style from './CardRightContent.module.scss';
import ReporterFields from './ReporterFields/ReporterFields';
import LabelFields from './LabelFields/LabelFields';
import UserSelect from '../../Form/Select/UserSelect/UserSelect';
import checkAccess from '../../../utils/helpers';
import DueDatePicker from '../../DueDatePicker/DueDatePicker';
import { UserContext } from '../../../context/UserInfoProvider';
import { TaskTypesContext } from '../../../context/TaskTypeProvider';
import { createActivity } from '../../../api/activity/activity';
import { createDailyScrum } from '../../../api/dailyScrum/dailyScrum';

interface Props {
  taskInfo: ITaskEntity;
  columnsInfo: IColumnsFromBackend;
  taskStatusOnchange: (taskInfo: ITaskEntity) => void;
  labels: ILabelData[];
  projectId: string;
  updateTaskTags: (tags: ILabelData[] | undefined) => void;
  onSave: (data: ITaskEntity) => void;
  selectedType: ITypes | null;
  setSelectedType: Dispatch<SetStateAction<ITypes | null>>;
}

export default function CardRightContent({
  columnsInfo,
  taskInfo,
  taskStatusOnchange,
  labels,
  projectId,
  updateTaskTags,
  onSave,
  selectedType,
  setSelectedType
}: Props) {
  const PRIORITY = {
    Highest: 'https://010001.atlassian.net/images/icons/priorities/highest.svg',
    High: 'https://010001.atlassian.net/images/icons/priorities/high.svg',
    Medium: 'https://010001.atlassian.net/images/icons/priorities/medium.svg',
    Low: 'https://010001.atlassian.net/images/icons/priorities/low.svg',
    Lowest: 'https://010001.atlassian.net/images/icons/priorities/lowest.svg'
  };
  const priorityOptions = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
  const {
    visible: visibleSelectStatus,
    setVisible: setVisibleSelectStatus,
    myRef: selectStatusRef
  } = useOutsideAlerter(false);
  const {
    visible: visibleSelectType,
    setVisible: setVisibleSelectType,
    myRef: selectTypeRef
  } = useOutsideAlerter(false);
  const {
    visible: visibleSelectPriority,
    setVisible: setVisibleSelectPriority,
    myRef: selectPriorityRef
  } = useOutsideAlerter(false);
  const handleSelectStatusClickOutside = () => setVisibleSelectStatus(true);
  const handleSelectTypeClickOutside = () => setVisibleSelectType(true);
  const handleSelectPriorityOutside = () => setVisibleSelectPriority(true);
  const editAccess = checkAccess('edit:tasks', projectId);
  const userInfo = useContext(UserContext);
  const operation = 'updated';
  const userId = userInfo.id;
  const taskId = taskInfo.id;
  const [selectedPriorityIcon, setSelectedPriorityIcon] = useState(PRIORITY[taskInfo.priority]);
  const [selectedPriority, setSelectedPriority] = useState(taskInfo.priority);
  const taskTypes = useContext(TaskTypesContext);

  const reporterOnchangeEventHandler = async (e: IOnChangeProjectLead) => {
    const updatedTaskInfo = { ...taskInfo };
    updatedTaskInfo.reporterId = !e.target.value ? undefined : e.target.value;
    taskStatusOnchange(updatedTaskInfo);
    await createActivity({ operation, userId, taskId });
  };

  const assigneeOnchangeEventHandler = async (e: IOnChangeProjectLead) => {
    const updatedTaskInfo = { ...taskInfo };
    updatedTaskInfo.assignId = !e.target.value ? undefined : e.target.value;
    taskStatusOnchange(updatedTaskInfo);
    await createActivity({ operation, userId, taskId });
    const { assignId } = updatedTaskInfo;
    if (assignId) {
      const data = {
        title: updatedTaskInfo.title,
        userId: assignId,
        taskId: updatedTaskInfo.id
      };
      await createDailyScrum(projectId, data);
    }
  };

  const onClickIssueType = (task: ITaskEntity) => {
    const updateTaskInfo = { ...taskInfo };
    updateTaskInfo.typeId = task;
    setSelectedType(updateTaskInfo.typeId);
    setVisibleSelectType(false);
    onSave(updateTaskInfo);
  };

  const onClickPriorityOption = (task: string) => {
    const updateTaskInfo = { ...taskInfo };
    updateTaskInfo.priority = task;
    setSelectedPriorityIcon(PRIORITY[task]);
    setSelectedPriority(task);
    setVisibleSelectPriority(false);
    onSave(updateTaskInfo);
  };

  if (!taskInfo) {
    return <div />;
  }

  return (
    <div className={style.container}>
      <div className={style.box}>
        <div className={style.boxBody}>
          <div className={style.type}>
            <div className={style.leftContent}>
              <CgArrowRightR className={style.reactIcon} />
              <div>Type</div>
            </div>
            <div className={style.rightContent}>
              <div>
                <button
                  className={style.storyIcon}
                  data-testid="card-type-button"
                  type="button"
                  onClick={() => {
                    handleSelectTypeClickOutside();
                  }}
                >
                  <img className={style.selectedTypeIcon} src={selectedType?.icon} alt="Story" />
                  <div className={style.selectedType}>{selectedType?.name}</div>
                </button>
              </div>
              {visibleSelectType && checkAccess('edit:tasks', projectId) && (
                <div className={style.taskTypeList} ref={selectTypeRef}>
                  <p className={style.typeListTitle}>CHANGE ISSUE TYPE</p>
                  {taskTypes.map((taskType) => {
                    const src = taskType.icon;
                    const alt = taskType.slug;
                    return (
                      <button
                        className={style.typeListOption}
                        data-testid="card-type-selection"
                        key={taskType.id}
                        onClick={() => {
                          onClickIssueType(taskType);
                        }}
                      >
                        <img src={src} alt={alt} />
                        <p>{taskType.name}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className={style.type}>
            <div className={style.leftContent}>
              <MdOutlineBookmarkBorder className={style.reactIcon} />
              <div>Status</div>
            </div>
            <div ref={selectStatusRef} className={style.statusSection}>
              {visibleSelectStatus && editAccess ? (
                <>
                  <button
                    type="button"
                    className={style.toDoButton}
                    onClick={handleSelectStatusClickOutside}
                    data-testid="card-status-button"
                  >
                    {taskInfo.status && taskInfo.status.name.toUpperCase()}
                    <svg viewBox="0 0 24 24" role="presentation">
                      <path
                        d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className={style.dropdownSection}>
                    <ul>
                      {Object.entries(columnsInfo).map(([id, column]) => {
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              name="status"
                              className={style.statusOptions}
                              data-testid="card-status-selection"
                              onClick={() => {
                                setVisibleSelectStatus(false);
                                const updatedTaskInfo = { ...taskInfo };
                                updatedTaskInfo.statusId = id;
                                const { items, ...rest } = column;
                                updatedTaskInfo.status = { ...rest, id };
                                taskStatusOnchange(updatedTaskInfo);
                              }}
                            >
                              <span>{column.name}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className={style.toDoButton}
                  onClick={handleSelectStatusClickOutside}
                  data-testid="card-status-button"
                >
                  {taskInfo.status && taskInfo.status.name.toUpperCase()}
                  {editAccess && (
                    <svg viewBox="0 0 24 24" role="presentation">
                      <path
                        d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className={style.dueDate}>
            <div className={style.leftContent}>
              <AiOutlineCalendar className={style.reactIcon} />
              <div>Due date</div>
            </div>
            <DueDatePicker
              taskInfo={taskInfo}
              dueDateOnchange={taskStatusOnchange}
              isDisabled={editAccess}
            />
          </div>
          <div className={style.type}>
            <div className={style.leftContent}>
              <RiFlag2Line className={style.reactIcon} />
              <div>Priority</div>
            </div>
            <div className={style.rightContent}>
              <button
                className={style.storyIcon}
                data-testid="card-priority-button"
                type="button"
                onClick={() => {
                  handleSelectPriorityOutside();
                }}
              >
                <img
                  className={style.priorityImg}
                  src={selectedPriorityIcon}
                  alt={taskInfo.priority}
                />
                <div>{selectedPriority}</div>
              </button>
              {visibleSelectPriority && checkAccess('edit:tasks', projectId) && (
                <div className={style.taskTypeList} ref={selectPriorityRef}>
                  {priorityOptions.map((priorityOption) => {
                    const src = PRIORITY[priorityOption];
                    return (
                      <button
                        key={uuid()}
                        className={style.typeListOption}
                        data-testid="card-priority-selection"
                        onClick={() => {
                          onClickPriorityOption(priorityOption);
                        }}
                      >
                        <img className={style.priorityImg} src={src} alt={priorityOption} />
                        {priorityOption}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <ReporterFields
            taskInfo={taskInfo}
            projectId={projectId}
            reporterOnchangeEventHandler={reporterOnchangeEventHandler}
          />
          <div className={style.fieldMargin}>
            <div className={style.label}>
              <BsPeople className={style.reactIcon} />
              <div>Assignee</div>
            </div>
            <div className={style.assigneeRightContent}>
              <UserSelect
                onChange={assigneeOnchangeEventHandler}
                value={taskInfo.assignId}
                allowEdit={editAccess}
              />
            </div>
          </div>
          <LabelFields
            labels={labels}
            taskInfo={taskInfo}
            isDisabled={!editAccess}
            updateTaskTags={updateTaskTags}
          />
        </div>
      </div>
    </div>
  );
}
