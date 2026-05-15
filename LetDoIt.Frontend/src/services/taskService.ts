import api from './api';

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string; // ISO string format
  categoryId?: string | null; // Can be null if no category selected
  priority: number; // 1=Low, 2=Medium, 3=High, 4=Urgent
}

export interface TaskResponse {
  taskId: string;
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  categoryId?: string;
  category?: CategoryResponse;
  userId: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface CategoryResponse {
  categoryId: string;
  name: string;
  colorCode: string;
  iconName: string;
}

export const createTask = async (taskData: CreateTaskRequest) => {
  return await api.post('/task/CreateTask', taskData);
};

export const getMyCategories = async () => {
  return await api.get<CategoryResponse[]>('/category/GetCategories');
};

export const getMyTasks = async () => {
  return await api.get<TaskResponse[]>('/task/GetMyTask');
};

export const getTasksByUserId = async (userId: string) => {
  return await api.get<TaskResponse[]>(`/task/GetTasksByUserId?userId=${userId}`);
};
