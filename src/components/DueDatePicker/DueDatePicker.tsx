import React, { useContext } from 'react';
import { DatePicker } from '@atlaskit/datetime-picker';
import { UserContext } from '../../context/UserInfoProvider';
import { createActivity } from '../../api/activity/activity';
import { ITaskEntity } from '../../types';

interface Props {
  taskInfo: ITaskEntity;
  dueDateOnchange: (taskInfo: ITaskEntity) => void;
  isDisabled: boolean;
}

export default function DueDatePicker({ taskInfo, dueDateOnchange, isDisabled }: Props) {
  const userInfo = useContext(UserContext);
  const operation = 'updated';
  const userId = userInfo.id;
  const taskId = taskInfo.id;

  const dateWithDay = (date: Date | null) => {
    if (date != null) {
      const fullDate = date.toString().split('T')[0];
      const dateDataArray = fullDate.split('-');
      return `${dateDataArray[1]}-${dateDataArray[2]}-${dateDataArray[0]}`;
    }
    return '';
  };

  return (
    <DatePicker
      appearance="subtle"
      dateFormat="MM-DD-YYYY"
      placeholder={dateWithDay(taskInfo.dueAt ?? null)}
      onChange={async (date) => {
        const updatedTaskInfo = { ...taskInfo };
        updatedTaskInfo.dueAt = new Date(date);
        dueDateOnchange(updatedTaskInfo);
        await createActivity({ operation, userId, taskId });
      }}
      isDisabled={!isDisabled}
    />
  );
}
