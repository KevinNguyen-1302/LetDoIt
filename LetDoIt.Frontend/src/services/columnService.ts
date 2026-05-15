import api from './api';

export const CreateColumn = async (columnData: any) => {
  const response = await api.post('/column', columnData);
  return response.data;
};

export const UpdateColumn = async (columnId: string, columnData: any) => {
  const response = await api.put(`/column/${columnId}`, columnData);
  return response.data;
};

export const DeleteColumn = async (columnId: string) => {
  const response = await api.delete(`/column/${columnId}`);
  return response.data;
};

export const ChangeColumnPosition = async (columnId: string, newPosition: number) => {
  const response = await api.post(`/column/${columnId}/change-position`, { newPosition });
  return response.data;
};

export const GetColumnsByUserId = async () => {
  const response = await api.get(`/column/GetColumns`);
  return response;
};

export interface Column {
  columnId: string;
  title: string;
  position: number;
  userId: string;
};

export interface CreateColumnRequest {
    title: string;
}

export interface UpdateColumnRequest {
    title: string;
}

