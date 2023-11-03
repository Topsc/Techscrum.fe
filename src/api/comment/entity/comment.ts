export interface CreateComment {
  taskId: string;

  senderId: string;

  content: string;
}

export interface UpdateComment {
  commitId: string;

  content: string;
}
