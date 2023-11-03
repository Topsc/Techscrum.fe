/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { RiMoreFill } from 'react-icons/ri';
import { TaskTypesContext } from '../../../context/TaskTypeProvider';
import { TasksByProjectContext } from '../../../context/TasksByProjectProvider';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import checkAccess from '../../../utils/helpers';
import style from './CardHeader.module.scss';
import { deleteDailyScrum } from '../../../api/dailyScrum/dailyScrum';
import { ITaskEntity, ITypes } from '../../../types';

interface Props {
  updateIsViewTask: () => void;
  taskInfo: ITaskEntity;
  deleteTask: () => void;
  projectId: string;
  onSave: (data: ITaskEntity) => void;
  selectedType: ITypes | null;
  setSelectedType: Dispatch<SetStateAction<ITypes | null>>;
}

export default function CardHeader({
  updateIsViewTask,
  taskInfo,
  deleteTask,
  projectId,
  onSave,
  selectedType,
  setSelectedType
}: Props) {
  const {
    visible: visibleDeleteSection,
    setVisible: setVisibleDeleteSection,
    myRef: deleteSectionRef
  } = useOutsideAlerter(false);
  const {
    visible: visibleSelectDropDown,
    setVisible: setVisibleSelectDropDown,
    myRef: selectDropDownRef
  } = useOutsideAlerter(false);
  const handleSelectDropDownClickOutside = () => setVisibleSelectDropDown(!visibleSelectDropDown);
  const handleDeleteSectionClickOutside = () => setVisibleDeleteSection(!visibleDeleteSection);
  const taskType = useContext(TaskTypesContext);
  const tasksByProject = useContext(TasksByProjectContext);

  const [taskTicketNum, setTaskTicketNum] = useState();
  const [projectKey, setProjectKey] = useState();

  useEffect(() => {
    setTaskTicketNum(tasksByProject.findIndex((e) => e.id === taskInfo.id) + 1);
    setProjectKey(tasksByProject[0]?.projectId.key);
  }, [tasksByProject, taskInfo.id]);

  useEffect(() => {
    setSelectedType(taskInfo?.typeId);
  }, [taskInfo.id]);

  const onDeleteDailyScrum = async () => {
    await deleteDailyScrum(projectId, taskInfo.id as string);
  };

  const onClickIssueType = (task: ITaskEntity) => {
    const updateTaskInfo = { ...taskInfo };
    updateTaskInfo.typeId = task;
    setSelectedType(updateTaskInfo?.typeId);
    onSave(updateTaskInfo);
  };

  return (
    <header className={style.container}>
      <div className={style.headerLeft}>
        <button
          className={style.storyIcon}
          type="button"
          onClick={() => {
            handleSelectDropDownClickOutside();
          }}
        >
          <img src={selectedType?.icon} alt="Story" />
        </button>
        {visibleSelectDropDown && checkAccess('edit:tasks', projectId) && (
          <div className={style.taskTypeList} ref={selectDropDownRef}>
            <p className={[style.storyIcon, style.header].join(' ')}>Change Issue Type</p>
            {taskType.map((item: any) => {
              let src =
                'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium';
              if (item?.icon) {
                src = item.icon;
              }
              return (
                <button
                  key={item.id}
                  className={style.storyIcon}
                  type="button"
                  onClick={() => {
                    onClickIssueType(item);
                    handleSelectDropDownClickOutside();
                  }}
                >
                  <img src={src} alt={item.slug} />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
        <span>{`${projectKey}-${String(taskTicketNum).padStart(3, '0')}`}</span>
      </div>
      <div className={style.headerRight}>
        <div ref={deleteSectionRef} className={style.deleteSection}>
          {visibleDeleteSection ? (
            <div className={style.dropdown}>
              <div className={style.menuOpen}>
                <RiMoreFill onClick={handleDeleteSectionClickOutside} />
              </div>
              <div className={style.delete}>
                <button
                  type="button"
                  onClick={() => {
                    deleteTask();
                    onDeleteDailyScrum();
                    handleDeleteSectionClickOutside();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className={checkAccess('delete:tasks', projectId) ? style.menuClose : ''}>
              {checkAccess('delete:tasks', projectId) && (
                <RiMoreFill onClick={handleDeleteSectionClickOutside} />
              )}
            </div>
          )}
        </div>
        <button type="button" onClick={updateIsViewTask}>
          <svg viewBox="0 0 24 24" role="presentation">
            <path
              d="M12 10.586L6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 001.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414L12 10.586z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
