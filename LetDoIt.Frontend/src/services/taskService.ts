import api from './api';

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string; // ISO string format
  priority: number; // 1=Low, 2=Medium, 3=High, 4=Urgent
}

export interface TaskResponse {
  taskId: string;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  userId: string;
  createdAt: string;
  isCompleted: boolean;
  columnId?: string; // Add columnId
  visibility: number; // 1 = Private, 2 = Public
}



export const createTask = async (taskData: CreateTaskRequest) => {
  return await api.post('/task/CreateTask', taskData);
};

export const getMyTasks = async () => {
  return await api.get<TaskResponse[]>('/task/GetMyTask');
};

export const getTasksByUserId = async (userId: string) => {
  return await api.get<TaskResponse[]>(`/task/GetTasksByUserId?userId=${userId}`);
};

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: number;
  isCompleted?: boolean;
  visibility?: number;
}

export const updateTask = async (taskId: string, taskData: UpdateTaskRequest) => {
  return await api.put(`/task/UpdateTask/${taskId}`, taskData);
}

export const deleteTask = async (taskId: string) => {
  return await api.delete(`/task/DeleteTask/${taskId}`);
}

export const moveTask = async (taskId: string, newColumnId: string) => {
  return await api.put(`/task/MoveTask/${taskId}`, {
    newColumnId: newColumnId
  });
}

export const getTasksByDueDate = async (dueDate: string) => {
  return await api.get<TaskResponse[]>(`/task/GetTasksByDueDate?dueDate=${dueDate}`);
}



export const deleteCategory = async (categoryId: string) => {
  return await api.delete(`/category/DeleteCategory/${categoryId}`);
}

