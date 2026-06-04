import api from "./api";

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string; // ISO string format
  categoryId?: string | null; // Can be null if no category selected
  priority: number; // 1=Low, 2=Medium, 3=High, 4=Urgent
  columnId?: string;
  visibility?: number;
  assigneeId?: string | null;
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
  assigneeId?: string | null;
  assigneeName?: string | null;
  assigneeAvatarUrl?: string | null;
  createdByName?: string | null; // Name of the user who created the task
}

export interface CategoryResponse {
  categoryId: string;
  name: string;
  colorCode: string;
  iconName: string;
}

export const createTask = async (
  taskData: CreateTaskRequest,
): Promise<TaskResponse> => {
  const response = await api.post<any>("/task/CreateTask", taskData);
  return response.data?.data;
};

export const getMyCategories = async (): Promise<CategoryResponse[]> => {
  const response = await api.get<any>("/category/GetCategories");
  return response.data?.data || [];
};

export const getMyTasks = async (): Promise<TaskResponse[]> => {
  const response = await api.get<any>("/task/GetMyTask");
  return response.data?.data || [];
};

export const getTasksByUserId = async (
  userId: string,
): Promise<TaskResponse[]> => {
  const response = await api.get<any>(
    `/task/GetTasksByUserId?userId=${userId}`,
  );
  return response.data?.data || [];
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

export const updateTask = async (
  taskId: string,
  taskData: UpdateTaskRequest,
): Promise<boolean> => {
  const response = await api.put<any>(`/task/UpdateTask/${taskId}`, taskData);
  return response.data?.data || false;
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  const response = await api.delete<any>(`/task/DeleteTask/${taskId}`);
  return response.data?.data || false;
};

export const moveTask = async (
  taskId: string,
  newColumnId: string,
): Promise<boolean> => {
  const response = await api.put<any>(`/task/MoveTask/${taskId}`, {
    newColumnId: newColumnId,
  });
  return response.data?.data || false;
};

export const getTasksByProject = async (
  projectId: string,
): Promise<TaskResponse[]> => {
  const response = await api.get<any>(`/task/GetTasksByProject/${projectId}`);
  return response.data?.data || [];
};

export const createCategory = async (
  category: CategoryResponse,
): Promise<CategoryResponse> => {
  const response = await api.post<any>("/category/CreateCategory", category);
  return response.data?.data;
};

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  const response = await api.delete<any>(
    `/category/DeleteCategory/${categoryId}`,
  );
  return response.data?.data || false;
};

export const updateCategory = async (
  category: CategoryResponse,
): Promise<boolean> => {
  const response = await api.put<any>(
    `/category/UpdateCategory/${category.categoryId}`,
    category,
  );
  return response.data?.data || false;
};
