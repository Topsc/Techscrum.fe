import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserInfoProvider';
import checkAccess from '../../../utils/helpers';
import PhotoGallery from '../../PhotoGallery/PhotoGallery';
import style from './CardLeftContent.module.scss';
import Attach from './components/Attach/Attach';
import Description from './components/Description/Description';
import LeftBottom from './components/LeftBottom/LeftBottom';
import { createActivity } from '../../../api/activity/activity';
import { ITaskEntity } from '../../../types';

interface Props {
  taskInfo: ITaskEntity;
  onSave: (updatedTaskInfo: ITaskEntity) => void;
  removeAttachment: (url: string) => void;
  uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projectId: string;
}

export default function CardLeftContent({
  taskInfo,
  onSave,
  removeAttachment,
  uploadFile,
  projectId
}: Props) {
  const [visible, setVisible] = useState(false);
  const userInfo = useContext(UserContext);
  const [desc, setDesc] = useState<string | undefined>('');
  const [title, setTitle] = useState<string | undefined>('');

  useEffect(() => {
    setTitle(taskInfo.title);
    setDesc(taskInfo.description);
  }, [taskInfo]);

  const onFocusEventHandler = () => setVisible(true);
  const onSaveProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTaskInfo = { ...taskInfo, title, description: desc };
    onSave(updatedTaskInfo);
    setVisible(false);
    const operation = 'updated';
    const userId = userInfo.id;
    const taskId = taskInfo.id;
    await createActivity({ operation, userId, taskId });
  };
  const onResetHandler = () => setVisible(false);

  const onChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
  };

  return (
    <div className={style.container}>
      <form onSubmit={onSaveProcessing} onReset={onResetHandler} id="task-form">
        <PhotoGallery
          photoData={taskInfo.attachmentUrls}
          removeAttachment={removeAttachment}
          isDisabled={!checkAccess('edit:tasks', projectId)}
        />
        <Description
          taskInfo={taskInfo}
          focusEventHandler={onFocusEventHandler}
          isDisabled={!checkAccess('edit:tasks', projectId)}
          onChangeDesc={onChangeDesc}
          value={desc}
        />
        {checkAccess('edit:tasks', projectId) && <Attach onChangeAttachment={uploadFile} />}
        {visible && (
          <div className={style.footerContent}>
            <button className={style.saveButton} type="submit">
              <span>Save</span>
            </button>
            <button className={style.cancelButton} type="reset">
              <span>Cancel</span>
            </button>
          </div>
        )}
        <LeftBottom
          taskId={taskInfo.id}
          userId={userInfo.id}
          userEmail={userInfo?.email}
          projectId={projectId}
        />
      </form>
    </div>
  );
}
