/* eslint-disable no-unsafe-finally */
import React from 'react';
import { createLabel, removeLabel } from '../../../api/label/label';
import { ILabelData } from '../../../types';
import MultiSelectDropdownV2 from '../../FormV2/MultiSelectDropdownV2/MultiSelectDropdownV2';

interface IPropsLabel {
  taskInfo: any;
  isDisabled: boolean;
  updateTaskTags: (tags: ILabelData[] | undefined) => void;
}

export default function LabelFieldsV2(props: IPropsLabel) {
  const { taskInfo, isDisabled, updateTaskTags } = props;

  const removeLabelFromList = async (label: any) => {
    if (!taskInfo.id || !label.id) {
      return;
    }
    try {
      await removeLabel(taskInfo.id, label.id);
    } finally {
      if (!taskInfo.tags) {
        return;
      }
      const filteredLabelList = taskInfo.tags.filter((item) => item.name !== label.name);
      updateTaskTags(filteredLabelList);
    }
  };

  const onClickSave = async (label: string) => {
    if (!taskInfo.id) {
      return;
    }
    await createLabel(taskInfo.id, {
      name: label,
      slug: label.replace(' ', '-')
    });
  };

  return (
    <MultiSelectDropdownV2
      label="Labels (WIP)"
      name="labels"
      onValueChanged={() => {
        //   addLabelToSelectedTaskLabelList(label);
        //   setInputLabel('');
        //   onClickSave(label.name ?? '');
      }}
      options={taskInfo?.tags || []}
      onLabelDelete={removeLabelFromList}
      onLabelAdd={onClickSave}
      isDisabled={isDisabled}
    />
  );
}
