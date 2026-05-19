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

export const getColumns = async () => {
  return await api.get<ColumnResponse[]>(`/Column/GetColumns`);
};


export const deleteColumn = async (columnId: string) => {
  return await api.delete<boolean>(`/Column/DeleteColumn/${columnId}`);
};

export const updateColumn = async (columnId: string, title: string) => {
  return await api.put<boolean>(`/Column/UpdateColumn/${columnId}`, { title });
};

export const createColumn = async (title: string, position: number = 0) => {
  return await api.post<ColumnResponse>(`/Column/CreateColumn`, { title, position });
};

export const changeColumnPosition = async (columnId: string, newPosition: number) => {
  return await api.put<boolean>(`/Column/ChangeColumnPosition?columnId=${columnId}&newPosition=${newPosition}`);
};
