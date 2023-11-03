import React, { useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ProjectContext } from '../../../context/ProjectProvider';
import { IProjectData } from '../../../types';
import styles from './HeaderNav.module.scss';

export default function HeaderNav() {
  const projectList = useContext(ProjectContext);
  const { projectId = '' } = useParams();
  const currentProject: IProjectData[] = projectList.filter(
    (project: IProjectData) => project.id === projectId
  );

  const currentUrl = window.location.pathname;

  if (!currentProject || !currentProject[0]) {
    return null;
  }
  return (
    <div>
      <nav className={styles.navLayout}>
        <ol>
          <li>
            <NavLink to="/projects" className="none">
              <span>Projects</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={currentUrl} className="none">
              <span>{currentProject[0].name}</span>
            </NavLink>
          </li>
        </ol>
      </nav>
    </div>
  );
}
