import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { toast } from 'react-toastify';
import styles from './OptionBtn.module.scss';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import { updateTask } from '../../../api/backlog/backlog';
import { deactiveTask } from '../../../api/task/task';

interface IOptionBtn {
  taskId: string;
  sprintId: string;
  showDropDownOnTop?: boolean;
  sprintData: any;
  getBacklogDataApi: () => void;
  className: string;
}
export default function OptionBtn({
  taskId,
  sprintId,
  sprintData,
  showDropDownOnTop,
  getBacklogDataApi,
  className
}: IOptionBtn) {
  const [clickOptionBtnShowStyle, setClickOptionBtnShowStyle] = useState(false);

  const action = () => {
    setClickOptionBtnShowStyle(false);
  };
  const { visible, setVisible, myRef } = useOutsideAlerter(false, action);

  const onClickDelete = (id: string) => {
    deactiveTask(id)
      .then(() => {
        getBacklogDataApi();
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      });
    setVisible(false);
    action();
  };

  const onClickAddToBacklog = (id: string) => {
    const data = { sprintId: null };
    updateTask(id, data)
      .then(() => {
        getBacklogDataApi();
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      });
    setVisible(false);
    action();
  };
  const onClickAddToSprint = (id: string, sprintIdToAdd: string) => {
    const data = { sprintId: sprintIdToAdd };
    updateTask(id, data)
      .then(() => {
        getBacklogDataApi();
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      });
    setVisible(false);
    action();
  };

  return (
    <div className={`${styles.optionBtnContainer} ${className}`} ref={myRef}>
      <button
        className={styles.optionBtn}
        onClick={() => {
          setVisible(!visible);
          setClickOptionBtnShowStyle(!clickOptionBtnShowStyle);
        }}
        onBlur={() => {}}
        onFocus={() => {}}
        data-testid={'hover-show-option-btn-'.concat(taskId)}
      >
        <BsThreeDots />
      </button>
      <div
        className={
          visible
            ? [
                styles.optionBtnDropDown,
                styles.showOptionBtnDropDown,
                showDropDownOnTop && styles.showDropDownOnTop
              ].join(' ')
            : styles.optionBtnDropDown
        }
      >
        <ul>
          <p>Actions</p>
          <li>
            <button className={styles.dropDownBtn}>Copy issue link</button>
          </li>
          {sprintId && (
            <li>
              <button
                className={styles.dropDownBtn}
                onClick={() => {
                  onClickAddToBacklog(taskId);
                }}
              >
                Add to Backlog
              </button>
            </li>
          )}
          {sprintData
            .filter((sprint) => {
              return sprint.id !== sprintId && !sprint.isComplete;
            })
            .map((sprint) => {
              return (
                <li key={sprint.id}>
                  <button
                    className={styles.dropDownBtn}
                    onClick={() => {
                      onClickAddToSprint(taskId, sprint.id);
                    }}
                  >
                    Add to {sprint.name}
                  </button>
                </li>
              );
            })}
          <li>
            <button
              className={styles.dropDownBtn}
              onClick={() => {
                onClickDelete(taskId);
              }}
              data-testid={'delete-task-'.concat(taskId)}
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

OptionBtn.defaultProps = {
  showDropDownOnTop: false
};
