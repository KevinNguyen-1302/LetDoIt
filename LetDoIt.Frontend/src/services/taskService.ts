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
  columnId?: string; // Add columnId
  visibility: number; // 1 = Private, 2 = Public
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

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  categoryId?: string | null;
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

export const createCategory = async (category: CategoryResponse) => {
  return await api.post('/category/CreateCategory', category);
}

export const deleteCategory = async (categoryId: string) => {
  return await api.delete(`/category/DeleteCategory/${categoryId}`);
}

export const updateCategory = async (category: CategoryResponse) => {
  return await api.put(`/category/UpdateCategory/${category.categoryId}`, category);
}