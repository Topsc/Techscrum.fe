import axios from 'axios';
import React, { useEffect, useState, createRef } from 'react';
import { TiDelete } from 'react-icons/ti';
import ProjectHeader from '../../components/ProjectHeader/ProjectHeader';
import config from '../../config/config';
import { IPermissions, IRole } from '../../types';
import { clickedShowMore } from '../../utils/helpers';
import styles from './RolePage.module.scss';

export default function ProjectMembersPage() {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermissions[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<IPermissions[]>([]);
  const [showPermissionOptions, setShowPermissionOptions] = useState('-1');
  const refRole = roles.map(() => createRef<HTMLDivElement>());
  const refShowMore = roles.map(() => createRef<HTMLDivElement>());

  useEffect(() => {
    const getRoles = async () => {
      const path = `${config.apiAddress}/roles`;
      const res = await axios.get(path);
      setRoles(res.data);
    };

    const getPermissions = async () => {
      const path = `${config.apiAddress}/permissions`;
      const res = await axios.get(path);
      setPermissions(res.data);
    };

    getRoles();
    getPermissions();
  }, [permissions]);

  const onChangeSelectedPermissions = (item: IPermissions) => {
    setSelectedPermissions(selectedPermissions.concat(item));
  };

  const viewDetailPosition = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const mouseDetailPosition = e.currentTarget.getBoundingClientRect();

    const viewPosition = {
      x: mouseDetailPosition.left + window.scrollX,
      y: mouseDetailPosition.top + window.scrollY
    };
    const { current } = refRole[id];
    if (current !== null) {
      current.style.top = `${viewPosition.y - 170}px`;
      current.style.left = `${viewPosition.x + 50}px`;
    }
  };

  const handleClickInside = (e: MouseEvent) => {
    if (!clickedShowMore(e, refShowMore)) {
      setShowPermissionOptions('-1');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickInside);
    return () => document.removeEventListener('mousedown', handleClickInside);
  });

  return (
    <>
      <ProjectHeader />
      <div className={styles.rolePage}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.title}>
                <h1>Manage Roles</h1>
              </div>
              <div className={styles.mainContent}>
                <table aria-label="Projects details">
                  <thead>
                    <tr>
                      <th className={styles.roles}>
                        <span>Roles</span>
                      </th>
                      {roles.map((role) => (
                        <th key={role.id} className={styles.types}>
                          <span>{role.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.permission}>
                        <span>Permission</span>
                      </td>
                      {roles.map((role, index) => (
                        <td key={role.id}>
                          <div
                            onMouseOver={(e: React.MouseEvent<HTMLDivElement>) =>
                              viewDetailPosition(e, index)
                            }
                            onFocus={() => undefined}
                            className={styles.permissionOptionSection}
                          >
                            <button
                              className={styles.addPermissionBtn}
                              onClick={() => {
                                setShowPermissionOptions(role.id);
                              }}
                            >
                              Add permission
                            </button>
                            {showPermissionOptions === role.id && (
                              <div ref={refShowMore[index]} className={styles.permissionList}>
                                <ul>
                                  {permissions.map((item: IPermissions) => (
                                    <li key={item.id}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!item.id) {
                                            return;
                                          }
                                          onChangeSelectedPermissions(item);
                                          setShowPermissionOptions('-1');
                                        }}
                                      >
                                        {item.description}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className={styles.selectedPermissions}>
                              {role?.permission?.map((item: IPermissions) => (
                                <div key={item.id} className={styles.editSelectedSection}>
                                  <span>{item.slug}</span>
                                  <TiDelete onClick={() => {}} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
