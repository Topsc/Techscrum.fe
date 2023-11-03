import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProjectMemberMain.module.scss';
import { IUserInfo, IRole } from '../../../types';
import { getOwner } from '../../../utils/helpers';

interface Props {
  members: IUserInfo[];
  roles: IRole[];
  onChangeProjectRole: (e: React.ChangeEvent<HTMLSelectElement>, userId: string) => void;
  onClickRemove: (userId: string) => void;
}

export default function ProjectMemberMain({
  members,
  roles,
  onChangeProjectRole,
  onClickRemove
}: Props) {
  const { projectId = '' } = useParams();
  const owner = getOwner(projectId);
  return (
    <div className={styles.projectMemberMainContainer}>
      <table aria-label="Projects details">
        <thead>
          <tr>
            <th className={styles.names}>
              <span>Name</span>
            </th>
            <th className={styles.email}>
              <span>Email</span>
            </th>
            <th className={styles.role}>
              <span>Role</span>
            </th>
            <th className={styles.buttons}>
              <span />
            </th>
          </tr>
        </thead>
        <tbody>
          {owner && (
            <tr>
              <th className={styles.name}>
                <img src={owner.avatarIcon} alt="avatar" />
                <span>{owner.name}</span>
              </th>
              <th className={styles.email}>
                <span>{owner.email ?? '-'}</span>
              </th>
              <th className={styles.role}>
                <span>
                  <select value="Owner" disabled>
                    <option value={owner.id}>Owner</option>
                    );
                  </select>
                </span>
              </th>
            </tr>
          )}
          {members.map((member) => {
            return (
              <tr key={member.id}>
                <th className={styles.name}>
                  <img src={member.avatarIcon} alt="avatar" />
                  <span>{member.name}</span>
                </th>
                <th className={styles.email}>
                  <span>{member.email ?? '-'}</span>
                </th>
                <th className={styles.role}>
                  <span>
                    <select
                      value={
                        member?.projectsRoles?.find(
                          (projectRole) => projectRole.projectId === projectId
                        )?.roleId ?? ''
                      }
                      onChange={(e) => {
                        onChangeProjectRole(e, member.id ?? '');
                      }}
                    >
                      {roles.map((role: IRole) => {
                        return (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        );
                      })}
                    </select>
                  </span>
                </th>
                <th className={styles.buttons}>
                  <button
                    onClick={() => {
                      onClickRemove(member.id ?? '');
                    }}
                  >
                    Remove Member
                  </button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
