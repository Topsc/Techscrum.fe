import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProjectMemberPage.module.scss';
import ProjectMemberHeader from '../../components/ProjectHeader/ProjectHeader';
import ProjectMemberNav from './ProjectMemberHeaderNav/ProjectMemberHeaderNav';
import ProjectMemberTitle from './ProjectMemberTitle/ProjectMemberTitle';
import ProjectMemberMain from './ProjectMemberMain/ProjectMemberMain';
import InviteMemberFloatForm from './InviteMemberFloatForm/InviteMemberFloatForm';
import { IUserInfo, IRole } from '../../types';
import Loading from '../../components/Loading/Loading';
import { getMembers, inviteMember, updateMemberRole, removeMember } from '../../api/member/member';
import { getRoles } from '../../api/role/role';

export default function ProjectMembersPage() {
  const { projectId = '' } = useParams();
  const [members, setMembers] = useState<IUserInfo[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [inviteFormVisible, setInviteFormVisible] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const res = await getMembers(projectId);
      setMembers(res.data);
    } catch (e) {
      setMembers([]);
    } finally {
      setLoadingStatus(false);
    }
  }, [projectId]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingStatus(true);
        const res = await getRoles(projectId);
        setRoles(res);
      } catch (e) {
        setMembers([]);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchRoles();
    fetchMembers();
  }, [projectId, fetchMembers]);

  const onChangeProjectRole = async (e: React.ChangeEvent<HTMLSelectElement>, userId: string) => {
    const roleId = e.target.value;

    const res = await updateMemberRole(roleId, userId, projectId);
    if (res.data) {
      await fetchMembers();
    }
  };

  const onClickRemove = async (userId: string) => {
    const res = await removeMember(userId, projectId);
    if (res.data) {
      await fetchMembers();
    }
  };

  const InviteMember = async (email: string, roleId: string, onSubmit: boolean) => {
    setInviteFormVisible(false);
    if (onSubmit) {
      const res = await inviteMember(email, roleId, projectId);
      if (res.data) {
        await fetchMembers();
      }
    }
  };

  return (
    <div className={styles.projectMemberContainer} data-testid="member-page">
      <ProjectMemberHeader />
      <div className={styles.projectMemberMain}>
        <ProjectMemberNav />
        <ProjectMemberTitle setInviteFormVisible={setInviteFormVisible} projectId={projectId} />
        {loadingStatus ? (
          <Loading />
        ) : (
          <ProjectMemberMain
            members={members}
            roles={roles}
            onChangeProjectRole={onChangeProjectRole}
            onClickRemove={onClickRemove}
          />
        )}
      </div>
      {inviteFormVisible && <InviteMemberFloatForm roles={roles} inviteMember={InviteMember} />}
    </div>
  );
}
