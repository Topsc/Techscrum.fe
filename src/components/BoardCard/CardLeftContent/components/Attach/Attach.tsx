import React from 'react';
import { ImAttachment } from 'react-icons/im';
import styles from './Attach.module.scss';

interface IPropsAttach {
  onChangeAttachment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function Attach(props: IPropsAttach) {
  const { placeholder, onChangeAttachment } = props;
  return (
    <div className={styles.attachButton}>
      <label htmlFor="uploadPhoto">
        <ImAttachment className={styles.attachIcon} />
        <span>{placeholder}</span>
        <input id="uploadPhoto" type="file" name="Upload a photo" onChange={onChangeAttachment} />
      </label>
    </div>
  );
}

Attach.defaultProps = {
  placeholder: 'Attach'
};
