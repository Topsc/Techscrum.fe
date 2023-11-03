import React, { Dispatch, SetStateAction } from 'react';
import styles from './UserTaskFilter.module.scss';
import BacklogUserFilter from './BacklogUserFilter/BacklogUserFilter';
import BacklogUserFilterDropdown from './BacklogUserFilterDropdown/BacklogUserFilterDropdown';
import { IUserInfo } from '../../types';

interface IUserTaskFilter {
  userList: IUserInfo[];
  selectedUsers: IUserInfo[];
  changeSelectedUsers: (
    isExists: boolean,
    selectedItems: IUserInfo[],
    item: IUserInfo
  ) => IUserInfo[];
  setSelectedUsers: Dispatch<SetStateAction<IUserInfo[]>>;
}

export default function userTaskFilter(props: IUserTaskFilter) {
  const { selectedUsers, changeSelectedUsers, userList, setSelectedUsers } = props;
  return (
    <div className={styles.BacklogFilterArea}>
      {userList?.slice(0, 4).map((user) => (
        <BacklogUserFilter
          selectedUsers={selectedUsers}
          changeSelectedUsers={changeSelectedUsers}
          setSelectedUsers={setSelectedUsers}
          key={user.id}
          user={user}
        />
      ))}
      {userList?.length > 4 && (
        <BacklogUserFilterDropdown
          selectedUsers={selectedUsers}
          changeSelectedUsers={changeSelectedUsers}
          setSelectedUsers={setSelectedUsers}
          users={userList.slice(4)}
        />
      )}
    </div>
  );
}
