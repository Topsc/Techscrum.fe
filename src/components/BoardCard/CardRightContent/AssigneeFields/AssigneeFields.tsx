import React, { useState } from 'react';
import userAvatar from '../../../../assets/userAvatar.png';
import useOutsideAlerter from '../../../../hooks/OutsideAlerter';
import { IOnChangeTaskAssignee } from '../../../../types';
import styles from './AssigneeFields.module.scss';

interface ITaskRelator {
  assigneeOnchangeEventHandler: (e: IOnChangeTaskAssignee) => void;
}

const users = [
  {
    id: '1',
    avatar: userAvatar,
    name: 'Unassigned'
  }
];

export default function AssigneeFields(props: ITaskRelator) {
  const { assigneeOnchangeEventHandler } = props;
  const [userInfo, setUserInfo] = useState(users[0]);
  const { visible, setVisible, myRef } = useOutsideAlerter(false);
  const handleClickOutside = () => setVisible(true);
  return (
    <div ref={myRef} className={styles.assignee}>
      <div>Assignee</div>
      <div className={styles.leadDropdownContainer}>
        {visible ? (
          <div className={styles.leadDropdownOpen}>
            <div className={styles.leadInputField}>
              <img className={styles.userAvatar} src={userInfo.avatar} alt="avatar" />
              <span>{userInfo.name}</span>
              <button className={styles.optionToggle} type="button" onClick={handleClickOutside}>
                <i role="button" aria-label="openDropdown" tabIndex={0} />
              </button>
            </div>
            <div className={styles.leadMenu}>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setUserInfo({ id: user.id, avatar: user.avatar, name: user.name });
                        assigneeOnchangeEventHandler({ target: { id: user.id } });
                        setVisible(false);
                      }}
                    >
                      <img src={user.avatar} alt="avatar" />
                      <span>{user.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <button className={styles.leadInputClose} type="button" onClick={handleClickOutside}>
            <img src={userInfo.avatar} alt="avatar" />
            <span>{userInfo.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}
