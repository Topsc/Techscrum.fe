import React, { useState } from 'react';
import { MentionData } from '@draft-js-plugins/mention';
import style from './CommentItem.module.scss';
import Edit from '../Editor/Editor';

interface ICommentItem {
  content: string;
  id: string;
  senderId: {
    email: string;
    createAt: string;
    id: string;
    updatedAt: string;
    name: string;
    avatarIcon: string;
  };
  updatedAt: Date;
  onClickDelete: (id: string) => void;
  onClickUpdate: (id: string, commentContent: string) => void;
  userEmail: string;
  users: MentionData[];
  submitting: boolean;
}
const monthShortNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const dateWithTimestamp = (d: Date | null) => {
  if (d != null) {
    const date = d.toString().split('T')[0];
    const dateDataArray = date.split('-');
    const time = d.toString().split('T')[1].split(':');
    const hour = Number(time[0]);
    time[0] = hour > 12 ? `${hour - 12}` : `${hour}`;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${monthShortNames[Number(dateDataArray[1]) - 1]} ${dateDataArray[2]}, ${
      dateDataArray[0]
    } at ${time[0]}:${time[1]} ${period}`;
  }
  return '';
};

export default function CommentItem(props: ICommentItem) {
  const {
    content,
    id,
    senderId,
    updatedAt,
    onClickDelete,
    onClickUpdate,
    userEmail,
    users,
    submitting
  } = props;

  const [readOnly, setReadOnly] = useState(true);

  const handelOnClickDelete = () => {
    onClickDelete(id);
  };

  const onClickPublish = (comment) => {
    setReadOnly(true);
    onClickUpdate(id, comment);
  };

  return (
    <div className={style.container}>
      <img className={style.avatar} src={senderId.avatarIcon} alt={senderId.avatarIcon} />
      <div className={style.commentLayout}>
        <div className={style.commentTitle}>
          <span>{senderId?.name}</span>
          <span>{dateWithTimestamp(updatedAt)}</span>
        </div>
        <div className={style.commentBody}>
          <Edit
            submitting={submitting}
            content={content}
            readOnly={readOnly}
            onClickPublish={onClickPublish}
            onClickDiscard={() => {
              setReadOnly(true);
            }}
            users={users}
            imageInputId={id}
          />
        </div>
        <div
          className={
            userEmail === senderId.email ? style.commentButtons : style.commentButtonsBlocked
          }
        >
          {readOnly && (
            <>
              <button
                type="button"
                className={style.edit}
                onClick={() => {
                  setReadOnly(false);
                }}
              >
                Edit
              </button>
              <button type="button" className={style.delete} onClick={handelOnClickDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
