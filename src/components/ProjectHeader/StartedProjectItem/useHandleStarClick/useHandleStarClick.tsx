import React, { useState } from 'react';
import { updateProject } from '../../../../api/projects/projects';

export default function useHandleStarClick(projectId: string) {
  const [isStarred, ToggleStar] = useState(true);

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token') ?? '';
    return token;
  };

  const handleStarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    ToggleStar(!isStarred);
    if (isStarred) {
      updateProject(projectId, { star: false }, getAuthToken());
    } else {
      updateProject(projectId, { star: true }, getAuthToken());
    }
  };

  return [isStarred, handleStarClick] as const;
}
