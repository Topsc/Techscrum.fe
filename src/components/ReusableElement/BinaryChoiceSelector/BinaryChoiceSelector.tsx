import React from 'react';
import styles from './BinaryChoiceSelector.module.scss';

interface IBinaryChoiceSelectorProps {
  onChange: (value: boolean) => void;
  name: string;
  value: boolean;
  isResetHanlderForOptionYes?: boolean;
  handleResetStates?: () => void;
}
export default function BinaryChoiceSelector({
  onChange,
  name,
  value,
  handleResetStates,
  isResetHanlderForOptionYes
}: IBinaryChoiceSelectorProps) {
  return (
    <div data-testid={`dailyscrum-ticket-binary-input-group-${name}`}>
      <label htmlFor={`${name}-yes`} className={styles.radioLabel}>
        <input
          type="radio"
          name={name}
          id={`${name}-yes`}
          checked={!!value}
          onChange={() => {
            onChange(true);
            if (handleResetStates && isResetHanlderForOptionYes) {
              handleResetStates();
            }
          }}
        />
        Yes
      </label>
      <label htmlFor={`${name}-no`} className={styles.radioLabel}>
        <input
          type="radio"
          name={name}
          id={`${name}-no`}
          checked={!value}
          onChange={() => {
            onChange(false);
            if (handleResetStates && !isResetHanlderForOptionYes) {
              handleResetStates();
            }
          }}
        />
        No
      </label>
    </div>
  );
}

BinaryChoiceSelector.defaultProps = {
  handleResetStates: () => {},
  isResetHanlderForOptionYes: true
};
