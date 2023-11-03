import React, { useContext, useEffect, useState } from 'react';
import CardHeader from './CardHeader/CardHeader';
import CardLeftContent from './CardLeftContent/CardLeftContent';
import CardRightContent from './CardRightContent/CardRightContent';
import { IColumnsFromBackend, ILabelData, ITaskEntity, ITypes } from '../../types';
import styles from './BoardCard.module.scss';
import { upload } from '../../api/upload/upload';
import { createActivity } from '../../api/activity/activity';
import { UserContext } from '../../context/UserInfoProvider';
import { TasksByProjectProvider } from '../../context/TasksByProjectProvider';
import Title from './CardLeftContent/components/Title/Title';
import checkAccess from '../../utils/helpers';

interface Props {
  columnsInfo: IColumnsFromBackend;
  taskData: ITaskEntity | undefined;
  onSave: (updatedTaskInfo: ITaskEntity) => void;
  updateIsViewTask: () => void;
  deleteTask: () => void;
  labels: ILabelData[];
  projectId: string;
  updateTaskTags: (tags: ILabelData[] | undefined) => void;
}

export default function BoardCard({
  columnsInfo,
  taskData,
  onSave,
  deleteTask,
  updateIsViewTask,
  labels,
  projectId,
  updateTaskTags
}: Props) {
  const [taskInfo, setTaskInfo] = useState<ITaskEntity | null>(null);
  const [selectedType, setSelectedType] = useState<ITypes | null>(null);
  const userInfo = useContext(UserContext);

  const [title, setTitle] = useState<string | undefined>(taskInfo?.title);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskInfo) {
      if (e.target.value !== taskInfo.title) {
        const updatedTaskInfo = { ...taskInfo, title: e.target.value };
        onSave(updatedTaskInfo);
      }
    }
  };

  useEffect(() => {
    if (!taskData) {
      return;
    }
    setTaskInfo(taskData);
  }, [taskData]);

  const removeAttachment = async (url: string) => {
    const updateTaskInfo = { ...taskInfo };
    updateTaskInfo.attachmentUrls = taskInfo?.attachmentUrls.filter((photoUrl: string) => {
      return photoUrl !== url;
    });
    setTaskInfo(updateTaskInfo);
    onSave(updateTaskInfo);
    const operation = 'updated';
    const userId = userInfo?.id;
    const taskId = taskInfo?.id;
    await createActivity({ operation, userId, taskId });
  };

  const uploadSuccess = async (newPhotoData: any) => {
    const updateTaskInfo = { ...taskInfo };
    updateTaskInfo.attachmentUrls = [...updateTaskInfo.attachmentUrls, newPhotoData[0].location];
    setTaskInfo(updateTaskInfo);
    onSave(updateTaskInfo);
    const operation = 'updated';
    const userId = userInfo?.id;
    const taskId = taskInfo?.id;
    await createActivity({ operation, userId, taskId });
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const uploadData = new FormData();
    uploadData.append('photos', e.target.files[0]);
    upload(uploadData).then((res: any) => {
      uploadSuccess(res.data);
    });
  };

  if (!taskInfo) {
    return <div />;
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <TasksByProjectProvider projectId={projectId}>
          <CardHeader
            updateIsViewTask={updateIsViewTask}
            deleteTask={deleteTask}
            taskInfo={taskInfo}
            projectId={projectId}
            onSave={onSave}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        </TasksByProjectProvider>
        <div className={styles.cardContent}>
          <div className={styles.cardTitle}>
            <Title
              taskInfo={taskInfo}
              focusEventHandler={() => {}}
              isDisabled={!checkAccess('edit:tasks', projectId)}
              onChangeTitle={onChangeTitle}
              onBlurHandler={onBlurHandler}
              value={title}
            />
          </div>
          <CardRightContent
            taskInfo={taskInfo}
            columnsInfo={columnsInfo}
            taskStatusOnchange={onSave}
            labels={labels}
            projectId={projectId}
            updateTaskTags={updateTaskTags}
            onSave={onSave}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
          <CardLeftContent
            taskInfo={taskInfo}
            onSave={onSave}
            removeAttachment={removeAttachment}
            uploadFile={uploadFile}
            projectId={projectId}
          />
        </div>
      </div>
    </div>
  );
}
