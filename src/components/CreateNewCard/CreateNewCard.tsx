/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createActivity } from '../../api/activity/activity';
import styles from './CreateNewCard.module.scss';
import { createNewTask } from '../../api/task/task';
import { ICardData, IMinEvent } from '../../types';
import { upload } from '../../api/upload/upload';
import Attach from '../BoardCard/CardLeftContent/components/Attach/Attach';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import { TaskTypesContext } from '../../context/TaskTypeProvider';
import { UserContext } from '../../context/UserInfoProvider';

import LabelFieldsV2 from '../../lib/FieldsV2/LabelFieldsV2/LabelFieldsV2';
import UsersFieldsV2 from '../../lib/FieldsV2/UsersFieldsV2/UsersFieldsV2';
import DropdownV2 from '../../lib/FormV2/DropdownV2/DropdownV2';
import TextAreaV2 from '../../lib/FormV2/TextAreaV2/TextAreaV2';
import InputV2 from '../../lib/FormV2/InputV2/InputV2';
import Row from '../../lib/Grid/Row/Row';
import { createDailyScrum } from '../../api/dailyScrum/dailyScrum';

interface Props {
  fetchNewCard: (newCard: ICardData) => void;
  updateIsCreateNewCard: () => void;
}

function CreateNewCard({ fetchNewCard, updateIsCreateNewCard }: Props) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState<any>(null);
  const [photoData, setPhotoData] = useState<any>([]);
  const [taskTypeId, setTaskTypeId] = useState<string>();
  const { boardId = '', projectId = '' } = useParams();
  const taskType = useContext(TaskTypesContext);
  const userInfo = useContext(UserContext);

  useEffect(() => {
    if (!taskType) {
      return;
    }
    setTaskTypeId(taskType[0]?.id);
  }, [taskType]);

  const data = useState<ICardData>({
    dueAt: new Date(),
    title: ''
  });

  const onChangeAssigneeId = (e: IMinEvent) => {
    setAssigneeId(e.target.value);
  };

  const onChangeTaskType = (e: IMinEvent) => {
    setTaskTypeId(e.target.value);
  };

  const changeDescriptionHandler = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const uploadSuccess = (newPhotoData: any) => {
    const updatePhotoData = [...photoData, newPhotoData[0].location];
    setPhotoData(updatePhotoData);
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

  const onSave = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newCard = {
      ...data[0],
      description,
      title,
      boardId,
      projectId,
      tag: [],
      typeId: taskTypeId,
      assignId: assigneeId,
      attachmentUrls: photoData
    };

    createNewTask(newCard)
      .then((res) => {
        if (res.status !== 201) {
          return toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
        }

        const operation = 'created';
        const userId = userInfo?.id;
        const taskId = res.data.id;

        if (assigneeId) {
          const dailyScrumData = {
            userId: assigneeId,
            title,
            taskId
          };
          createDailyScrum(projectId, dailyScrumData);
        }

        createActivity({ operation, userId, taskId });
        return fetchNewCard({ ...res.data, statusId: res.data.status });
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      });
  };

  const removeAttachment = (url: string) => {
    const updatePhotoData = photoData.filter((photoUrl: string) => {
      return photoUrl !== url;
    });
    setPhotoData(updatePhotoData);
  };

  return (
    <div className="defaultHeaderModalPadding">
      <form onSubmit={onSave}>
        <Row defaultMargin>
          <InputV2
            label="Title"
            name="title"
            onValueChanged={changeTitleHandler}
            defaultValue=""
            dataTestId="title"
          />
        </Row>
        <Row defaultMargin defaultGap>
          <DropdownV2
            label="Card Type"
            name="type"
            onValueChanged={onChangeTaskType}
            defaultValue={taskType[0]?.name}
            options={taskType.map((item) => {
              return { value: item.id, label: item.name };
            })}
          />
          <DropdownV2
            label="Status"
            name="status"
            onValueChanged={() => {}}
            defaultValue="High"
            options={[
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' }
            ]}
          />
        </Row>
        <Row defaultGap>
          {/* <MultiSelectDropdownV2
            label="Labels"
            name="labels"
            onValueChanged={() => {}}
            options={[]}
          /> */}
          <LabelFieldsV2 taskInfo={null} isDisabled={false} updateTaskTags={() => {}} />
          <UsersFieldsV2
            onChange={onChangeAssigneeId}
            defaultValue={null}
            label="Assignee"
            name="assignee"
            required={false}
          />
        </Row>
        <Attach onChangeAttachment={uploadFile} />
        <PhotoGallery photoData={photoData} removeAttachment={removeAttachment} />
        <TextAreaV2
          label="Description"
          onValueChanged={changeDescriptionHandler}
          defaultValue={description}
          name="description"
          dataTestId="summary"
        />
        <div className={styles.cardButton}>
          <button
            type="button"
            className={styles.cancelButton}
            name="close"
            onClick={updateIsCreateNewCard}
          >
            Cancel
          </button>
          <button type="submit" className={styles.createButton} data-testid="create-issue">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewCard;
