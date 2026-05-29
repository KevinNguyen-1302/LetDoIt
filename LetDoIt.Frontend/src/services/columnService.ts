import api from './api';


export interface Column {
  columnId: string;
  title: string;
  position: number;
  userId: string;
};

export interface ColumnResponse {
  columnId: string;
  title: string;
  position: number;
  userId: string;
}

export const getColumns = async (): Promise<ColumnResponse[]> => {
  const response = await api.get<any>(`/Column/GetColumns`);
  return response.data?.data || [];
};

export const deleteColumn = async (columnId: string): Promise<boolean> => {
  const response = await api.delete<any>(`/Column/DeleteColumn/${columnId}`);
  return response.data?.data || false;
};

export const updateColumn = async (columnId: string, title: string): Promise<boolean> => {
  const response = await api.put<any>(`/Column/UpdateColumn/${columnId}`, { title });
  return response.data?.data || false;
};

export const createColumn = async (title: string, position: number = 0, projectId?: string): Promise<ColumnResponse> => {
  const response = await api.post<any>(`/Column/CreateColumn`, { title, position, projectId });
  return response.data?.data;
};

export const changeColumnPosition = async (columnId: string, newPosition: number): Promise<boolean> => {
  const response = await api.put<any>(`/Column/ChangeColumnPosition?columnId=${columnId}&newPosition=${newPosition}`);
  return response.data?.data || false;
};

export const getColumnsByProject = async (projectId: string): Promise<ColumnResponse[]> => {
  const response = await api.get<any>(`/Column/GetColumnsByProject/${projectId}`);
  return response.data?.data || [];
};
