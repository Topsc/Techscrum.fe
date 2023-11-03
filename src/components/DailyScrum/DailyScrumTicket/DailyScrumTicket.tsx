import React, { useCallback } from 'react';
import styles from './DailyScrumTicket.module.scss';
import BinaryChoiceSelector from '../../ReusableElement/BinaryChoiceSelector/BinaryChoiceSelector';
import SupportTypeSelector from '../SupportTypeSelector/SupportTypeSelector';

enum UpdateDailyScrumTicketParamKey {
  PROGRESS = 'progress',
  IS_CAN_FINISH = 'isCanFinish',
  IS_NEED_SUPPORT = 'isNeedSupport',
  SUPPORT_TYPE = 'supportType',
  OTHER_SUPPORT_DESC = 'otherSupportDesc'
}

enum SupportType {
  NO_SUPPORT,
  TECHNICAL,
  REQUIREMENT,
  DEPENDENCY,
  OTHER
}

interface IDailyScrumTicketProps {
  id: string;
  title: string;
  progress: { timeStamp: number; value: number };
  isCanfinish: boolean;
  isNeedSupport: boolean;
  supportType: SupportType;
  projectKey: string;
  otherSupportDesc?: string;
  updateDailyScrumTicket: (
    key: UpdateDailyScrumTicketParamKey
  ) => (value: number | string | boolean | object) => void;
  errMsg?: string;
}

function DailyScrumTicket({
  id,
  title,
  progress,
  isCanfinish,
  isNeedSupport,
  supportType,
  projectKey,
  otherSupportDesc,
  errMsg,
  updateDailyScrumTicket
}: IDailyScrumTicketProps) {
  const handleResetStates = useCallback(
    (states: Array<UpdateDailyScrumTicketParamKey>) => () => {
      return states.forEach((state) => {
        if (state === UpdateDailyScrumTicketParamKey.IS_NEED_SUPPORT) {
          updateDailyScrumTicket(state)(false);
        }

        if (state === UpdateDailyScrumTicketParamKey.SUPPORT_TYPE) {
          updateDailyScrumTicket(state)(0);
        }

        if (state === UpdateDailyScrumTicketParamKey.OTHER_SUPPORT_DESC) {
          updateDailyScrumTicket(state)('');
        }
      });
    },
    [updateDailyScrumTicket]
  );

  return (
    <div className={styles.dailyScrumTicket} data-testid="dailyscrum-ticket">
      <p className={styles.ticketTitle} data-testid="dailyscrum-ticket-title">
        {projectKey} - {title}
      </p>
      {errMsg && <p>{errMsg}</p>}
      <div className={styles.progress}>
        <p>Progress</p>
        <div className={styles.progressRange}>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            defaultValue={progress?.value}
            onChange={(e) => {
              updateDailyScrumTicket(UpdateDailyScrumTicketParamKey.PROGRESS)({
                timeStamp: new Date().getTime(),
                value: e.target.valueAsNumber
              });
            }}
            data-testid="dailyscrum-ticket-progress-bar"
          />
          <p data-testid="dailyscrum-ticket-progress-description">
            {progress?.value}% - {new Date(progress?.timeStamp).toLocaleString()}
          </p>
        </div>
      </div>
      <div className={styles.finish}>
        <p>Can you finish this ticket by sprint end?</p>
        <BinaryChoiceSelector
          name={`isCanFinish-${id}`}
          onChange={updateDailyScrumTicket(UpdateDailyScrumTicketParamKey.IS_CAN_FINISH)}
          handleResetStates={handleResetStates([
            UpdateDailyScrumTicketParamKey.IS_NEED_SUPPORT,
            UpdateDailyScrumTicketParamKey.SUPPORT_TYPE,
            UpdateDailyScrumTicketParamKey.OTHER_SUPPORT_DESC
          ])}
          isResetHanlderForOptionYes
          value={isCanfinish}
        />
      </div>
      {!isCanfinish ? (
        <div className={styles.support}>
          <p>Do you need support to complete this ticket?</p>
          <BinaryChoiceSelector
            name={`isNeedSupport-${id}`}
            onChange={updateDailyScrumTicket(UpdateDailyScrumTicketParamKey.IS_NEED_SUPPORT)}
            handleResetStates={handleResetStates([
              UpdateDailyScrumTicketParamKey.SUPPORT_TYPE,
              UpdateDailyScrumTicketParamKey.OTHER_SUPPORT_DESC
            ])}
            isResetHanlderForOptionYes={false}
            value={isNeedSupport}
          />
          {isNeedSupport ? (
            <SupportTypeSelector
              supportType={supportType}
              name={`supportType-${id}`}
              onChange={updateDailyScrumTicket(UpdateDailyScrumTicketParamKey.SUPPORT_TYPE)}
              otherSupportDesc={otherSupportDesc}
              editOtherSupportDesc={updateDailyScrumTicket(
                UpdateDailyScrumTicketParamKey.OTHER_SUPPORT_DESC
              )}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(DailyScrumTicket);

DailyScrumTicket.defaultProps = {
  otherSupportDesc: '',
  errMsg: ''
};
