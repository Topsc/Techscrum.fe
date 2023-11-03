import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import Calendar from '@atlaskit/calendar';
import styles from './DailyScrum.module.scss';
import { getDailyScrums, updateDailyScrum } from '../../api/dailyScrum/dailyScrum';
import { UserContext } from '../../context/UserInfoProvider';
import Modal from '../../lib/Modal/Modal';
import { dateFormatter, urlParamExtractor } from '../../utils/helpers';
import { IUserInfo, IDailyScrumTicket } from '../../types';
import DailyScrumTicket from './DailyScrumTicket/DailyScrumTicket';

interface IDailyScrumModal {
  onClickCloseModal: () => void;
  projectId: string;
}

// id is required but any other properties of IDailyScrumTicket are optional
type IDailyScrumTicketUpdate = Partial<IDailyScrumTicket> & { id: string };

enum DailyScrumTicketsActionType {
  UPDATE_ONE_TICKET = 'UPDATE_ONE_TICKET',
  GET_ALL_TICKETS = 'GET_ALL_TICKET'
}

enum UpdateDailyScrumTicketParamKey {
  PROGRESS = 'progress',
  IS_CAN_FINISH = 'isCanFinish',
  IS_NEED_SUPPORT = 'isNeedSupport',
  SUPPORT_TYPE = 'supportType',
  OTHER_SUPPORT_DESC = 'otherSupportDesc',
  ERR_MSG = 'errMsg'
}

interface IDailyScrumTicketsAction {
  type: DailyScrumTicketsActionType;
  payload: IDailyScrumTicketUpdate | IDailyScrumTicket[];
}

const initialDailyScrumTickets: IDailyScrumTicket[] = [];

const dailyScrumTicketsReducer = (state: IDailyScrumTicket[], action: IDailyScrumTicketsAction) => {
  switch (action.type) {
    case DailyScrumTicketsActionType.GET_ALL_TICKETS:
      return [...state, ...(action.payload as IDailyScrumTicket[])];

    case DailyScrumTicketsActionType.UPDATE_ONE_TICKET:
      return state.map((ticket: IDailyScrumTicket) =>
        ticket.id === (action.payload as IDailyScrumTicketUpdate).id
          ? { ...ticket, ...action.payload }
          : { ...ticket }
      );

    default:
      return [...state];
  }
};

