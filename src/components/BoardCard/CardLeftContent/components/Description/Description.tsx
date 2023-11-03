import React from 'react';
import { ITaskEntity } from '../../../../../types';
import style from './Description.module.scss';

interface Props {
  taskInfo: ITaskEntity;
  focusEventHandler: () => void;
  isDisabled: boolean;
  onChangeDesc: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string | undefined;
}

export default function Description({
  taskInfo,
  focusEventHandler,
  isDisabled,
  value = '',
  onChangeDesc
}: Props) {
  return (
    <div className={style.container}>
      <h2 className={style.description}>Description</h2>
      <textarea
        name="description"
        id="description"
        cols={80}
        rows={12}
        placeholder="Add a description..."
        defaultValue={taskInfo.description}
        onFocus={focusEventHandler}
        disabled={isDisabled}
        value={value}
        onChange={onChangeDesc}
      />
    </div>
  );
}
