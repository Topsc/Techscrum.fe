import React from 'react';
import style from './Activity.module.scss';

interface ICommentItem {
  id: string;
  userId: {
    email: string;
    createAt: string;
    id: string;
    updatedAt: string;
    name: string;
    avatarIcon: string;
  };
  operation: string;
  createdAt: Date;
}

const dateHandler = (fullDate) => {
  const monthObj = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  };
  const date = new Date(fullDate);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? monthObj[`0${date.getMonth() + 1}`]
      : monthObj[`${date.getMonth() + 1}`];
  const day = date.getDate();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${month} ${day}, ${year} at ${hour}:${minute}`;
};

export default function ActivityItem(props: ICommentItem) {
  const { id, userId, operation, createdAt } = props;
  return (
    <div id={id} className={style.container} data-testid={`activity-item-${id}`}>
      <div className={style.userContainer}>
        <img className={style.avatar} src={userId.avatarIcon} alt={userId.avatarIcon} />
        <p>{userId.name}</p>
      </div>
      <div>
        <p>
          {operation} {dateHandler(createdAt)}
        </p>
      </div>
    </div>
  );
}
