import api from './api';

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string; // ISO string format
  categoryId?: string | null; // Can be null if no category selected
  priority: number; // 1=Low, 2=Medium, 3=High, 4=Urgent
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

