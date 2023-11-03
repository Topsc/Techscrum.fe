import React, { useState } from 'react';
import styles from './ChangeIcon.module.scss';
import ChangeIconModal from './Modal/ChangeIconModal';

interface IChangeIconProps {
  uploadSuccess: (data: any) => void;
  value: string;
  loading?: boolean;
}

export default function ChangeIcon(props: IChangeIconProps) {
  const { uploadSuccess, value, loading = false } = props;
  const [modalShown, toggleModal] = useState(false);

  if (loading) {
    return (
      <div className={(styles.icon, styles.changeIconContainer)}>
        <div className={styles.skeletonImg} />
      </div>
    );
  }

  return (
    <div className={(styles.icon, styles.changeIconContainer)}>
      <img
        className={styles.profileImg}
        src={
          value ||
          'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10411?size=xxlarge'
        }
        alt="project icon"
      />
      <button
        type="button"
        data-testid="iconButton"
        className={styles.uploadImgBtn}
        onClick={() => {
          toggleModal(!modalShown);
        }}
      >
        Change
      </button>
      <ChangeIconModal
        shown={modalShown}
        close={() => {
          toggleModal(false);
        }}
        uploadSuccess={(data) => {
          toggleModal(!modalShown);
          uploadSuccess(data);
        }}
      />
    </div>
  );
}

ChangeIcon.defaultProps = {
  loading: false
};
