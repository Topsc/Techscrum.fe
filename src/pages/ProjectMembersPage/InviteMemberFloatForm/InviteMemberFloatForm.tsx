import React, { useState } from 'react';
import styles from './InviteMemberFloatForm.module.scss';
import { IRole } from '../../../types';

interface Props {
  roles: IRole[];
  inviteMember: (email: string, roleId: string, onSubmit: boolean) => Promise<void>;
}

export default function InviteMemberFloatForm({ roles, inviteMember }: Props) {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(roles[2].id);

  const eventHandler = (eventType: boolean) => {
    inviteMember(email, roleId ?? '', eventType);
  };

  return (
    <div className={styles.InviteMemberFloatFormContainer}>
      <form action="">
        <h1>Invite Member</h1>
        <div className={styles.content}>
          <p>Email</p>
          <input
            placeholder="e.g. www.example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.content}>
          <p>Role</p>
          <select
            defaultValue={roles[2].id}
            onChange={(e) => {
              setRoleId(e.target.value);
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
        </div>
        <div className={styles.buttonList}>
          <button type="button" onClick={() => eventHandler(false)}>
            Cancel
          </button>
          <button type="button" onClick={() => eventHandler(true)}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
