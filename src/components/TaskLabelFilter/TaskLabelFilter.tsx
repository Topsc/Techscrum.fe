import React, { useContext } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import styles from './TaskLabelFilter.module.scss';
import LabelOption from './LabelOption';
import { LabelContext } from '../../context/LabelProvider';
import { ILabelData } from '../../types';
import useOutsideAlerter from '../../hooks/OutsideAlerter';

interface Props {
  selectedLabels: ILabelData[];
  setSelectedLabels: React.Dispatch<React.SetStateAction<ILabelData[]>>;
}
export default function TaskLabelFilter({ selectedLabels, setSelectedLabels }: Props) {
  const labelsCollection = useContext(LabelContext);
  const { visible, setVisible, myRef } = useOutsideAlerter(false);

  const showOptions = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div className={styles.filterTab} ref={myRef}>
      <button
        className={visible ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
        onClick={showOptions}
        data-testid="labelsTab"
      >
        Label:
        {selectedLabels.length > 0 && <span className={styles.badge}>{selectedLabels.length}</span>}
        <BiChevronDown className={styles.filterBtnIcon} />
      </button>

      <div
        className={visible ? `${styles.optionsBox} ${styles.active}` : styles.optionsBox}
        data-testid="labelOptions"
      >
        {labelsCollection.map((label) => (
          <LabelOption
            key={label.id}
            label={label}
            selectedLabels={selectedLabels}
            setSelectedLabels={setSelectedLabels}
          />
        ))}
      </div>
    </div>
  );
}
