/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { MentionData } from '@draft-js-plugins/mention';
import {
  createComment,
  getComment,
  deleteComment,
  updateComment
} from '../../../../../api/comment/comment';
import { getUsers } from '../../../../../api/user/user';
import {
  ICommentData,
  ICommentItemData,
  IActivityData,
  IActivityItemData
} from '../../../../../types';
import checkAccess from '../../../../../utils/helpers';
import CommentItem from './components/CommentItem/CommentItem';
import Editor from './components/Editor/Editor';
import style from './LeftBottom.module.scss';
import ActivityItem from './components/ActivityItem/ActivityItem';
import { getActivity } from '../../../../../api/activity/activity';

interface ILeftBottom {
  userId?: string;
  taskId?: string;
  userEmail?: string;
  projectId: string;
}
export default function LeftBottom(props: ILeftBottom) {
  const { userId = '', taskId = '', userEmail = '', projectId } = props;
  const [comments, setComments] = useState([]);
  const [saveState, setSaveState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<MentionData[]>([]);
  const [activities, setActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const [showComments, setShowComments] = useState(true);

  const fetchCommentsData = () => {
    async function fetchData() {
      await getComment().then((data: ICommentData) => {
        const result = data.data.reverse();
        setComments(result);
      });
    }
    fetchData();
  };

  const onClickDelete = async (id: string) => {
    await deleteComment(id);
    setDeleteState(true);
  };

  const onClickUpdate = async (id: string, commentContent: string) => {
    await updateComment(id, commentContent);
    setUpdateState(true);
  };

  const onClickPublish = async (content) => {
    setSubmitting(true);
    await createComment({ taskId, senderId: userId, content });
    setSaveState(true);
    setSubmitting(false);
  };

  const fetchActivityData = () => {
    async function fetchData() {
      await getActivity(taskId).then((data: IActivityData) => {
        const result = data.data;
        setActivities(result);
      });
    }
    fetchData();
  };

  const onActivityClick = () => {
    setShowActivities(true);
    setShowComments(false);
  };

  const onCommentClick = () => {
    setShowActivities(false);
    setShowComments(true);
  };

  useEffect(() => {
    if (showActivities) {
      fetchActivityData();
    }
  }, [showActivities]);

  useEffect(() => {
    if (isLoading) {
      fetchCommentsData();
      setIsLoading(false);
    }
    if (saveState) {
      fetchCommentsData();
      setSaveState(false);
    }

    if (deleteState) {
      fetchCommentsData();
      setDeleteState(false);
    }
    if (updateState) {
      fetchCommentsData();
      setUpdateState(false);
    }
  }, [isLoading, saveState, deleteState, updateState]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      if (Array.isArray(res.data)) {
        const usersArray = res.data.map((item) => {
          return {
            name: item.name,
            avatar: item.avatarIcon
          };
        });
        setUsers(usersArray);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.activity}>
        <div className={style.showCommentButton}>
          <button
            type="button"
            className={`${style.switchButton} ${
              showComments ? style.showContents : style.hideContents
            }`}
            onClick={onCommentClick}
            data-testid="show-comment-button"
          >
            Comments
          </button>
          <button
            type="button"
            className={`${style.switchButton} ${
              showActivities ? style.showContents : style.hideContents
            }`}
            onClick={onActivityClick}
            data-testid="show-activity-button"
          >
            Activities
          </button>
        </div>
        {showActivities ? (
          activities.map((item: IActivityItemData) => {
            if (item.taskId === taskId) {
              return (
                <ActivityItem
                  key={item.id}
                  id={item.id}
                  userId={item.userId}
                  operation={item.operation}
                  createdAt={item.createdAt}
                />
              );
            }
            return null;
          })
        ) : (
          <br />
        )}
      </div>
      {checkAccess('edit:tasks', projectId) && showComments && (
        <div>
          <div className={style.commentInputField}>
            <Editor
              submitting={submitting}
              onClickPublish={onClickPublish}
              users={users}
              imageInputId="insertImage"
            />
          </div>
        </div>
      )}
      {showComments &&
        comments.map((item: ICommentItemData) => {
          if (item.taskId === taskId) {
            return (
              <CommentItem
                key={item.id}
                content={item.content}
                id={item.id}
                senderId={item.senderId}
                updatedAt={item.updatedAt}
                onClickDelete={onClickDelete}
                onClickUpdate={onClickUpdate}
                userEmail={userEmail}
                users={users}
                submitting={submitting}
              />
            );
          }
          return null;
        })}
    </div>
  );
}

LeftBottom.defaultProps = {
  taskId: undefined,
  userId: undefined,
  userEmail: undefined
};
