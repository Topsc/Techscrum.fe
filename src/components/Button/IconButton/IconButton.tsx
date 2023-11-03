import React from 'react';
import styles from './IconButton.module.scss';

interface IIconButton {
  taskId?: string;
  icon: React.ReactNode;
  tooltip: string;
  overrideStyle?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export default function IconButton({ icon, tooltip, overrideStyle, onClick, taskId }: IIconButton) {
  return (
    <button
      className={[styles.iconButton, overrideStyle].join(' ')}
      onClick={onClick}
      data-testid={'task-edit-btn-'.concat(taskId as string)}
    >
      {icon}
      <span className={styles.tooltip}>{tooltip}</span>
    </button>
  );
}

IconButton.defaultProps = {
  taskId: '',
  overrideStyle: '',
  onClick: () => {}
};
