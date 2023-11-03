import React from 'react';
import { BsPerson } from 'react-icons/bs';
import styles from './ReporterFields.module.scss';
import UserSelect from '../../../Form/Select/UserSelect/UserSelect';
import checkAccess from '../../../../utils/helpers';
import { IOnChangeProjectLead } from '../../../../types';

interface ITaskRelator {
  taskInfo: any;
  projectId: any;
  reporterOnchangeEventHandler: (e: IOnChangeProjectLead) => void;
}

export default function ReporterFields({
  taskInfo,
  projectId,
  reporterOnchangeEventHandler
}: ITaskRelator) {
  const editAccess = checkAccess('edit:tasks', projectId);

  return (
    <div className={styles.reporter}>
      <div className={styles.leftContent}>
        <BsPerson className={styles.reactIcon} />
        <div>Reporter</div>
      </div>
      <div>
        <UserSelect
          onChange={reporterOnchangeEventHandler}
          value={taskInfo.reporterId}
          allowEdit={editAccess}
        />
      </div>
    </div>
  );
}
