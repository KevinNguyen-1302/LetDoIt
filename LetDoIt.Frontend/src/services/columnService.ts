import api from './api';

export interface ColumnResponse {
  columnId: string;
  title: string;
  position: number;
  userId: string;
  createdAt: string;
}

export const getColumns = async (userId: string) => {
  return await api.get<ColumnResponse[]>(`/Column/GetColumns?userId=${userId}`);
};
