import React, { Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProjectMemberTitle.module.scss';

interface Props {
  setInviteFormVisible: Dispatch<boolean>;
  projectId: string;
}

export default function ProjectMemberTitle({ setInviteFormVisible, projectId }: Props) {
  const navigate = useNavigate();

  return (
    <div className={styles.projectMemberHeaderContainer}>
      <h1>Access</h1>
      <div>
        <button onClick={() => setInviteFormVisible(true)}>Add Member</button>
        <button
          data-testid="manage-role-btn"
          onClick={() => navigate(`/projects/${projectId}/rolesV2`)}
        >
          Manage Role
        </button>
      </div>
    </div>
  );
}
