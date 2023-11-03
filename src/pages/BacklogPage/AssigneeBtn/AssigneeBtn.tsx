import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AssigneeBtn.module.scss';
import IconButton from '../../../components/Button/IconButton/IconButton';
import userAvatar from '../../../assets/userAvatar.png';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import { IUserInfo, IAssign } from '../../../types';
import { updateTask } from '../../../api/backlog/backlog';

interface IAssigneeBtn {
  assignee: IAssign | null;
  taskId: string;
  userList: IUserInfo[];
  showDropDownOnTop?: boolean;
  getBacklogDataApi: () => void;
}
export default function AssigneeBtn({
  assignee,
  userList,
  taskId,
  showDropDownOnTop,
  getBacklogDataApi
}: IAssigneeBtn) {
  const [query, setQuery] = useState('');
  const { visible, setVisible, myRef } = useOutsideAlerter(false);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onClickChangeAssignee = (id: string, assigneeId: string | null) => {
    const data = { assignId: assigneeId };
    updateTask(id, data)
      .then(() => {
        getBacklogDataApi();
      })
      .catch(() => {
        toast.error('Temporary Server Error. Try Again.', { theme: 'colored' });
      });
    setVisible(false);
  };

  let name = 'Unassigned';
  let avartar = userAvatar;
  if (assignee) {
    if (assignee.name) {
      name = assignee.name;
    }
    if (assignee.avatarIcon) {
      avartar = assignee.avatarIcon;
    }
  }

  return (
    <div className={styles.assigneeContainer} ref={myRef}>
      <IconButton
        overrideStyle={styles.assignee}
        icon={<img src={avartar} alt="avatar" />}
        tooltip={name}
        onClick={() => {
          setVisible(!visible);
        }}
      />
      {visible && (
        <div
          className={[styles.assigneeDropdown, showDropDownOnTop && styles.showDropDownOnTop].join(
            ' '
          )}
        >
          <div className={styles.inputContainer}>
            <input type="text" placeholder={name} onChange={onChangeInput} />
            <img src={avartar} alt="avatar" />
          </div>
          <ul className={styles.assigneeDropdownList}>
            <li>
              <button
                onClick={() => {
                  onClickChangeAssignee(taskId, null);
                }}
              >
                <img src={userAvatar} alt="avatar" />
                Unassigned
              </button>
            </li>
            {userList
              .filter((user: IUserInfo) => {
                return user.name && user.name.toLowerCase().includes(query.toLowerCase());
              })
              .map((user) => {
                return (
                  <li key={user.id}>
                    <button
                      onClick={() => {
                        if (user.id) {
                          onClickChangeAssignee(taskId, user.id);
                        }
                        setQuery('');
                        setVisible(false);
                      }}
                    >
                      <img src={user.avatarIcon} alt="avatar" />
                      {user.name}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
AssigneeBtn.defaultProps = {
  showDropDownOnTop: false
};
