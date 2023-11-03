import React from 'react';

import { IProjectData } from '../../../types';
import styles from './NavTop.module.scss';

interface IPropsNavTop {
  currentProject: IProjectData;
}

export default function NavTop(props: IPropsNavTop) {
  const { currentProject } = props;
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
        <div className={styles.textContext}>
          <h2 className={styles.clearMargin}>{currentProject.name}</h2>
          <span>Software project</span>
        </div>
      </div>
    </div>
  );
}
