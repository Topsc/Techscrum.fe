/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import styles from './PhotoGallery.module.scss';

interface IPhotoGallery {
  photoData: any;
  removeAttachment: (url: string) => void;
  isDisabled?: boolean;
}

export default function PhotoGallery(props: IPhotoGallery) {
  const { photoData, removeAttachment, isDisabled } = props;
  const [showImage, setShowImage] = useState(false);
  const [showImageURL, setShowImageUrl] = useState('');
  return (
    <>
      <div className={[styles.photoContainer, 'flex'].join(' ')}>
        {photoData.map((item: any) => {
          return (
            <React.Fragment key={item}>
              <button
                type="button"
                onClick={() => {
                  setShowImage(true);
                  setShowImageUrl(item);
                }}
                className={styles.thumbnailImageContainer}
              >
                <img src={item} alt="upload" className={styles.thumbnailImage} />
              </button>
              {!isDisabled && (
                <button
                  type="button"
                  onClick={() => {
                    removeAttachment(item);
                  }}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {showImage && (
        <div
          className={styles.imageContainer}
          onClick={() => {
            setShowImage(false);
            setShowImageUrl('');
          }}
        >
          <button
            type="button"
            onClick={() => {
              setShowImage(false);
              setShowImageUrl('');
            }}
            className={styles.backgroundNone}
          >
            <svg viewBox="0 0 24 24" role="presentation" className={styles.closeBtn}>
              <path
                d="M12 10.586L6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 001.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414L12 10.586z"
                fill="currentColor"
              />
            </svg>
          </button>
          <img src={showImageURL} alt="upload" className={styles.fullImage} />
        </div>
      )}
    </>
  );
}

PhotoGallery.defaultProps = {
  isDisabled: false
};
