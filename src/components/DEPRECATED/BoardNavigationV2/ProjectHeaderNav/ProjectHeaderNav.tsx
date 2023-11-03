import React, { useState } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai';
import styles from './ProjectHeaderNav.module.scss';
import ProjectsDropdownNav from '../ProjectsDropdownNav/ProjectsDropdownNav';
import { IProjectData } from '../../../../types';

interface IPropsNavTop {
  currentProject: IProjectData;
}

export default function ProjectHeaderNav(props: IPropsNavTop) {
  const { currentProject } = props;
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  if (!currentProject) {
    return <></>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img
          src={
            currentProject.iconUrl ||
            'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10411?size=xxlarge'
          }
          alt="img"
        />
        <div className={styles.projectInfo}>
          <h2 className={styles.clearMargin}>{currentProject.name}</h2>
          <button
            onClick={() => {
              setShowProjectDropdown(!showProjectDropdown);
            }}
            data-testid="show-project-dropdown-btn"
          >
            {showProjectDropdown ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}
            <span>Software project</span>
          </button>
          {showProjectDropdown && (
            <ProjectsDropdownNav setShowProjectDropdown={setShowProjectDropdown} />
          )}
        </div>
      </div>
    </div>
  );
}
