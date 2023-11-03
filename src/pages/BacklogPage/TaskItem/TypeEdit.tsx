import React, { useContext } from 'react';
import styles from './TypeEdit.module.scss';
import { TaskTypesContext } from '../../../context/TaskTypeProvider';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';

export type SelectOption = {
  id: string;
  name: string;
  icon: string;
};

type SelectProps = {
  taskId: string;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
  updateTaskType: (newTypeId: string) => Promise<void>;
};

export default function TypeEdit({ taskId, value, onChange, updateTaskType }: SelectProps) {
  const taskTypes = useContext(TaskTypesContext);
  const { visible, setVisible, myRef } = useOutsideAlerter(false);

  function selectOption(option: SelectOption) {
    onChange(option);
  }

  const options = taskTypes.map((e: SelectOption) => ({
    id: e.id,
    name: e.name,
    icon: e.icon
  }));

  return (
    <div
      className={styles.container}
      role="button"
      tabIndex={0}
      onClick={() => setVisible((prev) => !prev)}
      onKeyDown={(e) => e.key === 'Enter' && setVisible((prev) => !prev)}
      data-testid={`types-btn-${taskId}`}
      ref={myRef}
    >
      <img
        src={value?.icon}
        alt={value?.name}
        className={styles.currentIcon}
        data-testid={`current-icon-${taskId}`}
      />
      <div className={`${styles.options} ${visible ? styles.show : ''}`}>
        {options
          .filter((e) => e.name !== value?.name)
          .map((option) => (
            <button
              className={styles.option}
              key={option.name}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setVisible(false);
                updateTaskType(option.id);
              }}
              data-testid={`${option.name}-btn-${taskId}`}
            >
              <img src={option.icon} className={styles.icon} alt={option.name} />
              <span className={styles.name}>{option.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

TypeEdit.defaultProps = {
  value: {
    id: '',
    name: '',
    icon: ''
  }
};
