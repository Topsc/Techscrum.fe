import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './StatusBtn.module.scss';
import Button from '../../../components/Button/Button';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import { IStatusBacklog } from '../../../types';
import { updateTask } from '../../../api/backlog/backlog';

interface IToolBar {
  status: string;
  taskId: string;
  statusData: IStatusBacklog[];
  getBacklogDataApi: () => void;
  showDropDownOnTop?: boolean;
}
export default function StatusBtn({
  status,
  taskId,
  statusData,
  showDropDownOnTop,
  getBacklogDataApi
}: IToolBar) {
  const { visible, setVisible, myRef } = useOutsideAlerter(false);

  const dropDownClick = () => {
    setVisible(!visible);
  };
  const btnClick = (statusId: string) => {
    const data = { status: statusId };
    updateTask(taskId, data)
      .then(() => {
        getBacklogDataApi();
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      });
    setVisible(false);
  };

  return (
    <div className={styles.statusBtnContainer} ref={myRef}>
      <Button
        icon={<FaChevronDown />}
        iconPosition="end"
        overrideStyle={[styles.statusBtn, styles.dropDownBtnPurple].join(' ')}
        onClick={dropDownClick}
      >
        {status}
      </Button>
      <div
        className={
          visible
            ? [
                styles.btnDropDownContainer,
                styles.showBtnDropDownContainer,
                showDropDownOnTop && styles.showDropDownOnTop
              ].join(' ')
            : styles.btnDropDownContainer
        }
      >
        <ul className={styles.btnDropDownListContainer}>
          {statusData.map((btnInfo) => {
            return (
              <li key={btnInfo.name}>
                <Button
                  overrideStyle={[styles.dropDownBtn].join(' ')}
                  onClick={() => {
                    btnClick(btnInfo.id);
                  }}
                >
                  <span className={styles.dropDownBtnPurple}>{btnInfo.name.toUpperCase()}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
StatusBtn.defaultProps = {
  showDropDownOnTop: false
};