function DailyScrumModal({ onClickCloseModal, projectId }: IDailyScrumModal): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [dailyScrumTickets, dispatch] = useReducer(
    dailyScrumTicketsReducer,
    initialDailyScrumTickets
  );

  const { id: userId }: IUserInfo = useContext(UserContext);

  const CURRENT_DATE = useMemo(() => {
    return new Date();
  }, []);

  const LAST_DAY_OF_YEAR = useMemo(() => {
    const lastDay = new Date(new Date().getFullYear(), 11, 31);
    const lastDayISOString = dateFormatter(lastDay, { isToISO: true });
    return lastDayISOString;
  }, []);

  const SPRINT_END_DATE = useMemo(() => {
    return new Date('2023-03-31');
  }, []);

  const sprintData = useMemo(() => {
    const timeDiff = SPRINT_END_DATE.getTime() - CURRENT_DATE.getTime();
    const diffOfDays = Math.round(timeDiff / 1000 / 60 / 60 / 24);
    const obj: { value: number; style: 'Safe' | 'Caution' | 'Danger' } = {
      value: diffOfDays,
      style: 'Safe'
    };

    if (diffOfDays <= 3) {
      obj.style = 'Caution';
    }
    if (diffOfDays <= 1) {
      obj.style = 'Danger';
    }
    if (timeDiff <= 0) {
      obj.value = 0;
      obj.style = 'Danger';
    }
    return obj;
  }, [CURRENT_DATE, SPRINT_END_DATE]);

  useEffect(() => {
    (async () => {
      try {
        const results = await getDailyScrums(projectId, userId as string);

        if (results.length === 0) {
          toast('No dailyScrum data for now!', { theme: 'colored', toastId: 'dailyScrum error' });
        }

        dispatch({ type: DailyScrumTicketsActionType.GET_ALL_TICKETS, payload: results });
      } catch (e: unknown) {
        toast.error('Failed to get dailyScrum data!', {
          theme: 'colored',
          toastId: 'dailyScrum error'
        });
      }
    })();
  }, [projectId, userId]);

  const updateDailyScrumTicket = useCallback(
    (id: string) =>
      (key: UpdateDailyScrumTicketParamKey) =>
      (value: number | string | boolean | object) => {
        return dispatch({
          type: DailyScrumTicketsActionType.UPDATE_ONE_TICKET,
          payload: {
            id,
            [key]: value
          }
        });
      },
    []
  );

  const onHandleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const promises = dailyScrumTickets.map(
      ({ progress, isCanFinish, isNeedSupport, supportType, id, otherSupportDesc }) => {
        return updateDailyScrum(projectId, id, {
          progress,
          isCanFinish,
          isNeedSupport,
          supportType,
          otherSupportDesc
        });
      }
    );

    try {
      const results: PromiseSettledResult<AxiosResponse<any, any>>[] = await Promise.allSettled(
        promises
      );

      if (results.every(({ status }) => status === 'fulfilled')) {
        toast.success('Submit successful!', {
          theme: 'colored',
          className: 'primaryColorBackground',
          toastId: 'dailyScrum success'
        });

        onClickCloseModal();
        setIsSubmitting(false);
      } else if (results.every(({ status }) => status === 'rejected')) {
        toast.error('Temporarily server error, please try again later!', {
          theme: 'colored',
          toastId: 'dailyScrum error'
        });
      } else {
        // status & reason for rejected result
        const failedResults: any = results.filter((result) => result.status === 'rejected');

        const failedResultsSimplified = failedResults.map((result: any) => ({
          id: urlParamExtractor(result?.reason?.config?.url, 'dailyScrums'),
          errCode: result?.reason?.response?.status,
          errMsg:
            result?.reason?.response?.data?.errors?.errors?.[0]?.msg ?? // handles validation error
            result?.reason?.response?.data?.error?.msg ?? // handles customised error
            result?.reason?.response?.data?.toString() ?? // handles other axios error
            'unknown error' // default error
        }));

        failedResultsSimplified.forEach(
          ({ id, errMsg }: { id: string; errMsg: string; errCode: number }) => {
            updateDailyScrumTicket(id)(UpdateDailyScrumTicketParamKey.ERR_MSG)(errMsg);
          }
        );
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error('Temporarily server error, please try again later!', {
        theme: 'colored',
        toastId: 'dailyScrum error'
      });
    }
  };
  return (
    <div className={styles.dailyScrumContainer}>
      <div className={styles.dailyScrumHeader}>
        <h2 data-testid="dailyscrum-header">Daily Log</h2>
        <button
          className={styles.closeBtn}
          onClick={onClickCloseModal}
          data-testid="dailyscrum-close"
        >
          <AiOutlineClose />
        </button>
      </div>
      <form onSubmit={onHandleSubmit}>
        <div className={styles.dailyScrumContent}>
          <div>
            <Calendar
              maxDate={LAST_DAY_OF_YEAR}
              defaultMonth={CURRENT_DATE.getMonth() + 1}
              defaultYear={CURRENT_DATE.getFullYear()}
              testId="calendar"
            />
            <h4>
              Today: <span>{dateFormatter()}</span>
            </h4>
            <h4>
              Sprint Ends:
              <span>
                {dateFormatter(SPRINT_END_DATE)}
                <span
                  className={[styles.dayDiffText, styles[`dayDiffText${sprintData?.style}`]].join(
                    ' '
                  )}
                >
                  {sprintData?.value} days left
                </span>
              </span>
            </h4>
          </div>

          <div className={styles.dailyScrumTicketsListWrapper}>
            <p data-testid="dailyscrum-total-number-of-ticktes">
              You currently have {dailyScrumTickets.length} dailyScrum(s)
            </p>
            {dailyScrumTickets.map(
              ({
                id,
                title,
                progress,
                isCanFinish,
                isNeedSupport,
                supportType,
                project,
                otherSupportDesc,
                errMsg
              }) => {
                return (
                  <DailyScrumTicket
                    key={id}
                    id={id}
                    title={title}
                    projectKey={project.key}
                    progress={progress}
                    isCanfinish={isCanFinish}
                    isNeedSupport={isNeedSupport}
                    supportType={supportType}
                    otherSupportDesc={otherSupportDesc}
                    updateDailyScrumTicket={updateDailyScrumTicket(id)}
                    errMsg={errMsg}
                  />
                );
              }
            )}
          </div>
        </div>

        <div className={styles.btnContainer}>
          <button
            className={styles.cancelBtn}
            type="button"
            onClick={onClickCloseModal}
            data-testid="dailyscrum-cancel"
          >
            Cancel
          </button>
          <input
            className={styles.submitBtn}
            disabled={isSubmitting}
            type="submit"
            data-testid="dailyscrum-submit"
            value="Submit"
          />
        </div>
      </form>
    </div>
  );
}

interface IDailyScrum {
  onClickCloseModal: () => void;
  projectId: string;
}
export default function DailyScrum({ onClickCloseModal, projectId }: IDailyScrum) {
  return (
    <>
      {ReactDOM.createPortal(
        <Modal classesName={styles.dailyScrumModal}>
          <DailyScrumModal onClickCloseModal={onClickCloseModal} projectId={projectId} />
        </Modal>,
        document.getElementById('root') as Element
      )}
    </>
  );
}
