import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import styles from './ProjectsDropdownNav.module.scss';
import { ProjectContext } from '../../../../context/ProjectProvider';
import { IProjectData } from '../../../../types';

interface IProjectsDropdown {
  setShowProjectDropdown: (state: boolean) => void;
}
function ProjectsDropdown({ setShowProjectDropdown }: IProjectsDropdown) {
  const navigate = useNavigate();
  const projectList = useContext(ProjectContext);
  const handleClickEvent = (e: React.MouseEvent<HTMLSpanElement>, project: IProjectData) => {
    e.preventDefault();
    navigate(`/projects/${project.id}/board/${project.boardId}`);
    setShowProjectDropdown(false);
  };
  return (
    <div className={styles.dropdownSection} data-testid="project-dropdown">
      <div className={styles.dropdownContainer}>
        <div className={styles.top}>
          <div className={styles.recent}>RECENT</div>
          {projectList.slice(0, 2).map((project) => (
            <Link to="/projects/" onClick={(e) => handleClickEvent(e, project)} key={project.id}>
              <span className={styles.iconSection}>
                <img
                  src={
                    project.iconUrl ||
                    'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10418?size=small'
                  }
                  alt="icon"
                />
              </span>
              <span className={styles.titleContent}>
                <span className={styles.name}>{project.name}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className={styles.bottom}>
          <Link to="/projects">
            <span>View all projects</span>
          </Link>
          <Link to="/create-projects">
            <span>Create project</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsDropdownNav({ setShowProjectDropdown }: IProjectsDropdown) {
  return (
    <>
      {ReactDOM.createPortal(
        <ProjectsDropdown setShowProjectDropdown={setShowProjectDropdown} />,
        document.getElementById('projectDropdownNav') as Element
      )}
    </>
  );
}
